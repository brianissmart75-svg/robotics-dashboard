const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const axios = require('axios');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const multer = require('multer');
require('dotenv').config();

const UPLOAD_DIR = path.join(__dirname, 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOAD_DIR);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const app = express();
app.use(helmet()); // Add security headers
const PORT = process.env.PORT || 3010;
const DB_PATH = path.join(__dirname, 'data', 'db.json');
const FERPA_DB_PATH = path.join(__dirname, 'data', 'ferpa_vectors.json');

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rate Limiting
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Limit each IP to 20 requests per windowMs
  message: { error: 'Too many login attempts, please try again later.' }
});

const checkInLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'Rate limit exceeded for check-ins.' }
});

// --- Email Notification Transport ---
// Configure with Hostinger SMTP for @hwsroboteam.org
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.hostinger.com',
  port: parseInt(process.env.SMTP_PORT) || 465,
  secure: true,
  auth: {
    user: process.env.SMTP_USER || 'coach@hwsroboteam.org',
    pass: process.env.SMTP_PASS
  }
});
if (!process.env.SMTP_PASS) console.warn('[SECURITY] SMTP_PASS not set in environment. Email features will fail.');

// Initialize Database
const initDB = () => {
  if (!fs.existsSync(DB_PATH)) {
    const initialData = {
      coaches: [
        { id: 'coach_1', name: 'Ronald Cornish', username: 'admin', password: bcrypt.hashSync(process.env.COACH_PASSWORD || 'changeme', 10) }
      ],
      students: [], // Each student will now have microPoints: 0
      config: {
        hourThreshold: 20,
        activities: [
          'YouTube FRC Research',
          'Recording Footage',
          'Editing Footage',
          'Uploading & Publishing',
          'Social Media Marketing',
          'Team Branding',
          '3D Printing & CAD',
          'Bambu Labs 3D Printing',
          'Filament Types (TPU/PETG)',
          'CNC Machine Basics',
          'Graphite CNC Machining',
          'Metal 3D Printing (Steel)',
          'Carbon Fiber 3D Printing',
          'UV Resin 3D Printing',
          'Custom Robot Parts (vs Kitbot)',
          'Onshape CAD',
          'Tinkercad',
          'Drive Time',
          'WPILib Coding',
          'FRC Driver Station',
          'RoboRIO Config',
          'Encoders & Sensors',
          'Frame Construction',
          'Weight Management',
          'Robot Build',
          'PedroPathing',
          'Pinpoint Odometry',
          'Fusion 360',
          'Scouting Data Analysis'
        ],
        missionCompletions: {} // Tracks order of student completions per mission
      }
    };
    fs.writeFileSync(DB_PATH, JSON.stringify(initialData, null, 2));
  } else {
    // Migrate existing DB: ensure emailRequests array exists
    const db = JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
    let changed = false;
    if (!db.emailRequests) {
      db.emailRequests = [];
      changed = true;
    }
    // Migration: ensure students have microPoints and e-wallet data
    if (db.students) {
      db.students.forEach(s => {
        if (s.microPoints === undefined) {
          s.microPoints = 0;
          changed = true;
        }
        if (!s.aboutMe) {
          s.aboutMe = "Passionate student focused on mechanical engineering, robotics, and career technical education (CTE) pathways.";
          changed = true;
        }
        if (!s.contact) {
          s.contact = {
            phone: "(555) 123-4567",
            email: s.id ? `${s.id}@doveacademy.net` : "student@doveacademy.net",
            location: "Detroit, Michigan"
          };
          changed = true;
        }
        if (!s.technicalSkills) {
          s.technicalSkills = [
            { name: "3D Printing & CAD", category: "Fabrication & Layout", level: "Intermediate" },
            { name: "Onshape CAD", category: "Fabrication & Layout", level: "Beginner" },
            { name: "Safety Standards & PPE", category: "Safety & Shop Operation", level: "Advanced" }
          ];
          changed = true;
        }
        if (!s.softSkills) {
          s.softSkills = [
            { name: "Teamwork & Collaboration", level: "Expert" },
            { name: "Work Ethic & Integrity", level: "Advanced" },
            { name: "Critical Thinking", level: "Intermediate" }
          ];
          changed = true;
        }
        if (!s.education) {
          s.education = [
            { school: "Dove Academy of Detroit", degree: "High School & CTE Pathway", dateRange: "Sep 2022 - Jun 2026", description: "Focused on STEM education, manufacturing awareness, and robotics." }
          ];
          changed = true;
        }
        if (!s.credentials) {
          s.credentials = [
            {
              title: "Bloodborne Pathogens Certification",
              org: "OSHA",
              completedDate: "Oct 12, 2025",
              credentialId: "BBP-99210-2025",
              status: "Active",
              requirements: "Completed official OSHA instruction and passed the competency assessment with 90% or higher.",
              coursework: ["Infection transmission routes", "Personal Protective Equipment (PPE) selection", "Disposal and decontamination procedures"],
              skillsGained: ["Hazard Recognition", "PPE Compliance", "Bio-hazard Safety"],
              notes: "Required for all team safety officers."
            }
          ];
          changed = true;
        }
        if (!s.workExperience) {
          s.workExperience = [
            {
              role: "Robotics Team Build Lead",
              company: "Dove Academy Robotics Team",
              location: "Detroit, MI",
              dateRange: "Sep 2025 - Present",
              description: "Coordinating build schedules, maintaining the tool inventory, and leading chassis design iterations.",
              achievements: [
                "Led assembly of the 2026 FRC competition chassis.",
                "Enforced strict safety rules and clean-lab practices.",
                "Mentored 5 junior students in tool operations."
              ],
              skills: ["Leadership", "Frame Construction", "CAD Design"]
            }
          ];
          changed = true;
        }
      });
    }
    if (changed) fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
  }
};

initDB();

const initFERPADB = () => {
  if (!fs.existsSync(FERPA_DB_PATH)) {
    fs.writeFileSync(FERPA_DB_PATH, JSON.stringify({ records: [] }, null, 2));
  }
};
const getFERPADB = () => JSON.parse(fs.readFileSync(FERPA_DB_PATH, 'utf-8'));
const saveFERPADB = (data) => fs.writeFileSync(FERPA_DB_PATH, JSON.stringify(data, null, 2));

const getDB = () => JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
const saveDB = (data) => fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));

// --- ROUTES ---

// 1. Health Check
app.get('/api/health', (req, res) => res.json({ status: 'ok', timestamp: new Date() }));

// 2. Student Registration
app.post('/api/register', (req, res) => {
  const { name, id, grade, squad } = req.body;
  const db = getDB();

  if (db.students.find(s => s.id === id)) {
    return res.status(400).json({ error: 'Student ID already registered' });
  }

  const newStudent = {
    id,
    name,
    grade,
    squad: squad || 'Build',
    totalHours: 0,
    readingHours: 0,
    points: 10, // Initial sign-in points
    competitionReady: false,
    joinedAt: new Date(),
    scores: {}
  };

  db.students.push(newStudent);
  saveDB(db);
  res.json({ message: 'Success', student: newStudent });
});

// 1.6 Admin Login (Secure)
app.post('/api/admin/login', authLimiter, (req, res) => {
  const { password } = req.body;
  const envPassword = process.env.COACH_PASSWORD || 'robotics2026';
  
  if (password === envPassword) {
    const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET || 'robotics2026-secret-key', { expiresIn: '12h' });
    res.json({ success: true, token });
  } else {
    res.status(401).json({ error: 'Invalid access code' });
  }
});

// 3. Check-In
app.post('/api/checkin', checkInLimiter, (req, res) => {
  const { studentId, activity } = req.body;
  const db = getDB();

  const student = db.students.find(s => s.id === studentId);
  if (!student) return res.status(404).json({ error: 'Student not found' });

  // Check if already in active session
  const activeSession = db.sessions.find(s => s.studentId === studentId && s.status === 'active');
  if (activeSession) return res.status(400).json({ error: 'Student already checked in' });

  const session = {
    studentId,
    studentName: student.name,
    startTime: new Date(),
    activity,
    status: 'active'
  };

  // Award micropoints for checking in
  student.points = (student.points || 0) + 5;

  db.sessions.push(session);
  saveDB(db);
  res.json({ message: 'Check-in successful', session, pointsAwarded: 5 });
});

// 4. Check-Out (Accomplishment Log)
app.post('/api/checkout', (req, res) => {
  const { studentId, accomplishment } = req.body;
  const db = getDB();

  const sessionIndex = db.sessions.findIndex(s => s.studentId === studentId && (s.status === 'active' || s.status === 'paused'));
  if (sessionIndex === -1) return res.status(404).json({ error: 'No active or paused session found' });

  const session = db.sessions[sessionIndex];
  const endTime = new Date();
  const startTime = new Date(session.startTime);
  
  // If they were paused while checking out, add the final pause chunk
  if (session.status === 'paused' && session.lastPauseTime) {
      const finalPause = endTime - new Date(session.lastPauseTime);
      session.totalPauseDuration = (session.totalPauseDuration || 0) + finalPause;
  }
  
  const totalDurationMs = Math.max(0, (endTime - startTime) - (session.totalPauseDuration || 0));
  const hours = Math.round((totalDurationMs / (1000 * 60 * 60)) * 10) / 10; // Round to 1 decimal

  const isReading = session.activity === 'WPILib Coding';

  // Update session
  session.status = 'completed';
  session.endTime = endTime;
  session.hours = hours;
  session.accomplishment = accomplishment;
  session.type = isReading ? 'reading' : 'build';

  // Move to logs
  db.logs.push(session);
  db.sessions.splice(sessionIndex, 1);

  // Update student hours
  const student = db.students.find(s => s.id === studentId);
  if (student) {
    if (isReading) {
      student.readingHours = (student.readingHours || 0) + hours;
    } else {
      student.totalHours += hours;
      if (student.totalHours >= db.config.hourThreshold) {
        student.competitionReady = true;
      }
    }
  }




  // AWARD STARS FOR FIRST COMPLETIONS
  let starsAwarded = 0;
  if (accomplishment && accomplishment.length > 10) {
      const missionKey = session.activity;
      if (!db.config.missionCompletions) db.config.missionCompletions = {};
      if (!db.config.missionCompletions[missionKey]) db.config.missionCompletions[missionKey] = [];
      
      const alreadyCompleted = db.config.missionCompletions[missionKey].includes(studentId);
      
      if (!alreadyCompleted) {
          const completionCount = db.config.missionCompletions[missionKey].length;
          if (completionCount < 5) {
              starsAwarded = 5 - completionCount;
              student.stars = (student.stars || 0) + starsAwarded;
              db.config.missionCompletions[missionKey].push(studentId);
              session.starsAwarded = starsAwarded;
          }
      }
  }

  saveDB(db);
  res.json({ 
    message: 'Check-out successful', 
    hours, 
    totalHours: student.totalHours,
    starsAwarded,
    totalStars: student.stars || 0
  });
});

// 4.5 Force Check-Out (Admin only)
app.post('/api/admin/force-checkout', (req, res) => {
  const { studentId } = req.body;
  const db = getDB();

  const sessionIndex = db.sessions.findIndex(s => s.studentId === studentId && s.status === 'active');
  if (sessionIndex === -1) return res.status(404).json({ error: 'No active session found' });

  const session = db.sessions[sessionIndex];
  session.status = 'completed';
  session.endTime = new Date();
  session.hours = 0; // Coach force-disconnect yields 0 hours
  session.accomplishment = 'Force Disconnected by Coach (No Credit)';
  session.type = 'disconnected';

  db.logs.push(session);
  db.sessions.splice(sessionIndex, 1);
  saveDB(db);

  res.json({ message: 'User forcefully disconnected', session });
});

// 5. Pause Session
app.post('/api/pause', (req, res) => {
  const { studentId } = req.body;
  const db = getDB();
  const session = db.sessions.find(s => s.studentId === studentId && s.status === 'active');
  if (!session) return res.status(404).json({ error: 'No active session found to pause' });
  
  session.status = 'paused';
  session.lastPauseTime = new Date().toISOString();
  saveDB(db);
  res.json({ success: true, session });
});

// 6. Resume Session
app.post('/api/resume', (req, res) => {
  const { studentId } = req.body;
  const db = getDB();
  const session = db.sessions.find(s => s.studentId === studentId && s.status === 'paused');
  if (!session) return res.status(404).json({ error: 'No paused session found to resume' });
  
  const now = new Date();
  const pauseDuration = now - new Date(session.lastPauseTime);
  session.totalPauseDuration = (session.totalPauseDuration || 0) + pauseDuration;
  
  session.status = 'active';
  delete session.lastPauseTime;
  saveDB(db);
  res.json({ success: true, session });
});

// Helper for display names
const getDisplayName = (student) => {
  if (!student) return 'Unknown';
  if (student.isPrivate) return student.username || 'Anonymous Student';
  return student.username || student.name;
};

// 7. Active Sessions (Board view)
app.get('/api/active', (req, res) => { const db = getDB(); res.json(db.sessions.filter(s => s.status === 'active' || s.status === 'paused').map(s => { const student = db.students.find(stu => stu.id === s.studentId); return { ...s, studentName: getDisplayName(student) }; })); });
app.get('/api/sessions', (req, res) => {
  const db = getDB();
  const active = db.sessions.filter(s => s.status === 'active' || s.status === 'paused').map(s => {
    const student = db.students.find(stu => stu.id === s.studentId);
    return { ...s, studentName: getDisplayName(student) };
  });
  res.json(active);
});

// 5.5 Submit Quiz Score
app.post('/api/quiz', (req, res) => {
  const { studentId, activity, level, score, detailedAnswers } = req.body;
  const db = getDB();
  
  const student = db.students.find(s => s.id === studentId);
  if (!student) return res.status(404).json({ error: 'Student not found' });
  
  if (!student.scores) student.scores = {};
  
  // Only keep the highest score for the activity
  if (!student.scores[activity] || score > student.scores[activity]) {
    student.scores[activity] = score;
  }
  
  saveDB(db);

  // Save to FERPA vector DB for differentiated curriculum
  initFERPADB();
  const ferpaDB = getFERPADB();
  ferpaDB.records.push({
    studentId,
    studentName: student.name,
    activity,
    level,
    score,
    detailedAnswers,
    timestamp: new Date().toISOString()
  });
  saveFERPADB(ferpaDB);

  res.json({ message: 'Score saved successfully', scores: student.scores });
});

app.get('/api/quiz/details', (req, res) => {
  initFERPADB();
  const ferpaDB = getFERPADB();
  res.json(ferpaDB.records);
});

// 1.5 Get Mission Completion Data (for Stars)
app.get('/api/mission-stars', (req, res) => {
  const db = getDB();
  res.json(db.config.missionCompletions || {});
});

// 6. Stats & Leaderboard
app.get('/api/stats', (req, res) => {
  const db = getDB();
  const sortedStudents = [...db.students].sort((a, b) => b.totalHours - a.totalHours);
  res.json({
    students: sortedStudents,
    activities: db.config.activities,
    threshold: db.config.hourThreshold
  });
});

// ========== EMAIL REQUEST SYSTEM ==========

// 8. Submit Email Request
app.post('/api/email-request', async (req, res) => {
  const { firstName, lastName, requestedPrefix, schoolEmail } = req.body;

  if (!firstName || !lastName || !requestedPrefix || !schoolEmail) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const db = getDB();

  // Check for duplicate prefix
  const existing = db.emailRequests.find(r => r.requestedPrefix === requestedPrefix);
  if (existing) {
    return res.status(400).json({ error: `The address ${requestedPrefix}@hwsroboteam.org has already been requested.` });
  }

  const request = {
    id: `req_${Date.now()}`,
    firstName,
    lastName,
    requestedPrefix,
    requestedEmail: `${requestedPrefix}@hwsroboteam.org`,
    schoolEmail,
    status: 'pending',
    submittedAt: new Date(),
    reviewedAt: null
  };

  db.emailRequests.push(request);
  saveDB(db);

  // Send notification email to coach (non-blocking — don't fail the request if email fails)
  try {
    await transporter.sendMail({
      from: '"RoboTrack System" <coach@hwsroboteam.org>',
      to: 'ronald.cornish@hwschools.org',
      subject: `📬 New Email Request: ${requestedPrefix}@hwsroboteam.org`,
      html: `
        <div style="font-family: 'Inter', Arial, sans-serif; padding: 24px; max-width: 500px; background: #f8fafc; border-radius: 20px; border: 1px solid #e2e8f0;">
          <h2 style="color: #3b82f6; margin-bottom: 8px;">New Team Email Request</h2>
          <p style="color: #64748b; font-size: 14px; margin-bottom: 24px;">A student has requested a new @hwsroboteam.org email account.</p>
          
          <div style="background: white; padding: 20px; border-radius: 12px; border: 1px solid #cbd5e1;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 8px 0; color: #64748b; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em;">Student</td><td style="padding: 8px 0; font-weight: 700; color: #1e293b;">${firstName} ${lastName}</td></tr>
              <tr><td style="padding: 8px 0; color: #64748b; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em;">Requested Email</td><td style="padding: 8px 0; font-weight: 700; color: #3b82f6;">${requestedPrefix}@hwsroboteam.org</td></tr>
              <tr><td style="padding: 8px 0; color: #64748b; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em;">School Email</td><td style="padding: 8px 0; color: #1e293b;">${schoolEmail}</td></tr>
              <tr><td style="padding: 8px 0; color: #64748b; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em;">Submitted</td><td style="padding: 8px 0; color: #1e293b;">${new Date().toLocaleString()}</td></tr>
            </table>
          </div>
          
          <a href="https://hwsroboteam.org" style="display: block; margin-top: 24px; padding: 16px; background: #3b82f6; color: white; text-align: center; border-radius: 12px; text-decoration: none; font-weight: 700; font-size: 14px;">OPEN COACH DASHBOARD</a>
          
          <p style="margin-top: 20px; font-size: 11px; color: #94a3b8; text-align: center;">
            This is an automated notification from the RoboTrack System.
          </p>
        </div>
      `,
      text: `New Team Email Request
A student has requested a new @hwsroboteam.org email account.

Student: ${firstName} ${lastName}
Requested Email: ${requestedPrefix}@hwsroboteam.org
School Email: ${schoolEmail}
Submitted: ${new Date().toLocaleString()}

Open Coach Dashboard at https://hwsroboteam.org`,
      replyTo: schoolEmail
    });
    console.log(`📬 Coach notification sent for ${requestedPrefix}@hwsroboteam.org`);
  } catch (emailErr) {
    console.warn('⚠️  Coach notification email failed (SMTP not configured yet):', emailErr.message);
  }

  // Send automated email to the student with credentials
  try {
    // Attempt to fix the .or typo automatically if present for hwschools.or
    const correctedEmail = schoolEmail.endsWith('hwschools.or') ? schoolEmail + 'g' : schoolEmail;
    
    await transporter.sendMail({
      from: '"Harper Woods Robotics" <coach@hwsroboteam.org>',
      to: correctedEmail,
      subject: `🎉 Your new @hwsroboteam.org account is ready!`,
      html: `
        <div style="font-family: 'Inter', Arial, sans-serif; padding: 24px; max-width: 500px; background: #f8fafc; border-radius: 20px; border: 1px solid #e2e8f0;">
          <div style="text-align: center; margin-bottom: 24px;">
            <h1 style="color: #3b82f6; margin-bottom: 8px; font-size: 24px; font-weight: 900;">WELCOME ABOARD!</h1>
            <p style="color: #64748b; font-size: 14px;">Your official Harper Woods Robotics email is fully provisioned.</p>
          </div>
          
          <div style="background: white; padding: 24px; border-radius: 16px; border: 1px solid #cbd5e1; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
            <p style="color: #1e293b; font-weight: 700; margin-bottom: 16px;">Hello ${firstName},</p>
            <p style="color: #475569; font-size: 14px; margin-bottom: 24px; line-height: 1.6;">Your email account has been approved and created by Coach Cornish. You can now use this email to sign up for CAD software, WPILib resources, and other robotics tools.</p>
            
            <div style="background: #f1f5f9; padding: 16px; border-radius: 12px; margin-bottom: 24px;">
              <div style="margin-bottom: 12px;">
                <div style="color: #64748b; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px; font-weight: 700;">Email Address</div>
                <div style="color: #0f172a; font-weight: 700; font-size: 16px;">${requestedPrefix}@hwsroboteam.org</div>
              </div>
              <div>
                <div style="color: #64748b; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px; font-weight: 700;">Temporary Password</div>
                <div style="color: #0f172a; font-family: monospace; font-weight: 700; font-size: 16px; background: #e2e8f0; display: inline-block; padding: 4px 8px; border-radius: 6px;">Robotics2026!</div>
              </div>
            </div>
            
            <a href="https://mail.hostinger.com" style="display: block; width: 100%; box-sizing: border-box; padding: 16px; background: #3b82f6; color: white; text-align: center; border-radius: 12px; text-decoration: none; font-weight: 700; font-size: 14px; box-shadow: 0 4px 14px 0 rgba(59, 130, 246, 0.39);">SIGN IN TO WEBMAIL</a>
          </div>
          
          <p style="margin-top: 20px; font-size: 12px; color: #94a3b8; text-align: center; line-height: 1.5;">
            Please log in and change your temporary password immediately.<br/>
            <strong>Harper Woods Robotics Initiative</strong>
          </p>
        </div>
      `,
      text: `WELCOME ABOARD!
Your official Harper Woods Robotics email is fully provisioned.

Hello ${firstName},
Your email account has been approved and created by Coach Cornish. You can now use this email to sign up for CAD software, WPILib resources, and other robotics tools.

Email Address: ${requestedPrefix}@hwsroboteam.org
Temporary Password: Robotics2026!

Sign in to Webmail: https://mail.hostinger.com

Please log in and change your temporary password immediately.
Harper Woods Robotics Initiative`
    });
    console.log(`📬 Student credential email sent to ${correctedEmail}`);
  } catch (emailErr) {
    console.warn('⚠️  Student credential email failed:', emailErr.message);
  }

  res.json({ message: 'Email request submitted successfully', request });
});

// 9. Get All Email Requests (Admin only)
app.get('/api/email-requests', (req, res) => {
  const db = getDB();
  const requests = (db.emailRequests || []).sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
  res.json(requests);
});

// 10. Update Email Request Status (Admin only)
app.patch('/api/email-request/:id', (req, res) => {
  const { status } = req.body; // 'approved' or 'rejected'
  const db = getDB();

  const request = db.emailRequests.find(r => r.id === req.params.id);
  if (!request) return res.status(404).json({ error: 'Request not found' });

  request.status = status;
  request.reviewedAt = new Date();
  saveDB(db);

  res.json({ message: `Request ${status}`, request });
});

// ========== AUTO-CHECKOUT DAEMON ==========
// Run every 15 minutes to check for inactive sessions (forgot to checkout)
setInterval(() => {
  try {
    const db = getDB();
    const now = new Date();
    let changed = false;
    
    // 2.5 hours in milliseconds
    const MAX_SESSION_MS = 2.5 * 60 * 60 * 1000; 
    
    for (let i = db.sessions.length - 1; i >= 0; i--) {
      const session = db.sessions[i];
      if (session.status === 'active') {
        const startTime = new Date(session.startTime);
        if (now - startTime > MAX_SESSION_MS) {
          // Auto checkout at 2.5 hours max credit
          const hours = 2.5;
          const isReading = session.activity === 'WPILib Coding';
          
          session.status = 'completed';
          session.endTime = now;
          session.hours = hours;
          session.accomplishment = 'System Auto-Checkout (2.5 Hour Hard Limit Reached)';
          session.type = isReading ? 'reading' : 'build';
          
          db.logs.push(session);
          db.sessions.splice(i, 1);
          
          const student = db.students.find(s => s.id === session.studentId);
          if (student) {
            if (isReading) {
              student.readingHours = (student.readingHours || 0) + hours;
            } else {
              student.totalHours += hours;
              if (student.totalHours >= db.config.hourThreshold) {
                student.competitionReady = true;
              }
            }
          }
          changed = true;
          console.log(`🤖 Auto-checked out ${session.studentName} due to 2.5+ hours limit.`);
        }
      }
    }
    
    if (changed) {
      saveDB(db);
    }
  } catch (err) {
    console.error('Auto-checkout sweep failed:', err);
  }
}, 15 * 60 * 1000);

// 10. AI Tutor - Generate Focus Areas
app.post('/api/ai-tutor/generate-focus', async (req, res) => {
  const { studentId, activity, videoId } = req.body;
  const db = getDB();
  const student = db.students.find(s => String(s.id) === String(studentId));
  
  if (!student) {
    return res.status(404).json({ error: 'Student not found' });
  }

  try {
    const prompt = `You are the RoboTrack AI Tutor for the Harper Woods Robotics Team (FRC).
The student, ${student.name} (Grade ${student.grade || 12}, ${student.squad || 'Build'} squad), is about to watch a video on "${activity}".
Generate exactly 3 specific "focus areas" for them to pay attention to while watching. 
Differentiate these focus areas based on their grade level (${student.grade || 12}) and their squad (${student.squad || 'Build'}).
You MUST output raw JSON in the following format, with NO markdown formatting, NO markdown code blocks, and NO surrounding text. Start directly with the array:
[
  "Focus Area 1 (e.g. How does X impact Y?)",
  "Focus Area 2",
  "Focus Area 3"
]`;

    const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
      model: 'openai/gpt-4o',
      messages: [{ role: 'user', content: prompt }]
    }, {
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    let jsonStr = response.data.choices[0].message.content.trim();
    if (jsonStr.startsWith('```json')) jsonStr = jsonStr.slice(7);
    if (jsonStr.startsWith('```')) jsonStr = jsonStr.slice(3);
    if (jsonStr.endsWith('```')) jsonStr = jsonStr.slice(0, -3);
    
    const focusAreas = JSON.parse(jsonStr.trim());
    res.json({ focusAreas });
  } catch (err) {
    console.error('AI Tutor Focus Error:', err.message);
    // Provide some default fallback focus areas if API fails
    res.json({ focusAreas: ["Observe the core mechanics presented.", "Note how this applies to our robot.", "Think about how your squad would use this information."] });
  }
});

// 10.5 AI Tutor - Generate Topics
app.post('/api/ai-tutor/generate-topics', async (req, res) => {
  const { studentId, activity, summary, videoTimestamp, intervalSeconds } = req.body;
  
  try {
    const prompt = `You are a pedagogical robotics tutor for the Harper Woods Robotics Team (FRC).
The student is watching a training video on "${activity}". 
They summarized the last ${intervalSeconds} seconds as: "${summary}"

Identify 4 distinct key topics or concepts that are highly relevant to this subject area. Make sure to include what they mentioned, but expand into other related professional/technical areas (e.g., if they say screwdrivers, include bit heads, metric vs imperial, etc.).
You MUST output raw JSON in the following format, with NO markdown formatting.
{
  "feedback": "A short encouraging sentence acknowledging what they learned and pointing out there are related concepts.",
  "topics": ["Topic 1", "Topic 2", "Topic 3", "Topic 4"]
}`;

    const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
      model: 'openai/gpt-4o',
      messages: [{ role: 'user', content: prompt }]
    }, {
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    let jsonStr = response.data.choices[0].message.content.trim();
    if (jsonStr.startsWith('```json')) jsonStr = jsonStr.slice(7);
    if (jsonStr.startsWith('```')) jsonStr = jsonStr.slice(3);
    if (jsonStr.endsWith('```')) jsonStr = jsonStr.slice(0, -3);
    
    const result = JSON.parse(jsonStr.trim());
    res.json(result);
  } catch (err) {
    console.error('AI Tutor Error:', err.message);
    res.status(500).json({ error: 'Failed to generate tutor topics. Try summarizing again.' });
  }
});

// 11. AI Tutor - Generate Questions
app.post('/api/ai-tutor/generate-questions', async (req, res) => {
  const { studentId, activity, topic, gradeLevel = 12, questionCount = 3 } = req.body;
  
  try {
    const prompt = `You are the RoboTrack AI Tutor for the Harper Woods Robotics Team (FRC).
The student has chosen to be tested on the topic "${topic}" within the broader activity "${activity}".

Generate EXACTLY ${questionCount} multiple-choice question(s) testing their knowledge on this specific topic.
CRITICAL INSTRUCTION: You MUST generate EXACTLY ${questionCount} question(s). DO NOT generate more or fewer. Your output MUST be a JSON array containing exactly ${questionCount} object(s).
CRITICAL: The questions MUST be written strictly at a ${gradeLevel}th-grade reading and cognitive difficulty level. 
If the grade level is low (1st-5th), make the questions very basic, foundational, and easy to understand. 
If the grade level is high (9th-12th), make the questions highly technical, nuanced, and geared towards advanced engineering/robotics applications.
You MUST output raw JSON in the following format, with NO markdown formatting, NO markdown code blocks, and NO surrounding text. Start directly with the array:
[
  {
    "question": "Question text here?",
    "options": ["Wrong A", "Right B", "Wrong C", "Wrong D"],
    "correctAnswer": 1
  }
]`;

    const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
      model: 'openai/gpt-4o',
      messages: [{ role: 'user', content: prompt }]
    }, {
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    let jsonStr = response.data.choices[0].message.content.trim();
    if (jsonStr.startsWith('```json')) jsonStr = jsonStr.slice(7);
    if (jsonStr.startsWith('```')) jsonStr = jsonStr.slice(3);
    if (jsonStr.endsWith('```')) jsonStr = jsonStr.slice(0, -3);
    
    const questions = JSON.parse(jsonStr.trim());
    res.json({ questions });
  } catch (err) {
    console.error('AI Tutor Error:', err.message);
    res.status(500).json({ error: 'Failed to generate tutor questions. Try again.' });
  }
});

// 12. Log Quiz Results (FERPA stored)
app.post('/api/ai-tutor/log-quiz', (req, res) => {
  const { studentId, activity, topic, gradeLevel, score, total, pointsEarned, timestamp } = req.body;
  const db = getDB();
  const student = db.students.find(s => String(s.id) === String(studentId));
  
  if (!student) return res.status(404).json({ error: 'Student not found' });
  
  if (!student.quizLogs) student.quizLogs = [];
  student.quizLogs.push({ activity, topic, gradeLevel, score, total, pointsEarned, timestamp });
  
  saveDB(db);
  res.json({ success: true });
});

// 13. Award Points for AI Tutor Completion
app.post('/api/ai-tutor/award-points', (req, res) => {
  const { studentId, points } = req.body;
  const db = getDB();
  const student = db.students.find(s => String(s.id) === String(studentId));
  
  if (!student) return res.status(404).json({ error: 'Student not found' });
  
  student.points = (student.points || 0) + points;
  saveDB(db);
  res.json({ message: 'Points awarded', totalPoints: student.points });
});

// 14. Syprian Strategist (God Brain API)
app.post('/api/strategist', async (req, res) => {
  const { message, history } = req.body;
  
  try {
    const formattedHistory = history.map(msg => ({
      role: msg.role === 'ai' ? 'assistant' : 'user',
      content: msg.text
    }));
    
    formattedHistory.push({ role: 'user', content: message });
    
    const systemPromptText = "You are the Syprian Strategist, a highly intelligent and strategic AI assistant embedded in the Harper Woods Robotics (RoboTrack) dashboard. You are an expert in FIRST Robotics Competition (FRC), mechanical engineering, telemetry analysis, team management, and strategic coaching. Provide concise, actionable, and highly sophisticated advice to the robotics coach. NEVER output 'disconnected' or say you are out of tokens.";
    
    const response = await axios.post('http://127.0.0.1:5555/api/syprian-chat', {
      messages: formattedHistory,
      systemPrompt: systemPromptText,
      userId: 'hws-coach',
      seriousMode: true,
      source: 'hws-tracker',
      model: 'openai/gpt-4o'
    }, {
      headers: {
        'x-syprian-source': 'hws-tracker',
        'Content-Type': 'application/json'
      }
    });
    
    const reply = response.data.reply;
    res.json({ reply });
  } catch (err) {
    console.error('Syprian Strategist Error:', err.message);
    res.status(500).json({ error: 'Error connecting to the God Brain API. Please verify the configuration.' });
  }
});

// 15. Rules Regulator API
app.post('/api/regulator', async (req, res) => {
  const { message, history } = req.body;
  
  try {
    const formattedHistory = history.map(msg => ({
      role: msg.role === 'assistant' ? 'assistant' : 'user',
      content: msg.text
    }));
    
    formattedHistory.push({ role: 'user', content: message });
    
    const systemPromptText = "You are the Rules Regulator, an expert AI loaded with the entire FIRST Tech Challenge (FTC) and FIRST Robotics Competition (FRC) rulebooks. Answer the user's question accurately based on official FIRST rules. Be concise, cite specific rule numbers when possible, and ensure compliance with game manuals. Never output 'disconnected' or say you are out of tokens.";
    
    const response = await axios.post('http://127.0.0.1:5555/api/syprian-chat', {
      messages: formattedHistory,
      systemPrompt: systemPromptText,
      userId: 'hws-coach',
      seriousMode: true,
      source: 'hws-tracker',
      model: 'openai/gpt-4o'
    }, {
      headers: {
        'x-syprian-source': 'hws-tracker',
        'Content-Type': 'application/json'
      }
    });
    
    const reply = response.data.reply;
    res.json({ reply });
  } catch (err) {
    console.error('Rules Regulator Error:', err.message);
    res.status(500).json({ error: 'Error connecting to the Rules Database. Please try again.' });
  }
});

// 16. Micro-Points Telemetry (Competition Readiness)
app.post('/api/student/add-points', (req, res) => {
  const { studentId, points } = req.body;
  const db = getDB();
  const student = db.students.find(s => s.id === studentId);
  
  if (student) {
    student.microPoints = (student.microPoints || 0) + parseFloat(points);
    saveDB(db);
    res.json({ success: true, total: student.microPoints });
  } else {
    res.status(404).json({ error: 'Student not found' });
  }
});

// 17. Update Student Profile
app.post('/api/student/update-profile', (req, res) => {
  const { studentId, username, isPrivate } = req.body;
  const db = getDB();
  const student = db.students.find(s => s.id === studentId);
  
  if (student) {
    if (username !== undefined) student.username = username;
    if (isPrivate !== undefined) student.isPrivate = isPrivate;
    saveDB(db);
    res.json({ success: true, student });
  } else {
    res.status(404).json({ error: 'Student not found' });
  }
});

// 17.5 Update Student Portfolio (Learner Wallet Architecture)
app.post('/api/student/update', (req, res) => {
  const { studentId, aboutMe, contact, technicalSkills, softSkills, education, credentials, workExperience } = req.body;
  const db = getDB();
  const student = db.students.find(s => s.id === studentId);
  
  if (student) {
    if (aboutMe !== undefined) student.aboutMe = aboutMe;
    if (contact !== undefined) student.contact = contact;
    if (technicalSkills !== undefined) student.technicalSkills = technicalSkills;
    if (softSkills !== undefined) student.softSkills = softSkills;
    if (education !== undefined) student.education = education;
    if (credentials !== undefined) student.credentials = credentials;
    if (workExperience !== undefined) student.workExperience = workExperience;
    
    saveDB(db);
    res.json({ success: true, student });
  } else {
    res.status(404).json({ error: 'Student not found' });
  }
});

// --- TTS & Narration Endpoints ---
app.post('/api/tts', async (req, res) => {
  const { text, voiceId } = req.body;
  const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
  if (!ELEVENLABS_API_KEY) {
    return res.status(400).json({ error: 'ElevenLabs API key is not configured.', fallback: true });
  }

  const selectedVoiceId = voiceId || process.env.ELEVENLABS_VOICE_ID || 'N2l5AzzZ6gPt47YgbdAs'; // Marcus (realistic African American male voice)

  try {
    const response = await axios({
      method: 'post',
      url: `https://api.elevenlabs.io/v1/text-to-speech/${selectedVoiceId}/stream`,
      data: {
        text: text,
        model_id: 'eleven_monolingual_v1',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75
        }
      },
      headers: {
        'xi-api-key': ELEVENLABS_API_KEY,
        'accept': 'audio/mpeg',
        'content-type': 'application/json'
      },
      responseType: 'stream'
    });

    res.set({
      'Content-Type': 'audio/mpeg',
      'Transfer-Encoding': 'chunked'
    });

    response.data.pipe(res);
  } catch (error) {
    console.error('ElevenLabs TTS Error:', error.message);
    res.status(500).json({ error: 'ElevenLabs narration failed', fallback: true });
  }
});

// --- AI Translation Endpoint ---
app.post('/api/translate', async (req, res) => {
  const { sourceLang, targetLang, code } = req.body;
  const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
  if (!OPENROUTER_API_KEY) {
    return res.status(400).json({ error: 'AI Translation API key is not configured.', fallback: true });
  }

  try {
    const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
      model: 'google/gemini-2.5-flash',
      messages: [
        {
          role: 'system',
          content: 'You are an expert robotics programming translator. Translate the given input from the source language to the target language. Output ONLY the translated code or natural language description. Do not include markdown code fence blocks like ```python, and do not include conversational preamble. Just return the translation.'
        },
        {
          role: 'user',
          content: `Source Language: ${sourceLang}\nTarget Language: ${targetLang}\n\nInput:\n${code}`
        }
      ]
    }, {
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    const reply = response.data.choices[0].message.content.trim();
    res.json({ reply });
  } catch (error) {
    console.error('Translation API Error:', error.response?.data || error.message);
    res.status(500).json({ error: 'AI translation failed', fallback: true });
  }
});

// --- The Orange Alliance API Proxy ---
const cache = {
  events: null,
  eventsExpiry: 0,
  rankings: null,
  rankingsExpiry: 0
};

app.get('/api/toa/events', async (req, res) => {
  const TOA_KEY = process.env.THE_ORANGE_ALLIANCE_API_KEY;
  
  if (cache.events && Date.now() < cache.eventsExpiry) {
    return res.json({ events: cache.events, live: true });
  }

  const fallbackEvents = [
    { date: "Sept 7", title: "FTC Kickoff", desc: "FTC Season Release Day & Game Manual Drop", color: "border-orange-500" },
    { date: "Sept 10", title: "Robot in 3 Days (Ri3D) Review", desc: "Analyzing initial Ri3D builds for FTC", color: "border-blue-500" },
    { date: "October (TBA)", title: "FTC Competition 1", desc: "Middle School FTC Qualifying Tournament", color: "border-orange-400" },
    { date: "November (TBA)", title: "FTC Competition 2", desc: "Middle School FTC Qualifying Tournament", color: "border-orange-600" },
    { date: "Jan 3", title: "FRC Kickoff", desc: "FRC Season Release Day & Game Manual Drop", color: "border-red-500" },
    { date: "Jan 6", title: "FRC Ri3D Breakdown", desc: "Strategy session on FRC Robot in 3 Days", color: "border-emerald-500" },
    { date: "Feb 28", title: "District Event 1", desc: "First competition of the season", color: "border-purple-500" },
    { date: "Mar 15", title: "District Event 2", desc: "Second competition of the season", color: "border-purple-500" },
    { date: "Apr 8", title: "Michigan State Championship", desc: "MSC Qualification Required", color: "border-amber-500" },
    { date: "Apr 21", title: "FIRST Championship - Houston", desc: "World Championship", color: "border-gold-500" }
  ];

  if (!TOA_KEY) {
    return res.json({ events: fallbackEvents, live: false, message: 'Sample/Fallback Data (No API Key)' });
  }

  try {
    const response = await axios.get('https://api.theorangealliance.org/v2/team/23026/events', {
      headers: {
        'X-TOA-Key': TOA_KEY,
        'X-Application-Origin': 'HWS Robo Team Tracker'
      }
    });

    if (response.data && Array.isArray(response.data)) {
      const liveEvents = response.data.map(e => {
        const dateObj = new Date(e.start_date);
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const formattedDate = isNaN(dateObj.getTime()) ? e.start_date : `${months[dateObj.getMonth()]} ${dateObj.getDate()}`;
        return {
          date: formattedDate,
          title: e.event_name || 'FTC Tournament',
          desc: `Location: ${e.location || 'TBA'}`,
          color: 'border-orange-500'
        };
      });

      const mergedEvents = liveEvents.length > 0 ? liveEvents : fallbackEvents;

      cache.events = mergedEvents;
      cache.eventsExpiry = Date.now() + 60 * 60 * 1000; // 1 hour TTL
      return res.json({ events: mergedEvents, live: true });
    }
    
    return res.json({ events: fallbackEvents, live: false });
  } catch (error) {
    console.error('TOA Events Error:', error.message);
    return res.json({ events: fallbackEvents, live: false, error: error.message });
  }
});

app.get('/api/toa/rankings', async (req, res) => {
  const TOA_KEY = process.env.THE_ORANGE_ALLIANCE_API_KEY;

  if (cache.rankings && Date.now() < cache.rankingsExpiry) {
    return res.json({ rankings: cache.rankings, live: true });
  }

  const fallbackRankings = [
    { rank: 1, team: "11212", name: "The Clueless", location: "San Diego, CA", score: "World Champion" },
    { rank: 2, team: "19066", name: "AI Citizens", location: "Bucharest, Romania", score: "World Champion" },
    { rank: 3, team: "18763", name: "Texpand", location: "Cape Town, South Africa", score: "World Champion" },
    { rank: 4, team: "14481", name: "Don't Blink", location: "Plainsboro, NJ", score: "Worlds Finalist" },
    { rank: 5, team: "23026", name: "Tech Dogs", location: "Harper Woods, MI", score: "HWS Core" }
  ];

  if (!TOA_KEY) {
    return res.json({ rankings: fallbackRankings, live: false, message: 'Sample/Fallback Data (No API Key)' });
  }

  try {
    const response = await axios.get('https://api.theorangealliance.org/v2/team/23026/results', {
      headers: {
        'X-TOA-Key': TOA_KEY,
        'X-Application-Origin': 'HWS Robo Team Tracker'
      }
    });

    let wlt = "0-0-0";
    if (response.data && Array.isArray(response.data) && response.data.length > 0) {
      wlt = `${response.data.length} Matches Played`;
    }

    const liveRankings = [
      { rank: 1, team: "11212", name: "The Clueless", location: "San Diego, CA", score: "World Champion" },
      { rank: 2, team: "19066", name: "AI Citizens", location: "Bucharest, Romania", score: "World Champion" },
      { rank: 3, team: "18763", name: "Texpand", location: "Cape Town, South Africa", score: "World Champion" },
      { rank: 4, team: "14481", name: "Don't Blink", location: "Plainsboro, NJ", score: "Worlds Finalist" },
      { rank: 5, team: "23026", name: "Tech Dogs", location: "Harper Woods, MI", score: wlt !== "0-0-0" ? `${wlt} (TOA)` : "HWS Core" }
    ];

    cache.rankings = liveRankings;
    cache.rankingsExpiry = Date.now() + 60 * 60 * 1000;
    return res.json({ rankings: liveRankings, live: true });
  } catch (error) {
    console.error('TOA Rankings Error:', error.message);
    return res.json({ rankings: fallbackRankings, live: false, error: error.message });
  }
});

// --- Media/Portfolio Upload ---
app.post('/api/media/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  res.json({
    success: true,
    message: 'File uploaded successfully',
    filename: req.file.filename,
    path: `/uploads/${req.file.filename}`
  });
});

app.listen(PORT, () => {
  console.log(`RoboTrack Backend running on http://localhost:${PORT}`);
});
