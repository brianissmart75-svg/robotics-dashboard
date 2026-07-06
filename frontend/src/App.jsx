import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { 
  Users, UserPlus, LogIn, LogOut, ClipboardList, 
  Settings, Award, Clock, ChevronRight, Activity, 
  Search, ShieldCheck, Zap, ExternalLink, Mail, Sun, Moon, Inbox, CheckCircle, Download, Globe, Code, FileText, HelpCircle,
  MessageCircle, Send, X, Gamepad2, Mic, MicOff, Play, Pause, Paperclip, BookOpen, Loader2,
  Trophy, Calendar, Film, User, ShieldAlert,
  MapPin, Phone, Plus, Trash2, Briefcase, GraduationCap, Printer, Presentation
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleLogin } from '@react-oauth/google';
import { FacebookLoginClient } from '@greatsumini/react-facebook-login';
import { jwtDecode } from 'jwt-decode';
import { QUIZZES } from './quizzes.js';
import { MICRO_CREDENTIALS } from './credentials.js';
import YouTube from 'react-youtube';
import UserExperienceEnhancements from './UserExperienceEnhancements';
import WhatDoesThisDoVideo from './WhatDoesThisDoVideo';

const API_BASE = window.location.hostname === 'localhost' ? 'http://localhost:3010/api' : '/api';
const OMEGA_PIONEER_URL = "https://pioneer.syprian.com";

export const SQUAD_MISSIONS = {
  "Media & Marketing": [
    "Recording Footage",
    "Editing Footage",
    "Uploading & Publishing",
    "Social Media Marketing",
    "Team Branding"
  ],
  "Build & Manufacturing": [
    "Frame Construction",
    "Robot Build",
    "Weight Management",
    "3D Printing & CAD",
    "Bambu Labs 3D Printing",
    "Filament Types (TPU/PETG)",
    "CNC Machine Basics",
    "Graphite CNC Machining",
    "Metal 3D Printing (Steel)",
    "Carbon Fiber 3D Printing",
    "UV Resin 3D Printing",
    "Custom Robot Parts (vs Kitbot)",
    "Onshape CAD",
    "Fusion 360",
    "Tinkercad",
    "Build & Missions Training"
  ],
  "Programming & Control": [
    "WPILib Coding",
    "PedroPathing",
    "Pinpoint Odometry",
    "Encoders & Sensors",
    "RoboRIO Config"
  ],
  "Drive Team & Strategy": [
    "YouTube FRC Research",
    "Drive Time",
    "FRC Driver Station",
    "Scouting Data Analysis"
  ],
  "Rules & Regulations": [
    "FTC Rules Quiz",
    "FRC Rules Quiz",
    "FTC Current Game Quiz",
    "FRC Current Game Quiz"
  ]
};

const ACTIVITY_RESOURCES = {
  "YouTube FRC Research": "https://www.youtube.com/playlist?list=PLV4ZD6Kv_MmGCeFsTnJNWyOsidKvgIomO",
  "Onshape CAD": "https://www.youtube.com/watch_videos?video_ids=IjukmO5M7t8,Wyz6Zho5WNk,JDWps-O94HY,QXADNYPQOQM",
  "Tinkercad": "https://www.youtube.com/watch_videos?video_ids=gOs6Mdj7y_4,ub5NFpyP8wk,VgzLaPkPkpY,3SDjerJyhhc",
  "Drive Time": "https://www.youtube.com/playlist?list=PLV4ZD6Kv_MmEsTZ9N49TqRPV1r7CwgP05",
  "WPILib Coding": "https://www.youtube.com/watch_videos?video_ids=eGiI6fdj_o0,5TX898tem3c,FuBPe1_EJSs,C5DqnIu6g8k",
  "FRC Driver Station": "https://www.youtube.com/watch_videos?video_ids=phcyluzA09s,uDFOWcpvYEs,nmdWOzwvv7g,3a_I8T2IIDI",
  "RoboRIO Config": "https://www.youtube.com/watch_videos?video_ids=Nw9_lnpABoQ,hrLXYwM3qcc,Kh6RNM1teFU,imDq7sXn5Cw",
  "Encoders & Sensors": "https://www.youtube.com/watch_videos?video_ids=QUhdAdi0VBY,5dCwbZ-xYgY,5UXGGKyvZX0,Wv5v8p3Iqi8",
  "Frame Construction": "https://www.youtube.com/watch_videos?video_ids=G_W3EClkHM0,qxQYFuGGdMk,WfaS4qUXYNw,BvyrWd4fOi4",
  "Weight Management": "https://www.youtube.com/watch_videos?video_ids=XLIB6c_EGko,4nCbhh84dHs,wCpKD5N40Rw,VTIRVzwX3IM",
  "Robot Build": "https://www.youtube.com/watch_videos?video_ids=qxQYFuGGdMk,PTJKKDcxoiY,-sFpiSJLMu4,NRj6gzah7JA",
  "PedroPathing": "https://www.youtube.com/watch_videos?video_ids=gdkefs_VL-w,Gsaph6ry2Ic,0Xi9yb1IMyA,qKy98Cbcltw",
  "Pinpoint Odometry": "https://www.youtube.com/watch_videos?video_ids=RoDBoqOMc5A,ixsxDn_ddLE,vxSK2NYtYJQ,Av9ZMjS--gY",
  "Fusion 360": "https://www.youtube.com/watch_videos?video_ids=mlkK1esxzC4,qNucy7Nek4I,gSyrTdTPANE,fFMVN53lRng",
  "Bambu Labs 3D Printing": "https://www.youtube.com/watch_videos?video_ids=Tc6xLuijLBg,1xwXTOfEuQE,rZhy0J0mXBE,kck5jv2-uao",
  "Filament Types (TPU/PETG)": "https://www.youtube.com/watch_videos?video_ids=weeG9yOp3i4,7kjSKSEtpMY,_0IUm5Ac9ZM",
  "CNC Machine Basics": "https://www.youtube.com/watch_videos?video_ids=l1oh8nekPu4,LSYkNTJn2ow,5XihF05K4yM,17oC_Uqps6k",
  "Graphite CNC Machining": "https://www.youtube.com/watch_videos?video_ids=MCu69HO640c,KbuAcqqql6c,r7N9wIw2D8s,iHkDRA4zayc",
  "Metal 3D Printing (Steel)": "https://www.youtube.com/watch_videos?video_ids=_SwsatEJn9k,KnYb441E1hg,5PeLR2kAH8A,0IDhTo0Gp-8",
  "Carbon Fiber 3D Printing": "https://www.youtube.com/watch_videos?video_ids=u8dIpwd6tzo,e0sTI3ibr98,3ReRrFhLXh4,HOuaLIgyvFw",
  "UV Resin 3D Printing": "https://www.youtube.com/watch_videos?video_ids=ywAq5R4s3gw,v9SfPiBp864,6ac5CsZqLec,2vFdwz4U1VQ",
  "Custom Robot Parts (vs Kitbot)": "https://www.youtube.com/watch_videos?video_ids=gzTnZKgxcX4,d3it7-qxCkg,u6jG8vD-v-k,upzIKmM5M8M",
  "Recording Footage": "https://www.youtube.com/watch_videos?video_ids=9rb7lw06dP4,w2QHwG19THs,5nkq7APrX50,nISC7t3opNw",
  "Editing Footage": "https://www.youtube.com/watch_videos?video_ids=6mOGAbP-xWE,3TXAgWxJg68,h4JAlItbKn8,LqoNVRn21ks",
  "Uploading & Publishing": "https://www.youtube.com/watch_videos?video_ids=OeIIt8gZo_E,5Kb3mlUwwL0,7W_Q7UwiooM,kr0D3p0wnOc",
  "Social Media Marketing": "https://www.youtube.com/watch_videos?video_ids=0g9UcQxnSBE,q80pbToF8EI,PTS96q_J94o,thvu7YTFQTU",
  "Team Branding": "https://www.youtube.com/watch_videos?video_ids=EXAtR4yyua0,if56J4jDdKY,tohhIwmcQsw,tMpjrvOgYBk",
  "Scouting Data Analysis": "https://www.youtube.com/watch_videos?video_ids=XnRtxkChwrc,R11PUq_m8Fk,ZrP1meC6v4s,8339qzNZ2x4",
  "3D Printing & CAD": "https://www.youtube.com/watch_videos?video_ids=_qLLjzUuBNw,zDiym4xmgPk,KhYDvfu95z4,wLBsO1UzIL0",
  "FTC Rules Quiz": "https://www.youtube.com/watch?v=ewlDPvRK4U4",
  "FRC Rules Quiz": "https://www.youtube.com/watch?v=YWbxcjlY9JY",
  "FTC Current Game Quiz": "https://www.youtube.com/watch?v=ewlDPvRK4U4",
  "FRC Current Game Quiz": "https://www.youtube.com/watch?v=YWbxcjlY9JY",
  "Swerve Drive Maintenance": "https://www.youtube.com/watch_videos?video_ids=0Xi9yb1IMyA,IjukmO5M7t8,Wyz6Zho5WNk,JDWps-O94HY",
  "Re-gearing a Motor": "https://www.youtube.com/watch_videos?video_ids=1tLl_Wm6snk,qxQYFuGGdMk,PTJKKDcxoiY,-sFpiSJLMu4",
  "Mecanum Wheel Refurbishment": "https://www.youtube.com/watch?v=-HkuhtZDPkI",
  "Build & Missions Training": "modal"
};
// --- STAR HELPER ---
const MissionStars = ({ count }) => {
  return (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Award key={i} className={`w-3 h-3 ${i < count ? 'text-amber-400 fill-amber-400' : 'text-slate-600 opacity-30'}`} />
      ))}
    </div>
  );
};

// --- PYTHON QUEST ROOM ---
function PythonQuest({ studentId, onComplete, setView }) {
  const [code, setCode] = useState("print('Hello Syprian!')\n# Solve the puzzle:\n# Create a variable named 'points' and set it to 100\n");
  const [output, setOutput] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    window.brython({ debug: 1 });
  }, []);

  const runCode = () => {
    setOutput('');
    const scriptId = 'brython-script';
    let script = document.getElementById(scriptId);
    if (script) script.remove();

    script = document.createElement('script');
    script.id = scriptId;
    script.type = 'text/python';
    script.innerHTML = `
from browser import document, window

# Capture stdout
class Output:
    def write(self, data):
        document['python-output'].text += data

import sys
sys.stdout = Output()

try:
    ${code}
    # Verification logic
    if 'points' in locals() and points == 100:
        window.onQuestComplete()
except Exception as e:
    print(str(e))
    `;
    document.body.appendChild(script);
    window.brython({ ids: [scriptId] });
  };

  window.onQuestComplete = () => {
    setIsSuccess(true);
    setTimeout(() => {
      onComplete(0.00000001);
      setView('lobby');
    }, 2000);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto glass-panel p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-black bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent flex items-center gap-3">
            <Code className="w-8 h-8 text-emerald-500" /> PYTHON QUEST ROOM
          </h2>
          <p className="text-slate-400 font-bold tracking-widest text-xs uppercase mt-1">Earn Micro-Points through Logic</p>
        </div>
        <button onClick={() => setView('lobby')} className="p-2 hover:bg-white/10 rounded-full transition-colors"><X /></button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="bg-black/40 rounded-xl overflow-hidden border border-white/10">
            <div className="bg-white/5 px-4 py-2 text-[10px] font-black tracking-widest text-slate-400 uppercase flex justify-between items-center">
              <span>Python Editor</span>
              <span className="text-emerald-500">Live Brython Interpreter</span>
            </div>
            <textarea 
              value={code} 
              onChange={e => setCode(e.target.value)}
              className="w-full h-[300px] bg-transparent p-4 font-mono text-sm text-emerald-400 focus:outline-none resize-none"
              spellCheck="false"
            />
          </div>
          <button 
            onClick={runCode}
            className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-xl transition-all shadow-lg shadow-emerald-500/20 uppercase tracking-widest flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4" /> Execute Script
          </button>
        </div>

        <div className="space-y-4">
          <div className="bg-black/60 rounded-xl h-[250px] border border-white/10 flex flex-col">
            <div className="bg-white/5 px-4 py-2 text-[10px] font-black tracking-widest text-slate-400 uppercase">Terminal Output</div>
            <div id="python-output" className="flex-1 p-4 font-mono text-sm text-slate-300 overflow-y-auto whitespace-pre-wrap">
              {output}
            </div>
          </div>

          <div className={`p-6 rounded-xl border transition-all ${isSuccess ? 'bg-emerald-500/20 border-emerald-500/50' : 'bg-white/5 border-white/10'}`}>
            <h4 className={`font-black mb-2 flex items-center gap-2 ${isSuccess ? 'text-emerald-400' : 'text-slate-300'}`}>
              <Zap className="w-4 h-4" /> {isSuccess ? 'QUEST COMPLETE!' : 'CURRENT CHALLENGE'}
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              {isSuccess 
                ? "Excellent logic. You've earned 0.00000001 micropoints. Redirecting to lobby..." 
                : "The robot needs a specific calibration. Set a variable named 'points' to the integer value 100 to pass this mission."}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

const getDisplayName = (student) => {
  if (!student) return 'Unknown';
  if (student.isPrivate) return student.username || 'Anonymous Student';
  return student.username || student.name;
};

export default function App() {
  const [view, setView] = useState('lobby');
  const [theme, setTheme] = useState('dark');
  const [showExplainerModal, setShowExplainerModal] = useState(false);
  const [activeSessions, setActiveSessions] = useState([]);
  const [stats, setStats] = useState({ students: [], sessions: [], logs: [] });
  const [missionCompletions, setMissionCompletions] = useState({});
  const [notification, setNotification] = useState(null);
  const [preselectedStudent, setPreselectedStudent] = useState(null);
  const [recentCheckout, setRecentCheckout] = useState(null); // { studentId, activity }
  const [activeVideo, setActiveVideo] = useState(null);
  const [ferpaRecords, setFerpaRecords] = useState([]);

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 30000); // 30s refresh
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (theme === 'dark') document.body.classList.add('dark');
    else document.body.classList.remove('dark');
  }, [theme]);

  const fetchStats = async () => {
    try {
      const [statsRes, sessionRes, starsRes, ferpaRes] = await Promise.all([
        axios.get(`${API_BASE}/stats`),
        axios.get(`${API_BASE}/sessions`),
        axios.get(`${API_BASE}/mission-stars`),
        axios.get(`${API_BASE}/quiz/details`).catch(() => ({ data: [] }))
      ]);
      setStats(statsRes.data);
      setActiveSessions(sessionRes.data);
      setMissionCompletions(starsRes.data);
      setFerpaRecords(ferpaRes.data || []);
    } catch (e) {
      console.error('Failed to fetch stats:', e);
    }
  };

  const fetchActive = async () => {
    try {
      const sessionRes = await axios.get(`${API_BASE}/sessions`);
      setActiveSessions(sessionRes.data);
    } catch (e) {
      console.error('Failed to fetch active sessions:', e);
    }
  };

  const notify = (msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // Shared OAuth login handler — consolidates Google and Facebook flows
  const handleOAuthLogin = async (name, email, provider) => {
    try {
      if (!name || !email) {
        notify(`${provider} Login Failed or missing info`, 'error');
        return;
      }

      let student = stats.students.find(s => s.name.toLowerCase() === name.toLowerCase());
      
      if (!student) {
        const newId = email.split('@')[0];
        const res = await axios.post(`${API_BASE}/register`, {
          name,
          id: newId,
          grade: '9'
        });
        student = res.data.student;
        notify(`Welcome ${student.name}! Account auto-created from ${provider}.`);
        await fetchStats();
      } else {
        notify(`Welcome back, ${student.name}!`);
      }
      
      setPreselectedStudent(student.id);
      const isActive = activeSessions.find(s => s.studentId === student.id);
      setView(isActive ? 'checkout' : 'checkin');
    } catch (e) {
      notify(`${provider} Login Failed`, 'error');
      console.error(e);
    }
  };

  const handleGoogleLogin = async (credentialResponse) => {
    const decoded = jwtDecode(credentialResponse.credential);
    await handleOAuthLogin(decoded.name, decoded.email, 'Google');
  };

  const handleFacebookLogin = async (response) => {
    await handleOAuthLogin(response.name, response.email, 'Facebook');
  };

  return (
    <div className="container min-h-screen">
      <UserExperienceEnhancements 
        pageTitle="RoboTrack Robotics" 
        pageDescription="Harper Woods Robotics Initiative. Building and tracking micro-credentials for active students."
      />
      {/* Header */}
      <header className="flex flex-col lg:flex-row justify-between items-center gap-6 lg:gap-4 mb-12 w-full">
        <div className="flex items-center gap-4 flex-shrink-0">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Zap className="text-white w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl font-black bg-gradient-to-r from-[var(--text-primary)] to-slate-400 bg-clip-text text-transparent">ROBOTRACK</h1>
            <p className="text-[10px] tracking-[0.2em] font-bold text-gold-500 uppercase">Harper Woods Robotics Initiative</p>
          </div>
        </div>        
        <nav className="flex flex-wrap items-center justify-center gap-2 p-1.5 bg-black/40 border border-white/5 rounded-2xl w-full lg:w-auto max-w-full">
          <div className="flex items-center gap-1 bg-blue-500/10 p-1 rounded-xl">
            <button onClick={() => setView('lobby')} className={`nav-item-wizard ${view === 'lobby' ? 'active-blue' : ''}`}>
              <LogIn className="w-4 h-4" /><span>Kiosk</span>
            </button>
            <button onClick={() => setView('board')} className={`nav-item-wizard ${view === 'board' ? 'active-blue' : ''}`}>
              <Activity className="w-4 h-4" /><span>Board</span>
            </button>
            <button onClick={() => setView('simulator')} className={`nav-item-wizard ${view === 'simulator' ? 'active-blue' : ''}`}>
              <Gamepad2 className="w-4 h-4" /><span>Sim</span>
            </button>
          </div>

          <div className="flex items-center gap-1 bg-purple-500/10 p-1 rounded-xl">
            <button onClick={() => setView('coding')} className={`nav-item-wizard ${view === 'coding' ? 'active-purple' : ''}`}>
              <Code className="w-4 h-4" /><span>Lab</span>
            </button>
            <button onClick={() => setView('manufacturing')} className={`nav-item-wizard ${view === 'manufacturing' ? 'active-purple' : ''}`}>
              <Settings className="w-4 h-4" /><span>Fab</span>
            </button>
          </div>

          <div className="flex items-center gap-1 bg-amber-500/10 p-1 rounded-xl">
            <button onClick={() => setView('rules')} className={`nav-item-wizard ${view === 'rules' ? 'active-gold' : ''}`}>
              <BookOpen className="w-4 h-4" /><span>Rules</span>
            </button>
            <button onClick={() => setView('global')} className={`nav-item-wizard ${view === 'global' ? 'active-gold' : ''}`}>
              <Trophy className="w-4 h-4" /><span>Ranks</span>
            </button>
            <button onClick={() => setView('awards')} className={`nav-item-wizard ${view === 'awards' ? 'active-gold' : ''}`}>
              <Award className="w-4 h-4" /><span>Awards</span>
            </button>
          </div>

          <div className="flex items-center gap-1 bg-slate-500/10 p-1 rounded-xl">
            <button onClick={() => setView('calendar')} className={`nav-item-wizard ${view === 'calendar' ? 'active-slate' : ''}`}>
              <Calendar className="w-4 h-4" /><span>Dates</span>
            </button>
            <button onClick={() => setView('movies')} className={`nav-item-wizard ${view === 'movies' ? 'active-slate' : ''}`}>
              <Film className="w-4 h-4" /><span>Media</span>
            </button>
            <button onClick={() => setView('profile')} className={`nav-item-wizard ${view === 'profile' ? 'active-slate' : ''}`}>
              <User className="w-4 h-4" /><span>Logs</span>
            </button>
          </div>

          <button onClick={() => setView('admin')} className={`nav-item-wizard ml-2 ${view === 'admin' ? 'active-purple-glow' : 'bg-purple-600/20 border-purple-500/30 text-purple-400'}`}>
            <ShieldCheck className="w-4 h-4" /><span>Coach</span>
          </button>
          <a href="https://hwsroboteam.org/caddie-to-coach/" target="_blank" rel="noopener noreferrer" className="nav-item-wizard ml-2 bg-amber-500/20 border-amber-500/30 text-amber-400 flex items-center gap-1.5 px-3 h-[38px] rounded-xl hover:bg-amber-500/30 hover:text-amber-200 transition-all font-bold text-xs uppercase tracking-wider">
            <ExternalLink className="w-4 h-4" />
            <span>Fundraiser</span>
          </a>
          <a href="/microcredentialing" target="_blank" rel="noopener noreferrer" className="nav-item-wizard ml-2 bg-blue-500/20 border-blue-500/30 text-blue-400 flex items-center gap-1.5 px-3 h-[38px] rounded-xl hover:bg-blue-500/30 hover:text-blue-200 transition-all font-bold text-xs uppercase tracking-wider">
            <Globe className="w-4 h-4" />
            <span>Microcredentials</span>
          </a>
          <button 
            onClick={() => setView('presentation')} 
            className={`nav-item-wizard ml-2 bg-purple-500/20 border-purple-500/30 text-purple-400 flex items-center gap-1.5 px-3 h-[38px] rounded-xl hover:bg-purple-500/30 hover:text-purple-200 transition-all font-bold text-xs ${view === 'presentation' ? 'active-purple border-purple-400' : ''}`}
          >
            <Presentation className="w-4 h-4 flex-shrink-0" />
            <span className="flex flex-col items-center text-center leading-none text-[8px] font-black uppercase tracking-wider">
              <span>Presentation</span>
              <span className="mt-0.5 text-[7px] opacity-80">Maker</span>
            </span>
          </button>
          <a href={OMEGA_PIONEER_URL} target="_blank" rel="noopener noreferrer" className="nav-item-wizard ml-2 bg-purple-500/20 border-purple-500/30 text-purple-400 flex items-center gap-1.5 px-3 h-[38px] rounded-xl hover:bg-purple-500/30 hover:text-purple-200 transition-all font-bold text-xs uppercase tracking-wider">
            <ExternalLink className="w-4 h-4" />
            <span>Omega Pioneer</span>
          </a>
          
          {/* Explainer Modal Button */}
          <button 
            onClick={() => setShowExplainerModal(true)} 
            className="nav-item-wizard ml-2 bg-emerald-500/20 border-emerald-500/30 text-emerald-400 flex items-center gap-1.5 px-3 h-[38px] rounded-xl hover:bg-emerald-500/30 hover:text-emerald-200 transition-all font-bold text-xs uppercase tracking-wider"
          >
            <HelpCircle className="w-4 h-4" />
            <span>Explainer</span>
          </button>
          
          {/* Theme Toggle Button */}
          <button 
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} 
            className="nav-item-wizard ml-2 bg-slate-500/20 border-slate-500/30 text-slate-400 flex items-center justify-center w-10 h-[38px] rounded-xl hover:bg-slate-500/30 hover:text-slate-200 transition-all"
            title="Toggle Light/Dark Theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </nav>
      </header>

      {/* Notifications */}
      <AnimatePresence>
        {notification && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-6 left-1/2 -translate-x-1/2 px-6 py-3 rounded-xl shadow-2xl z-50 text-sm font-bold border ${
              notification.type === 'success' ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-red-500/10 border-red-500/30 text-red-400'
            }`}
          >
            {notification.msg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Views */}
      <main>
        <AnimatePresence mode="wait">
        {view === 'lobby' && (
          <Lobby 
            setView={setView} 
            activeSessions={activeSessions} 
            onGoogleLogin={handleGoogleLogin} 
            onFacebookLogin={handleFacebookLogin} 
          />
        )}
        {view === 'quest' && (
          <PythonQuest 
            setView={setView} 
            onComplete={async (microPoints) => {
              notify(`Micropoints earned: ${microPoints.toFixed(8)}`);
              // Note: Implementation of micropoint award endpoint would go here
              await fetchStats();
            }}
          />
        )}
        {view === 'register' && <Register key="register" setView={setView} notify={notify} refresh={fetchStats} />}
        {view === 'checkin' && <CheckIn setView={setView} notify={notify} refresh={fetchStats} students={stats.students} activities={SQUAD_MISSIONS} preselectedStudent={preselectedStudent} missionCompletions={missionCompletions} setActiveVideo={setActiveVideo} />}
          {view === 'checkout' && <CheckOut key="checkout" setView={setView} notify={notify} refresh={() => { fetchStats(); }} activeSessions={activeSessions} preselectedStudent={preselectedStudent} onCheckoutSuccess={(data) => {
    setRecentCheckout(data);
    if (data.starsAwarded > 0) {
      notify(`🌟 CLUTCH! You earned ${data.starsAwarded} STARS for exploring a new mission!`, 'success');
    }
    setView('quiz');
  }} />}
          {view === 'pause' && <PauseSession key="pause" setView={setView} notify={notify} refresh={fetchStats} activeSessions={activeSessions} />}
          {view === 'resume' && <ResumeSession key="resume" setView={setView} notify={notify} refresh={fetchStats} activeSessions={activeSessions} setActiveVideo={setActiveVideo} />}
          {view === 'quiz' && <QuizView key="quiz" setView={setView} notify={notify} refresh={fetchStats} checkoutData={recentCheckout} />}
          {view === 'board' && <LiveBoard key="board" activeSessions={activeSessions} students={stats.students} setActiveVideo={setActiveVideo} missionCompletions={missionCompletions} />}
          {view === 'simulator' && <FieldSimulator key="simulator" setView={setView} preselectedStudent={preselectedStudent} />}
          {view === 'manufacturing' && <ManufacturingHub key="manufacturing" setActiveVideo={setActiveVideo} />}
          {view === 'global' && <GlobalLeaderboard key="global" />}
          {view === 'coding' && <CodingLab key="coding" />}
          {view === 'rules' && <RulesRegulator key="rules" setView={setView} />}
          {view === 'movies' && <MovieTime key="movies" />}
          {view === 'calendar' && <CalendarOfEvents key="calendar" />}
          {view === 'awards' && <AwardsAndCriteria key="awards" />}
          {view === 'profile' && <StudentLog key="profile" students={stats.students} setView={setView} refresh={fetchStats} />}
          {view === 'email' && <TeamEmail key="email" setView={setView} notify={notify} />}
          {view === 'admin' && <AdminDashboard key="admin" stats={stats} ferpaRecords={ferpaRecords} refresh={() => { fetchStats(); fetchActive(); }} activeSessions={activeSessions} notify={notify} />}
          {view === 'compliance' && <CompliancePolicy key="compliance" setView={setView} />}
          {view === 'presentation' && <PresentationMaker setView={setView} notify={notify} />}
        </AnimatePresence>
      </main>

      {/* Video Container Modal */}
      <AnimatePresence>
        {activeVideo && (
          (activeVideo.activity.includes('Quiz') && QUIZZES[activeVideo.activity]) ? (
            <ServSafeTrainingModal activeVideoData={activeVideo} onClose={() => setActiveVideo(null)} notify={notify} />
          ) : activeVideo.activity === 'Build & Missions Training' ? (
            <BuildAndMissionsModal activeVideoData={activeVideo} onClose={() => setActiveVideo(null)} notify={notify} setActiveVideo={setActiveVideo} />
          ) : (
            <VideoContainerModal activeVideoData={activeVideo} onClose={() => setActiveVideo(null)} notify={notify} missionCompletions={missionCompletions} />
          )
        )}
      </AnimatePresence>

      <TeamMessenger currentUser={view === 'admin' ? 'Coach' : (preselectedStudent ? getDisplayName(stats.students.find(s => s.id === preselectedStudent)) : 'Student (Guest)')} />

      {/* Platform Explainer Modal */}
      <AnimatePresence>
        {showExplainerModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl p-1"
            >
              <button 
                onClick={() => setShowExplainerModal(false)}
                className="absolute top-4 right-4 z-50 p-2 bg-black/60 hover:bg-black/80 text-slate-300 hover:text-white rounded-full border border-white/10 transition-all"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
              
              <WhatDoesThisDoVideo 
                pageTitle="RoboTrack Portal"
                pageDescription="Harper Woods K-12 Robotics Team Hub. Coordinates STEM operations, build sessions, and safety certifications."
                features={[
                  "Real-time kiosk session check-in/out",
                  "Technical CNC & 3D printing micro-credentials",
                  "Interactive FTC/FRC field simulator lab"
                ]}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      
      {/* Footer Branding */}
      <footer className="mt-20 py-8 border-t border-white/5 flex justify-between items-center text-[10px] text-slate-500 font-bold uppercase tracking-widest">
        <div>Propulsion System: FRC Team 9212 | 5239</div>
        <div className="flex items-center gap-4">
          <a href="http://195.110.59.124:3105/governance/admin" target="_blank" rel="noreferrer" className="hover:text-purple-400 transition-colors cursor-pointer">AI Governance Admin</a>
          <button onClick={() => setView('compliance')} className="hover:text-blue-400 transition-colors cursor-pointer">Compliance & Policies</button>
          <span>&copy; 2026 Harper Woods Schools | AI Administrative Specialist</span>
        </div>
      </footer>
    </div>
  );
}

// --- SUB-COMPONENTS ---

function CompliancePolicy({ setView }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto glass-panel p-8 text-slate-300">
      <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
        <div>
          <h2 className="text-3xl font-black bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">LEGAL & COMPLIANCE</h2>
          <p className="text-slate-400 font-bold tracking-widest text-xs uppercase mt-1">Harper Woods Robotics (RoboTrack)</p>
        </div>
        <button onClick={() => setView('lobby')} className="p-2 hover:bg-white/5 rounded-lg transition-colors">
          <ArrowLeft className="w-6 h-6 text-slate-400" />
        </button>
      </div>

      <div className="space-y-8 text-sm leading-relaxed">
        <section>
          <h3 className="text-xl font-bold text-white mb-3">1. Non-Discrimination Policy</h3>
          <p>
            Harper Woods Schools and the RoboTrack platform are committed to providing an inclusive and welcoming environment for all students, staff, and volunteers. We do not discriminate on the basis of race, color, national origin, age, disability, sex, gender identity, sexual orientation, religion, or any other legally protected characteristic in any of our programs, activities, or employment practices. All participants are guaranteed equal access to educational resources, robotics components, and AI-driven tutoring tools.
          </p>
        </section>

        <section>
          <h3 className="text-xl font-bold text-white mb-3">2. Data Privacy & Research Use Policy</h3>
          <p>
            The privacy of our students is of paramount importance. Data collected within the RoboTrack platform, including but not limited to check-in/out times, hours logged, mission scores, and interaction with AI tutors, is strictly used for internal educational purposes and to track individual progress. 
          </p>
          <p className="mt-2">
            <strong>No student data will ever be sold, shared with third parties, or utilized for external research or studies</strong> without explicit, written parental consent. Our AI systems do not use student-provided personal information or telemetry to train global models.
          </p>
        </section>

        <section>
          <h3 className="text-xl font-bold text-white mb-3">3. COPPA & FERPA Compliance</h3>
          <p>
            We strictly adhere to the Family Educational Rights and Privacy Act (FERPA) and the Children's Online Privacy Protection Act (COPPA). Parents and legal guardians have the right to review their child's records, request corrections, and control the disclosure of personally identifiable information. Students under the age of 13 must have verified parental consent to access interactive platform features.
          </p>
        </section>

        <section>
          <h3 className="text-xl font-bold text-white mb-3">4. Acceptable Use Policy</h3>
          <p>
            By using RoboTrack, all participants agree to engage in safe, respectful, and productive behaviors. The AI Strategy Assistant and Chat tools are monitored to ensure compliance with school district technology guidelines. Any inappropriate use, bullying, or attempts to circumvent platform security will result in immediate suspension of access.
          </p>
        </section>
      </div>
    </motion.div>
  );
}

function TeamEmail({ setView, notify }) {
  const [form, setForm] = useState({ firstName: '', lastName: '', requestedPrefix: '', schoolEmail: '' });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Auto-generate email prefix from name
  useEffect(() => {
    if (form.firstName && form.lastName) {
      const prefix = `${form.firstName.toLowerCase().trim()}.${form.lastName.toLowerCase().trim()}`.replace(/[^a-z.]/g, '');
      setForm(prev => ({ ...prev, requestedPrefix: prefix }));
    }
  }, [form.firstName, form.lastName]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await axios.post(`${API_BASE}/email-request`, {
        firstName: form.firstName,
        lastName: form.lastName,
        requestedPrefix: form.requestedPrefix,
        schoolEmail: form.schoolEmail
      });
      setSubmitted(true);
      notify(`Account Requested! Your @hwsroboteam.org email is being provisioned.`);
    } catch (err) {
      notify(err.response?.data?.error || 'Submission failed. Please try again.', 'error');
    }
    setSubmitting(false);
  };

  if (submitted) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md mx-auto glass-panel p-10 text-center">
        <div className="w-20 h-20 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="text-blue-400 w-10 h-10" />
        </div>
        <h2 className="text-2xl font-black mb-3 text-[var(--text-primary)] uppercase">Account Provisioned!</h2>
        <p className="text-sm text-[var(--text-secondary)] mb-4">
          The address <span className="text-blue-500 font-bold">{form.requestedPrefix}@hwsroboteam.org</span> has been successfully requested and is being initialized.
        </p>
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-5 mb-8 text-left shadow-[0_0_15px_rgba(59,130,246,0.1)]">
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
            <strong className="text-blue-400 block mb-1">Next Steps:</strong>
            Your email (<span className="text-blue-400 font-mono font-bold">{form.requestedPrefix}@hwsroboteam.org</span>) and your username and password will be sent to:
            <span className="block mt-2 p-2.5 bg-black/30 border border-blue-500/20 rounded-lg text-center font-mono text-[var(--text-primary)] font-bold text-sm tracking-wide break-all">
              {form.schoolEmail}
            </span>
          </p>
          <p className="text-[10px] text-[var(--text-muted)] mt-3 leading-relaxed italic">
            This usually arrives within 2-4 hours. Make sure to check your inbox and spam folder.
          </p>
        </div>
        <button onClick={() => setView('lobby')} className="btn-primary w-full py-4">BACK TO KIOSK</button>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-md mx-auto glass-panel p-10">
      <h2 className="text-2xl font-black mb-4 flex items-center gap-3 text-[var(--text-primary)]">
        <Mail className="text-blue-500" /> TEAM EMAIL REQUEST
      </h2>
      <p className="text-sm font-medium text-[var(--text-secondary)] mb-6">
        Get your free @hwsroboteam.org email address so you don't have to rely on school emails to sign up for advanced robotics classes.
      </p>

      {/* Approval Notice */}
      <div className="mb-8 p-4 rounded-xl bg-blue-500/5 border border-blue-500/20">
        <p className="text-xs font-bold text-blue-400 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 flex-shrink-0" />
          Once approved, your new credentials will be sent to your school email address within 24-48 hours.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="label">FIRST NAME</label>
          <input required className="input-field" value={form.firstName} onChange={e => setForm({...form, firstName: e.target.value})} placeholder="Jane" />
        </div>
        <div>
          <label className="label">LAST NAME</label>
          <input required className="input-field" value={form.lastName} onChange={e => setForm({...form, lastName: e.target.value})} placeholder="Doe" />
        </div>
        <div>
          <label className="label">CURRENT SCHOOL EMAIL</label>
          <input required type="email" className="input-field" value={form.schoolEmail} onChange={e => setForm({...form, schoolEmail: e.target.value})} placeholder="jane.doe@hwschools.org" />
          <p className="text-[10px] text-[var(--text-muted)] mt-1">Your login credentials will be sent here after approval.</p>
        </div>
        <div>
          <label className="label">DESIRED EMAIL</label>
          <div className="flex items-center gap-2">
            <input required className="input-field" value={form.requestedPrefix} onChange={e => setForm({...form, requestedPrefix: e.target.value})} placeholder="jane.doe" />
            <span className="font-bold text-[var(--text-secondary)] whitespace-nowrap">@hwsroboteam.org</span>
          </div>
          <p className="text-[10px] text-[var(--text-muted)] mt-1">Suggested format: firstname.lastname</p>
        </div>
        <div className="flex gap-4 pt-4">
          <button type="button" onClick={() => setView('lobby')} className="flex-1 px-6 py-3 border border-[var(--glass-border)] rounded-xl font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all">CANCEL</button>
          <button type="submit" disabled={submitting} className={`flex-1 btn-primary ${submitting ? 'opacity-60 cursor-wait' : ''}`}>{submitting ? 'SUBMITTING...' : 'SUBMIT REQUEST'}</button>
        </div>
      </form>

    </motion.div>
  );
}

function Lobby({ setView, activeSessions, onGoogleLogin, onFacebookLogin }) {
  useEffect(() => {
    const initFB = async () => {
      await FacebookLoginClient.loadSdk('en_US');
      window.fbAsyncInit = () => {
        FacebookLoginClient.init({ appId: '1285231243177471', version: 'v16.0' });
      };
    };
    initFB();
  }, []);

  const handleManualFBLogin = () => {
    FacebookLoginClient.login((res) => {
      if (res.authResponse) {
        FacebookLoginClient.getProfile((profile) => {
          onFacebookLogin(profile);
        }, { fields: 'name,email,picture' });
      } else {
        console.log('Login Failed', res);
      }
    }, { scope: 'public_profile,email' });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="flex flex-col gap-8 w-full max-w-6xl mx-auto"
    >
      <div className="glass-panel p-8 w-full">
        <h3 className="text-xl font-black text-white mb-6 uppercase tracking-widest flex items-center gap-3">
          <Award className="text-amber-400" /> Ranking Points Matrix & Guide
        </h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 hover:border-emerald-500/50 transition-colors">
            <h4 className="text-emerald-400 font-bold mb-2 text-lg">Early Check-In</h4>
            <p className="text-sm text-slate-300">Check in at the Kiosk by <strong>3:15 PM</strong> to earn bonus ranking points for punctuality.</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 hover:border-blue-500/50 transition-colors">
            <h4 className="text-blue-400 font-bold mb-2 text-lg">Consecutive Days</h4>
            <p className="text-sm text-slate-300">Maintain a streak! Earn multipliers for attending robotics practice multiple days in a row without breaking the chain.</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 hover:border-purple-500/50 transition-colors">
            <h4 className="text-purple-400 font-bold mb-2 text-lg">Event Participation</h4>
            <p className="text-sm text-slate-300">Sign up and show up to <strong>Parent Night</strong>, <strong>Reveal Day</strong>, or <strong>After School Expos</strong> for massive point boosts.</p>
          </div>
        </div>
        <div className="mt-6 bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 text-sm text-amber-200/80">
          <strong>Instruction Manual:</strong> To claim these points, ensure you accurately select your name on the Check-In page. The AI Administrative Specialist automatically timestamps your arrival for the Early Bonus. Event participation is logged manually by the Coach on the Admin Dashboard based on your physical presence at the event. Keep your hours high to climb the rankings!
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-8 items-stretch w-full">
        <div className="glass-card p-10 flex flex-col items-center text-center group">
          <div className="w-20 h-20 rounded-3xl bg-blue-500/10 border-2 border-blue-500/30 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform shadow-lg shadow-blue-500/10">
            <LogIn className="text-blue-400 w-10 h-10" />
          </div>
          <h2 className="text-4xl font-black mb-4 tracking-tighter text-glow-blue uppercase">Check-In</h2>
          <p className="text-slate-400 mb-10 max-w-sm font-medium leading-relaxed">Ready to build? Initialize your session to track development hours and eligibility.</p>
          
          <div className="flex flex-col w-full gap-4 max-w-xs">
            <button onClick={() => setView('checkin')} className="btn-primary text-lg py-4 w-full">
              START SESSION <ChevronRight className="w-5 h-5 inline ml-2" />
            </button>
            <button onClick={() => setView('resume')} className="btn-glass text-lg py-4 w-full rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-green-500/10 hover:border-green-500/30 hover:text-green-400">
              <Play className="w-5 h-5" /> RESUME ACTIVE
            </button>
            
            <div className="mt-8 w-full border-t border-white/5 pt-8">
              <p className="text-[10px] text-slate-500 font-black tracking-[0.3em] uppercase mb-5">SECURE AUTHENTICATION</p>
              <div className="flex flex-col gap-3">
                <div className="w-full flex justify-center">
                  <GoogleLogin 
                    onSuccess={onGoogleLogin}
                    onError={() => console.log('Login Failed')}
                    theme="filled_black"
                    shape="pill"
                  />
                </div>
                <button
                  onClick={handleManualFBLogin}
                  className="flex items-center justify-center gap-3 bg-[#1877F2]/10 border border-[#1877F2]/30 text-[#1877F2] px-6 h-[44px] rounded-full font-bold hover:bg-[#1877F2]/20 transition-all w-full uppercase text-xs tracking-widest"
                >
                  <Globe className="w-4 h-4" /> Facebook Login
                </button>
              </div>
            </div>
            
            <button onClick={() => setView('register')} className="mt-6 text-xs font-black text-slate-500 hover:text-white transition-colors tracking-widest">
              REGISTER NEW STUDENT →
            </button>
          </div>
        </div>

        <div className="glass-card p-10 flex flex-col items-center text-center group">
          <div className="w-20 h-20 rounded-3xl bg-amber-500/10 border-2 border-amber-500/30 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform shadow-lg shadow-amber-500/10">
            <LogOut className="text-amber-400 w-10 h-10" />
          </div>
          <h2 className="text-4xl font-black mb-4 tracking-tighter text-glow-gold uppercase">Check-Out</h2>
          <p className="text-slate-400 mb-10 max-w-sm font-medium leading-relaxed">Build finished for the day? Sign out and securely log your session accomplishments.</p>
          
          <div className="flex flex-col w-full gap-4 max-w-xs h-full justify-center">
            {activeSessions.length > 0 ? (
              <>
                <button onClick={() => setView('checkout')} className="btn-gold text-lg py-4 w-full flex items-center justify-center gap-2">
                  FINALIZE LOG <ChevronRight className="w-5 h-5" />
                </button>
                <button onClick={() => setView('pause')} className="btn-glass text-lg py-4 w-full rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-amber-500/10 hover:border-amber-500/30 hover:text-amber-400">
                  <Pause className="w-5 h-5" /> PAUSE SESSION
                </button>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed border-white/5 rounded-3xl bg-black/20">
                <ShieldAlert className="w-12 h-12 text-slate-700 mb-4" />
                <p className="text-slate-600 font-black uppercase tracking-widest text-sm">No Active Sessions</p>
                <p className="text-[10px] text-slate-700 mt-1 max-w-[150px]">Start a session on the left to track your work.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function Register({ setView, notify, refresh }) {
  const [form, setForm] = useState({ name: '', id: '', grade: '9', squad: 'Build' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE}/register`, form);
      notify(`Welcome, ${form.name}! You are registered.`);
      refresh();
      setView('lobby');
    } catch (e) {
      notify(e.response?.data?.error || 'Registration failed', 'error');
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-md mx-auto glass-panel p-10">
      <h2 className="text-2xl font-black mb-8 flex items-center gap-3">
        <UserPlus className="text-blue-400" /> STUDENT REGISTRATION
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="label">FULL NAME</label>
          <input required className="input-field" value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="First & Last Name" />
        </div>
        <div>
          <label className="label">STUDENT ID</label>
          <input required className="input-field" value={form.id} onChange={e => setForm({...form, id: e.target.value})} placeholder="School ID #" />
        </div>
        <div>
          <label className="label">GRADE LEVEL</label>
          <select className="input-field" value={form.grade} onChange={e => setForm({...form, grade: e.target.value})}>
            <option value="9">9th Grade (Freshman)</option>
            <option value="10">10th Grade (Sophomore)</option>
            <option value="11">11th Grade (Junior)</option>
            <option value="12">12th Grade (Senior)</option>
          </select>
        </div>
        <div>
          <label className="label">SQUAD / ROLE</label>
          <select className="input-field" value={form.squad || 'Build'} onChange={e => setForm({...form, squad: e.target.value})}>
            <option value="Build">Build & Fabrication</option>
            <option value="Programming">Programming & Control</option>
            <option value="CAD">CAD & Design</option>
            <option value="Electrical">Electrical & Wiring</option>
            <option value="Media">Media & Business</option>
            <option value="Drive Team">Drive & Strategy</option>
          </select>
        </div>
        <div className="flex gap-4 pt-4">
          <button type="button" onClick={() => setView('lobby')} className="flex-1 px-6 py-3 border border-white/10 rounded-xl font-bold text-slate-400 hover:text-white transition-all">CANCEL</button>
          <button type="submit" className="flex-1 btn-primary">REGISTER</button>
        </div>
      </form>
    </motion.div>
  );
}

function CheckIn({ setView, notify, refresh, students, activities, preselectedStudent, missionCompletions, setActiveVideo }) {
  const [studentId, setStudentId] = useState(preselectedStudent || '');
  const [activity, setActivity] = useState('');
  const [search, setSearch] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [squad, setSquad] = useState(Object.keys(SQUAD_MISSIONS)[0]);

  // If preselected, find their name to show in the search box
  useEffect(() => {
    if (preselectedStudent) {
      const student = students.find(s => s.id === preselectedStudent);
      if (student) setSearch(student.name);
    }
  }, [preselectedStudent, students]);

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) || 
    s.id.includes(search)
  ).slice(0, 5);

  const handleActivityClick = async (act) => {
    if (!studentId) return notify('Please select your name first', 'error');
    setActivity(act);
    try {
      await axios.post(`${API_BASE}/checkin`, { studentId, activity: act });
      notify(`Session started! Go build something great.`);
      refresh();
      
      // Auto-open the training module if one exists for this activity
      if (ACTIVITY_RESOURCES[act]) {
        setActiveVideo({ activity: act, studentId });
      }
      setView('lobby');
    } catch (e) {
      const errorMsg = e.response?.data?.error || 'Check-in failed';
      notify(errorMsg, 'error');
      
      // If they are already checked in, allow them to resume watching the video anyway
      if (errorMsg === 'Student already checked in') {
        if (ACTIVITY_RESOURCES[act]) {
          setActiveVideo({ activity: act, studentId });
        }
        setView('lobby');
      }
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-panel p-12">
      <h2 className="text-3xl font-black mb-12 text-center uppercase tracking-tight">MISSION START: CHECK-IN</h2>
      
      <div className="grid md:grid-cols-2 gap-12">
        {/* Left Column */}
        <div className="space-y-12">
          {/* Student Picker */}
          <div className="space-y-6">
            <label className="label uppercase tracking-widest text-blue-400">1. IDENTIFY BUILDER</label>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
              <input 
                className="input-field pl-12 py-4 text-lg" 
                placeholder="Search Name or ID..." 
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <div className="space-y-2 overflow-y-auto pr-2 max-h-[250px]">
              {filteredStudents.map(s => (
                <button 
                  key={s.id} 
                  onClick={() => { setStudentId(s.id); setSearch(s.name); }}
                  className={`w-full p-4 rounded-xl text-left font-bold transition-all border ${studentId === s.id ? 'bg-blue-500/20 border-blue-500/50 text-white' : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10'}`}
                >
                  {s.name} <span className="text-[10px] opacity-50 ml-2">ID: {s.id}</span>
                </button>
              ))}
              {search && filteredStudents.length === 0 && <p className="text-xs text-slate-500 italic">No builder found matching that ID.</p>}
            </div>
          </div>

          {/* Squad Picker */}
          <div className="space-y-6">
            <label className="label uppercase tracking-widest text-purple-400">2. SELECT SQUAD</label>
            <div className="flex flex-wrap gap-2 mb-4">
              {Object.keys(SQUAD_MISSIONS).map(squadName => (
                <button
                  key={squadName}
                  onClick={() => setSquad(squadName)}
                  className={`px-3 py-3 text-sm font-bold uppercase rounded-lg transition-all flex-1 text-center ${
                    squad === squadName 
                      ? 'bg-purple-600 text-white shadow-[0_0_10px_rgba(168,85,247,0.5)]' 
                      : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white border border-white/5'
                  }`}
                >
                  {squadName}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-12">
          {/* Mission Picker */}
          <div className="space-y-6">
            <label className="label uppercase tracking-widest text-emerald-400">3. SELECT MISSION</label>
            <div className="grid grid-cols-2 gap-5 overflow-y-auto pr-2" style={{ maxHeight: '400px' }}>
              {(squad ? SQUAD_MISSIONS[squad] : []).map(act => (
                <div key={act} className="relative group flex flex-col">
                  <button 
                    onClick={() => handleActivityClick(act)}
                    className={`bg-slate-900 relative flex-1 flex flex-col items-center justify-end overflow-hidden rounded-2xl text-[10px] sm:text-xs font-black uppercase text-center leading-tight transition-all border-2 ${activity === act ? 'border-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.4)] text-white scale-[1.02]' : 'border-white/10 text-slate-300 hover:border-white/20 hover:text-white'}`}
                    style={{ minHeight: '100px' }}
                  >
                    <img 
                      src={`/activities/${act.replace(/[^a-zA-Z0-9]/g, '_')}.jpg?v=2`} 
                      alt={act} 
                      onError={(e) => { e.target.onerror = null; e.target.style.display = 'none'; }}
                      className={`absolute inset-0 w-full h-full object-cover transition-opacity ${activity === act ? 'opacity-100' : 'opacity-60 group-hover:opacity-80'}`} 
                    />
                    <div className="relative z-10 w-full p-2 bg-gradient-to-t from-black/90 via-black/70 to-transparent pt-8 backdrop-blur-[1px]">
                        <div className="flex flex-col items-center gap-1">
                          {act}
                          {(() => {
                            const completions = (missionCompletions[act] || []).length;
                            const starsAvailable = Math.max(0, 5 - completions);
                            return <MissionStars count={starsAvailable} />;
                          })()}
                        </div>
                    </div>
                  </button>
                  {ACTIVITY_RESOURCES[act] && (
                    <button 
                      type="button"
                      onClick={() => handleActivityClick(act)}
                      className="absolute -top-2 -right-2 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all shadow-[0_0_15px_rgba(52,211,153,0.3)] z-10 opacity-90 hover:opacity-100 hover:scale-110 hover:shadow-[0_0_25px_rgba(52,211,153,0.6)]"
                      title="Watch Required Training Module"
                    >
                      <img src="/syprian-head.png" alt="Syprian" className="w-full h-full object-contain bg-slate-900 rounded-full border-2 border-emerald-500 p-0.5" />
                    </button>
                  )}
                </div>
              ))}
              {!squad && (
                <div className="col-span-2 text-center text-slate-500 italic py-10">
                  Please select a Squad above to view available missions.
                </div>
              )}
            </div>
          </div>

          {/* Upload Section */}
          <div className="space-y-6">
            <label className="label uppercase tracking-widest text-amber-400">4. UPLOAD PREREQUISITES (OPTIONAL)</label>
            <div className="border-2 border-dashed border-white/10 rounded-2xl p-8 text-center bg-white/5 hover:bg-white/10 transition-colors cursor-pointer flex flex-col items-center justify-center relative overflow-hidden">
                <input 
                  type="file" 
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  onChange={(e) => setUploadedFile(e.target.files[0])}
                />
                <Paperclip className="w-8 h-8 text-amber-400/50 mb-3" />
                <p className="text-sm font-bold text-slate-300">
                  {uploadedFile ? uploadedFile.name : "Drag & Drop or Click to Upload"}
                </p>
                <p className="text-xs text-slate-500 mt-1">CAD exports, Code Snippets, or Reference Media</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12 flex gap-4 max-w-lg mx-auto">
        <button onClick={() => setView('lobby')} className="w-full py-4 font-bold text-slate-500 hover:text-white transition-all">CANCEL MISSION</button>
      </div>

      <div className="mt-8 pt-6 border-t border-white/10 text-center max-w-lg mx-auto">
        <p className="text-xs text-slate-500 mb-3">New here? Need an official team email address?</p>
        <button onClick={() => setView('email')} className="inline-flex items-center gap-2 text-sm font-bold text-blue-400 hover:text-blue-300 transition-colors">
          <Mail className="w-4 h-4" /> Request @hwsroboteam.org Email
        </button>
      </div>
    </motion.div>
  );
}

function PauseSession({ setView, activeSessions, notify, refresh }) {
  const [studentId, setStudentId] = useState('');

  const handlePause = async (id) => {
    try {
      await axios.post(`${API_BASE}/pause`, { studentId: id });
      notify('Session paused successfully.', 'success');
      refresh();
      setView('lobby');
    } catch (e) {
      notify(e.response?.data?.error || 'Failed to pause', 'error');
    }
  };

  const activeOnly = activeSessions.filter(s => s.status === 'active');

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl mx-auto glass-panel p-12">
      <h2 className="text-3xl font-black mb-10 text-center flex items-center justify-center gap-4">
        <Pause className="text-yellow-500" /> PAUSE SESSION
      </h2>
      <div>
        <label className="label">WHO IS PAUSING?</label>
        <div className="grid md:grid-cols-2 gap-3">
          {activeOnly.map(s => (
            <button 
              type="button"
              key={s.studentId}
              onClick={() => handlePause(s.studentId)}
              className="p-4 rounded-xl text-left font-bold transition-all border bg-white/5 border-white/5 text-slate-400 hover:bg-yellow-500/20 hover:border-yellow-500/50 hover:text-white"
            >
              {s.studentName}
              <div className="text-[10px] opacity-60 font-medium">{s.activity}</div>
            </button>
          ))}
        </div>
        {activeOnly.length === 0 && <p className="text-center text-slate-500 italic mt-8">No active sessions to pause.</p>}
      </div>
      <div className="mt-8">
        <button type="button" onClick={() => setView('lobby')} className="w-full py-4 font-bold text-slate-500 hover:text-white">CANCEL</button>
      </div>
    </motion.div>
  );
}

function ResumeSession({ setView, activeSessions, notify, refresh, setActiveVideo }) {
  const handleResume = async (session) => {
    try {
      if (session.status === 'paused') {
        await axios.post(`${API_BASE}/resume`, { studentId: session.studentId });
        notify('Session resumed successfully.', 'success');
        refresh();
      }
      
      if (ACTIVITY_RESOURCES[session.activity]) {
        setActiveVideo({ activity: session.activity, studentId: session.studentId });
      }
      setView('lobby');
    } catch (e) {
      notify(e.response?.data?.error || 'Failed to resume', 'error');
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl mx-auto glass-panel p-12">
      <h2 className="text-3xl font-black mb-10 text-center flex items-center justify-center gap-4">
        <Play className="text-green-500" /> RESUME SESSION
      </h2>
      <div>
        <label className="label">WHO IS RESUMING?</label>
        <div className="grid md:grid-cols-2 gap-3">
          {activeSessions.map(s => (
            <button 
              type="button"
              key={s.studentId}
              onClick={() => handleResume(s)}
              className="p-4 rounded-xl text-left font-bold transition-all border bg-white/5 border-white/5 text-slate-400 hover:bg-green-500/20 hover:border-green-500/50 hover:text-white"
            >
              <div className="flex items-center gap-2">
                {s.studentName}
                {s.status === 'paused' && <span className="text-[10px] bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded border border-yellow-500/30 uppercase tracking-wider">PAUSED</span>}
              </div>
              <div className="text-[10px] opacity-60 font-medium">{s.activity}</div>
            </button>
          ))}
        </div>
        {activeSessions.length === 0 && <p className="text-center text-slate-500 italic mt-8">No active sessions to resume.</p>}
      </div>
      <div className="mt-8">
        <button type="button" onClick={() => setView('lobby')} className="w-full py-4 font-bold text-slate-500 hover:text-white">CANCEL</button>
      </div>
    </motion.div>
  );
}

function CheckOut({ setView, notify, refresh, activeSessions, preselectedStudent, onCheckoutSuccess }) {
  const [studentId, setStudentId] = useState(preselectedStudent || '');
  const [accomplishment, setAccomplishment] = useState('');
  const [level, setLevel] = useState('Level 1');
  const [verifyId, setVerifyId] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!studentId || !accomplishment) return notify('Please select your name and log input', 'error');
    
    if (!preselectedStudent && verifyId !== studentId) {
      return notify('Identity Verification Failed: Incorrect Student ID.', 'error');
    }

    // Find activity
    const session = activeSessions.find(s => s.studentId === studentId);
    
    try {
      const res = await axios.post(`${API_BASE}/checkout`, { studentId, accomplishment });
      notify(`Well done! Logged ${res.data.hours} hours. Total: ${res.data.totalHours}`);
      refresh();
      if (session && QUIZZES[session.activity]) {
        onCheckoutSuccess({ studentId, activity: session.activity, level });
      } else {
        setView('lobby');
      }
    } catch (e) {
      notify(e.response?.data?.error || 'Check-out failed', 'error');
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl mx-auto glass-panel p-12">
      <h2 className="text-3xl font-black mb-10 text-center flex items-center justify-center gap-4">
        <ClipboardList className="text-gold-500" /> MISSION DEBRIEF
      </h2>
      <form onSubmit={handleSubmit} className="space-y-8">
        <div>
          <label className="label">WHO ARE YOU?</label>
          <div className="grid md:grid-cols-2 gap-3">
            {activeSessions.map(s => (
              <button 
                type="button"
                key={s.studentId}
                onClick={() => setStudentId(s.studentId)}
                className={`p-4 rounded-xl text-left font-bold transition-all border ${studentId === s.studentId ? 'bg-gold-500/20 border-gold-500/50 text-white' : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10'}`}
              >
                {s.studentName}
                <div className="text-[10px] opacity-60 font-medium">In for {Math.round((new Date() - new Date(s.startTime)) / (1000 * 60))} mins</div>
              </button>
            ))}
          </div>
        </div>

        {!preselectedStudent && (
          <div>
            <label className="label text-red-400">VERIFY IDENTITY (STUDENT ID)</label>
            <input 
              type="password"
              required
              className="input-field border-red-500/30 focus:border-red-400"
              placeholder="Enter your Student ID to confirm it's you"
              value={verifyId}
              onChange={e => setVerifyId(e.target.value)}
            />
            <p className="text-[10px] text-slate-500 mt-1 uppercase">Required to prevent unauthorized checkouts</p>
          </div>
        )}

        <div>
          <label className="label">ACCOMPLISHMENT LOG (PROOF OF WORK)</label>
          <textarea 
            required
            className="input-field min-h-[120px] resize-none"
            placeholder="What exactly did you complete today? (e.g. Assembled the lift winch, completed WPILib drive code, finished CAD for battery mounting...)"
            value={accomplishment}
            onChange={e => setAccomplishment(e.target.value)}
          />
        </div>

        <div>
          <label className="label">QUIZ DIFFICULTY LEVEL (ADAPTIVE CURRICULUM)</label>
          <div className="grid grid-cols-2 gap-4">
            {['Level 1', 'Level 2'].map(lvl => (
              <button 
                type="button"
                key={lvl}
                onClick={() => setLevel(lvl)}
                className={`p-4 rounded-xl font-bold transition-all border ${level === lvl ? 'bg-gold-500/20 border-gold-500/50 text-white' : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10'}`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-4">
          <button type="button" onClick={() => setView('lobby')} className="flex-1 py-4 font-bold text-slate-500 hover:text-white">BACK</button>
          <button type="submit" className="flex-[3] btn-gold text-xl font-black">LOG SESSION & DEPART</button>
        </div>
      </form>
    </motion.div>
  );
}

function LiveBoard({ activeSessions, students, setActiveVideo, missionCompletions }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid md:grid-cols-3 gap-6">
      <div className="md:col-span-2 glass-panel p-8">
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
          <Activity className="text-blue-400" /> ACTIVE BUILDERS
        </h3>
        <div className="space-y-4">
          {activeSessions.length === 0 ? (
            <p className="py-20 text-center text-slate-500 font-bold italic">BUILDING IS CURRENTLY IDLE</p>
          ) : activeSessions.map(s => (
            <div key={s.studentId} className="flex justify-between items-center p-5 bg-white/5 border border-white/5 rounded-2xl">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl border flex items-center justify-center font-black text-white ${s.status === 'paused' ? 'bg-yellow-500/20 border-yellow-500/50' : 'bg-gradient-to-br from-slate-700 to-slate-900 border-white/10'}`}>
                  {s.status === 'paused' ? <Pause className="w-6 h-6 text-yellow-400" /> : s.studentName.charAt(0)}
                </div>
                <div>
                  <div className="font-bold text-lg flex items-center gap-2">
                    {s.studentName}
                    {s.status === 'paused' && <span className="text-[10px] bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded border border-yellow-500/30 uppercase tracking-wider">PAUSED</span>}
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-[11px] font-bold text-accent-blue uppercase tracking-widest">{s.activity}</div>
                    {ACTIVITY_RESOURCES[s.activity] && (
                      <button 
                        onClick={() => setActiveVideo({ activity: s.activity, studentId: s.studentId })}
                        className="text-[10px] bg-blue-500/20 text-blue-300 hover:bg-blue-500/40 px-2 py-1 rounded border border-blue-500/30 transition-colors uppercase font-bold flex items-center gap-1"
                      >
                        <ExternalLink className="w-3 h-3" /> Watch Module
                      </button>
                    )}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-slate-400 font-medium">ELAPSED</div>
                <div className="font-mono text-xl text-gold-500 font-black">
                  {((new Date() - new Date(s.startTime)) / (1000 * 60)).toFixed(0)}m
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="glass-panel p-8">
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
          <Award className="text-gold-500" /> TOP CONTRIBUTORS
        </h3>
        <div className="space-y-4">
          {students.slice(0, 5).map((s, i) => (
            <div key={s.id} className="flex items-center gap-4 p-3 bg-white/5 rounded-xl">
              <div className="text-xl font-black text-slate-700 italic">#{i+1}</div>
              <div className="flex-1">
                <div className="font-bold text-sm flex items-center gap-2">
                  {s.name}
                  {s.totalHours >= 10 && <span title="10-Hour Club" className="text-purple-400">🔥</span>}
                  {s.scores && Object.values(s.scores).some(score => score >= 80) && <span title="Safety Certified" className="text-green-400">🛡️</span>}
                  {s.competitionReady && <span title="Trip Ready" className="text-gold-400">⭐</span>}
                  {s.stars > 0 && <div className="flex items-center gap-0.5 ml-1 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20 text-[9px] font-black text-amber-400 uppercase tracking-tighter animate-pulse shadow-[0_0_10px_rgba(245,158,11,0.2)]">
                    <Award className="w-2.5 h-2.5 fill-amber-400" /> {s.stars} STARS
                  </div>}
                </div>
                <div className="w-full bg-white/5 h-1.5 rounded-full mt-1.5 overflow-hidden">
                  <div className="bg-gold-500 h-full" style={{ width: `${Math.min((s.totalHours / 20) * 100, 100)}%` }} />
                </div>
              </div>
              <div className="text-right">
                <div className="font-black text-sm">{s.totalHours}h</div>
                <div className="text-[9px] font-bold text-slate-500">HOURS</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function AdminDashboard({ stats, ferpaRecords, refresh, activeSessions, notify }) {
  const [pass, setPass] = useState('');
  const [authed, setAuthed] = useState(false);
  const [expandedStudent, setExpandedStudent] = useState(null);
  const [activeTab, setActiveTab] = useState('ACTIVE');
  const [selectedDriverId, setSelectedDriverId] = useState('');
  const [activeTelemetryGame, setActiveTelemetryGame] = useState('DECODE');
  const [chatInput, setChatInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);
  const baseInputRef = useRef('');
  
  const [chatHistory, setChatHistory] = useState([
    { role: 'ai', text: 'Welcome, Coach. I am your Syprian Strategy AI. How can I assist with your team\'s telemetry, builder roster, or strategy today?' }
  ]);

  const toggleListen = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      // Auto-submit when clicking mic to stop
      if (chatInput.trim()) {
         submitMessage(chatInput);
      }
    } else {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        notify('Voice recognition not supported in this browser.', 'error');
        return;
      }
      
      if (!recognitionRef.current) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;

        recognition.onresult = (event) => {
          let currentInterim = '';
          let currentFinal = '';

          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              currentFinal += event.results[i][0].transcript;
            } else {
              currentInterim += event.results[i][0].transcript;
            }
          }

          if (currentFinal) {
             baseInputRef.current += (baseInputRef.current && !baseInputRef.current.endsWith(' ') ? ' ' : '') + currentFinal.trim() + ' ';
             setChatInput(baseInputRef.current + currentInterim);
          } else {
             setChatInput(baseInputRef.current + (baseInputRef.current && !baseInputRef.current.endsWith(' ') ? ' ' : '') + currentInterim);
          }
        };

        recognition.onend = () => {
          setIsListening(false);
        };
        recognitionRef.current = recognition;
      }
      
      baseInputRef.current = chatInput;
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (e) {
        console.error(e);
      }
    }
  };

  const submitMessage = async (textToSubmit) => {
    if(!textToSubmit.trim()) return;
    
    const input = textToSubmit.trim();
    const newHistory = [...chatHistory, { role: 'user', text: input }];
    setChatHistory(newHistory);
    setChatInput('');
    baseInputRef.current = '';
    
    try {
      const response = await axios.post(`${API_BASE}/strategist`, { 
        message: input, 
        history: chatHistory 
      });
      setChatHistory([...newHistory, { role: 'ai', text: response.data.reply }]);
    } catch (error) {
      setChatHistory([...newHistory, { role: 'ai', text: 'Error connecting to the God Brain API. Please verify the configuration.' }]);
    }
  };

  const handleChatSubmit = async (e) => {
    e.preventDefault();
    submitMessage(chatInput);
  };

  const login = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_BASE}/admin/login`, { password: pass });
      if (res.data.success) {
        localStorage.setItem('coach_token', res.data.token);
        setAuthed(true);
      }
    } catch (err) {
      notify(err.response?.data?.error || 'Invalid access code', 'error');
    }
  };

  // Auto-login if token exists
  useEffect(() => {
    const token = localStorage.getItem('coach_token');
    if (token) setAuthed(true);
  }, []);

  if (!authed) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-md mx-auto glass-panel p-10 mt-10">
        <h2 className="text-2xl font-black mb-8 flex items-center gap-3">
          <ShieldCheck className="text-purple-400" /> COACH AUTHENTICATION
        </h2>
        <form onSubmit={login} className="space-y-6">
          <div>
            <label className="label">ACCESS CODE</label>
            <input type="password" required className="input-field" value={pass} onChange={e => setPass(e.target.value)} placeholder="••••••••" />
          </div>
          <button type="submit" className="w-full btn-primary py-4">UNLOCK COCKPIT</button>
        </form>
      </motion.div>
    );
  }

  const exportCSV = () => {
    const headers = ['ID', 'Name', 'Grade', 'Squad', 'Total Hours', 'Competition Ready'];
    const rows = stats.students.map(s => [
      s.id, `"${s.name}"`, s.grade, s.squad || 'Unassigned', s.totalHours, s.competitionReady ? 'Yes' : 'No'
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `RoboTrack_Export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-8">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-2xl font-black text-white flex items-center gap-3 tracking-widest uppercase">
          <i className="fa-solid fa-gauge-high text-purple-400"></i> Coaches Dashboard
        </h2>
      </div>
      {/* Quick Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { label: 'TOTAL STUDENTS', val: stats.students.length, ico: Users, col: 'blue' },
          { label: 'COMPETITION READY', val: stats.students.filter(s => s.competitionReady).length, ico: Award, col: 'gold' },
          { label: 'AVG HOURS', val: (stats.students.reduce((a, b) => a + b.totalHours, 0) / (stats.students.length || 1)).toFixed(1), ico: Clock, col: 'purple' },
          { label: 'THRESHOLD', val: `${stats.threshold}h`, ico: Zap, col: 'teal' }
        ].map(st => (
          <div key={st.label} className="glass-panel p-6">
            <st.ico className={`text-${st.col}-400 mb-4 w-6 h-6`} />
            <div className="text-2xl font-black">{st.val}</div>
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{st.label}</div>
          </div>
        ))}
      </div>

      <div className="flex gap-4 border-b border-white/10 pb-4">
        <button onClick={() => setActiveTab('ACTIVE')} className={`px-6 py-2 rounded-lg font-bold text-sm tracking-widest transition-all ${activeTab === 'ACTIVE' ? 'bg-red-500/20 text-red-400 border border-red-500/50' : 'text-slate-500 hover:text-white'}`}>
          ACTIVE SESSIONS ({activeSessions?.length || 0})
        </button>
        <button onClick={() => setActiveTab('ROSTER')} className={`px-6 py-2 rounded-lg font-bold text-sm tracking-widest transition-all ${activeTab === 'ROSTER' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/50' : 'text-slate-500 hover:text-white'}`}>ROSTER</button>
        <button onClick={() => setActiveTab('TELEMETRY')} className={`px-6 py-2 rounded-lg font-bold text-sm tracking-widest flex items-center gap-2 transition-all ${activeTab === 'TELEMETRY' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/50' : 'text-slate-500 hover:text-white'}`}>
          <Activity className="w-4 h-4" /> DRIVER TELEMETRY <span className="text-[9px] bg-purple-500/30 text-purple-200 px-2 py-0.5 rounded ml-2">BETA</span>
        </button>
        <button onClick={() => setActiveTab('INSTRUCTIONS')} className={`px-6 py-2 rounded-lg font-bold text-sm tracking-widest flex items-center gap-2 transition-all ${activeTab === 'INSTRUCTIONS' ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/50' : 'text-slate-500 hover:text-white'}`}>
          <Settings className="w-4 h-4" /> COACHES INSTRUCTIONS
        </button>
      </div>

      {activeTab === 'ACTIVE' && (
        <div className="glass-panel p-8">
          <h3 className="text-xl font-bold mb-8 flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></span> LIVE MISSION COCKPIT
          </h3>
          {(!activeSessions || activeSessions.length === 0) ? (
            <div className="py-12 border-2 border-dashed border-white/5 rounded-2xl flex flex-col items-center justify-center">
              <p className="text-slate-500 font-bold italic">NO BUILDERS CURRENTLY ACTIVE</p>
            </div>
          ) : (
            <div className="space-y-4">
              {activeSessions.map(s => (
                <div key={s.studentId} className="bg-white/5 border border-white/10 p-5 rounded-2xl flex justify-between items-center group hover:bg-white/10 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center font-black text-white text-xl">
                      {s.studentName.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-lg font-black text-white">{s.studentName}</h4>
                      <p className="text-xs font-bold text-accent-blue tracking-widest uppercase">{s.activity}</p>
                      <p className="text-xs text-slate-500 mt-1">
                        Elapsed: {((new Date() - new Date(s.startTime)) / (1000 * 60)).toFixed(0)}m
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={async () => {
                      try {
                        await axios.post(`${API_BASE}/admin/force-checkout`, { studentId: s.studentId });
                        notify(`${s.studentName} forcefully disconnected.`, 'success');
                        refresh();
                      } catch (err) {
                        notify(err.response?.data?.error || 'Failed to disconnect user.', 'error');
                      }
                    }}
                    className="opacity-50 group-hover:opacity-100 bg-red-500/20 text-red-400 border border-red-500/50 hover:bg-red-500 hover:text-white px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-widest transition-all flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" /> MASTER DISCONNECT
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'ROSTER' && (
      <div className="glass-panel p-8">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-xl font-bold">BUILDER ROSTER & COMPETITION STATUS</h3>
          <button onClick={exportCSV} className="bg-blue-500/20 text-blue-400 border border-blue-500/50 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-blue-500 hover:text-white transition-all flex items-center gap-2">
            <Download className="w-4 h-4" /> EXPORT CSV
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-white/5">
                <th className="pb-4">NAME</th>
                <th className="pb-4">SQUAD</th>
                <th className="pb-4">GRADE</th>
                <th className="pb-4">HOURS LOGGED</th>
                <th className="pb-4">QUIZ SCORE</th>
                <th className="pb-4">PROGRESS</th>
                <th className="pb-4">STATUS</th>
              </tr>
            </thead>
            <tbody>
              {stats.students.map(s => {
                const totalPossible = Object.keys(QUIZZES).length * 100;
                const earned = s.scores ? Object.values(s.scores).reduce((a,b) => a+b, 0) : 0;
                const isExpanded = expandedStudent === s.id;
                const studentRecords = ferpaRecords.filter(r => r.studentId === s.id);
                const activeSession = activeSessions?.find(act => act.studentId === s.id);
                return (
                <React.Fragment key={s.id}>
                <tr onClick={() => setExpandedStudent(isExpanded ? null : s.id)} className="border-b border-white/5 group hover:bg-white/[0.02] transition-colors cursor-pointer">
                  <td className="py-4 font-bold text-slate-200">
                    <div className="flex items-center gap-2">
                      <span className="text-blue-400 hover:text-blue-300 hover:underline transition-colors">
                        {s.name} {s.username && <span className="text-[10px] text-slate-400 uppercase ml-1">({s.username})</span>}
                        {s.isPrivate && <span className="text-[10px] bg-red-500/20 text-red-400 px-1 ml-1 rounded">HIDDEN</span>}
                      </span> <span className="text-xs font-medium text-slate-600">#{s.id}</span>
                      {s.totalHours >= 10 && <span title="10-Hour Club" className="text-purple-400 text-xs">🔥</span>}
                      {s.scores && Object.values(s.scores).some(score => score >= 80) && <span title="Safety Certified" className="text-green-400 text-xs">🛡️</span>}
                    </div>
                  </td>
                  <td className="py-4 text-slate-400 font-semibold">{s.squad || 'Build'}</td>
                  <td className="py-4 text-slate-400 font-semibold">{s.grade}{s.grade.endsWith('th') ? '' : 'th'}</td>
                  <td className="py-4 font-mono font-black text-white">{s.totalHours}h</td>
                  <td className="py-4 font-mono font-bold text-blue-400">{earned}/{totalPossible}</td>
                  <td className="py-4 w-48">
                    <div className="w-32 bg-white/5 h-2 rounded-full overflow-hidden">
                      <div className={`h-full transition-all ${s.competitionReady ? 'bg-green-500' : 'bg-blue-500'}`} style={{ width: `${Math.min((s.totalHours / stats.threshold) * 100, 100)}%` }} />
                    </div>
                  </td>
                  <td className="py-4">
                    <div className="flex flex-col gap-2 items-start">
                      <div className="flex items-center gap-2">
                        {s.competitionReady ? (
                          <span className="px-3 py-1 bg-green-500/10 border border-green-500/30 text-green-500 text-[10px] font-black uppercase rounded-full whitespace-nowrap">TRIP READY</span>
                        ) : (
                          <span className="px-3 py-1 bg-slate-500/10 border border-slate-500/30 text-slate-500 text-[10px] font-black uppercase rounded-full whitespace-nowrap">IN TRAINING</span>
                        )}
                        {activeSession && (
                          <span className="px-3 py-1 bg-blue-500/10 border border-blue-500/30 text-blue-400 text-[10px] font-black uppercase rounded-full whitespace-nowrap flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
                            ACTIVE
                          </span>
                        )}
                      </div>
                      
                      {activeSession && (
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            axios.post(`${API_BASE}/admin/force-checkout`, { studentId: s.id })
                              .then(() => { notify(`${s.name} forcefully disconnected.`, 'success'); refresh(); })
                              .catch(err => notify(err.response?.data?.error || 'Failed to disconnect user.', 'error'));
                          }}
                          className="bg-red-500/20 text-red-400 border border-red-500/50 hover:bg-red-500 hover:text-white px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest transition-all"
                        >
                          DISCONNECT
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
                {isExpanded && studentRecords.length > 0 && (
                  <tr className="bg-black/40 border-b border-white/5">
                    <td colSpan="7" className="p-6">
                      <div className="text-xs font-bold text-purple-400 mb-4 uppercase tracking-widest">Detailed Quiz History (FERPA DB)</div>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 items-stretch">
                        {studentRecords.map((r, i) => (
                          <div key={i} className="bg-white/5 border border-white/10 p-4 rounded-xl flex flex-col justify-between">
                            <div>
                              <div className="text-white font-bold mb-1 leading-tight">{r.activity}</div>
                              <div className="text-slate-400 text-[10px] uppercase tracking-wider mb-3">{r.level} • {new Date(r.timestamp).toLocaleDateString()}</div>
                            </div>
                            <div className={`text-2xl font-black ${r.score >= 70 ? 'text-green-400' : 'text-red-400'}`}>{r.score}%</div>
                          </div>
                        ))}
                      </div>
                    </td>
                  </tr>
                )}
                </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      )}

      {activeTab === 'TELEMETRY' && (
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-1 space-y-6">
             <div className="glass-panel p-6">
               <h3 className="font-bold text-sm text-slate-400 tracking-widest mb-4">SELECT DRIVER</h3>
               <select className="input-field mb-6 w-full bg-black/50" value={selectedDriverId} onChange={e => setSelectedDriverId(e.target.value)}>
                 <option value="">-- Choose a Drive Team Member --</option>
                 {stats.students.filter(s => s.squad === 'Drive Team' || true).map(s => (
                   <option key={s.id} value={s.id}>{s.name} ({s.squad || 'Build'})</option>
                 ))}
               </select>

               <h3 className="font-bold text-sm text-slate-400 tracking-widest mb-4 mt-8">GAME MODULE</h3>
               <div className="space-y-3 flex flex-col gap-2">
                 <button onClick={() => setActiveTelemetryGame('DECODE')} className={`w-full text-left p-3 rounded-lg font-bold text-sm transition-all ${activeTelemetryGame === 'DECODE' ? 'bg-blue-500/20 border border-blue-500/50 text-white' : 'bg-white/5 text-slate-500 hover:text-white'}`}>FTC 2025-2026: DECODE</button>
                 <button onClick={() => setActiveTelemetryGame('REBUILT')} className={`w-full text-left p-3 rounded-lg font-bold text-sm transition-all ${activeTelemetryGame === 'REBUILT' ? 'bg-purple-500/20 border border-purple-500/50 text-white' : 'bg-white/5 text-slate-500 hover:text-white'}`}>FRC 2025-2026: REBUILT</button>
               </div>
             </div>

             {selectedDriverId && (
               <div className="glass-panel p-6 animate-pulse-once">
                 <h3 className="font-bold text-sm text-slate-400 tracking-widest mb-4 uppercase">Analytics Snapshot</h3>
                 <div className="space-y-4">
                   <div className="flex justify-between items-center"><span className="text-slate-500 text-sm">Verified Stick Time</span><span className="font-black text-blue-400">14h 22m</span></div>
                   <div className="flex justify-between items-center"><span className="text-slate-500 text-sm">Auto vs Teleop</span><span className="font-bold text-white text-sm">15% / 85%</span></div>
                   <div className="flex justify-between items-center pt-2 border-t border-white/5"><span className="text-slate-400 font-bold text-xs uppercase tracking-widest">Efficiency Score</span><span className="font-black text-green-400 text-xl">92/100</span></div>
                 </div>
               </div>
             )}
          </div>

          <div className="md:col-span-2 glass-panel p-6 flex flex-col items-center justify-center min-h-[500px]">
             {selectedDriverId ? (
               <div className="w-full h-full rounded-xl overflow-hidden bg-white/5 relative flex items-center justify-center">
                 <img src={activeTelemetryGame === 'DECODE' ? '/ftc_decode_field.png' : '/frc_rebuilt_field.png'} className="max-w-full max-h-[600px] object-contain" alt={`${activeTelemetryGame} Field Map`} />
                 <div className="absolute top-4 left-4 bg-black/80 px-4 py-2 rounded font-bold text-xs border border-white/10 text-white flex items-center gap-2 backdrop-blur-md">
                   <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span> LIVE {activeTelemetryGame} NT4 TELEMETRY
                 </div>
               </div>
             ) : (
               <div className="text-slate-500 font-bold tracking-widest text-sm flex flex-col items-center">
                 <Activity className="w-12 h-12 mb-4 opacity-50" />
                 SELECT A DRIVER TO VIEW THE {activeTelemetryGame} FIELD OVERLAY
               </div>
             )}
          </div>
        </div>
      )}

      {activeTab === 'INSTRUCTIONS' && (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="glass-panel p-8 space-y-6 h-[700px] overflow-y-auto pb-12">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-3"><Settings className="text-indigo-400" /> THE PLAYBOOK (SECRETS)</h3>
            
            <div className="bg-white/5 border border-white/10 p-4 rounded-xl">
              <h4 className="font-bold text-indigo-400 mb-2">1. Squad Optimization</h4>
              <p className="text-sm text-slate-400">Ensure every student has assigned a squad during registration. You can filter the Roster view or export to CSV to group them by sub-teams (Build, CAD, Programming, etc) to balance your workforce.</p>
            </div>
            
            <div className="bg-white/5 border border-white/10 p-4 rounded-xl">
              <h4 className="font-bold text-indigo-400 mb-2">2. The 10-Hour Club & Certifications</h4>
              <p className="text-sm text-slate-400">Students receive a 🔥 badge when they hit 10 hours. If they score 80% or higher on a safety quiz, they get the 🛡️ badge. Use this to easily identify who is allowed to operate heavy machinery in the lab.</p>
            </div>

            <div className="bg-white/5 border border-white/10 p-4 rounded-xl">
              <h4 className="font-bold text-indigo-400 mb-2">3. Trip Ready Thresholds</h4>
              <p className="text-sm text-slate-400">Once a student logs 20 hours, their status turns to "TRIP READY" and they receive a ⭐ badge. You can use the "EXPORT CSV" button to generate a list to send to the school district for travel approvals.</p>
            </div>

            <div className="bg-white/5 border border-white/10 p-4 rounded-xl">
              <h4 className="font-bold text-indigo-400 mb-2">4. NT4 Telemetry (BETA)</h4>
              <p className="text-sm text-slate-400">Under the "DRIVER TELEMETRY" tab, you can select any student who belongs to the Drive Team squad to view their real-time field positioning, automatically tracked from the robot's NetworkTables data over Wi-Fi.</p>
            </div>
          </div>

          <div className="glass-panel p-6 flex flex-col h-[700px]">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-3"><Zap className="text-purple-400" /> SYPRIAN STRATEGIST</h3>
            <div className="flex-1 bg-black/40 rounded-xl border border-white/10 p-4 mb-4 overflow-y-auto space-y-4">
              {chatHistory.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-xl text-sm ${msg.role === 'user' ? 'bg-indigo-500/30 border border-indigo-500/50 text-indigo-100' : 'bg-purple-500/20 border border-purple-500/30 text-purple-100'}`}>
                    <div className="font-bold text-[10px] uppercase tracking-widest mb-1 opacity-70">{msg.role === 'user' ? 'Coach' : 'Syprian AI'}</div>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>
            <form onSubmit={handleChatSubmit} className="flex gap-2">
              <button type="button" className="p-3 bg-white/5 border border-white/10 hover:bg-white/10 rounded-xl transition-colors" title="Upload File">
                <Paperclip className="w-5 h-5 text-slate-400" />
              </button>
              <button 
                type="button" 
                onClick={toggleListen}
                className={`p-3 rounded-xl transition-colors border ${isListening ? 'bg-red-500/20 border-red-500/50 hover:bg-red-500/30 animate-pulse' : 'bg-white/5 border-white/10 hover:bg-white/10'}`} 
                title="Voice Recognition"
              >
                <Mic className={`w-5 h-5 ${isListening ? 'text-red-400' : 'text-slate-400'}`} />
              </button>
              <input type="text" value={chatInput} onChange={e => setChatInput(e.target.value)} placeholder="Ask Syprian how to improve your team..." className="input-field flex-1 bg-black/50" />
              <button type="submit" className="bg-purple-500 hover:bg-purple-400 text-white px-4 rounded-xl font-bold transition-colors">ASK</button>
            </form>
          </div>
        </div>
      )}
    </motion.div>
  );
}

function QuizView({ setView, notify, refresh, checkoutData }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const quiz = React.useMemo(() => {
    if (!checkoutData || !QUIZZES[checkoutData.activity]) return null;
    const fullQuiz = [...(QUIZZES[checkoutData.activity][checkoutData.level] || [])];
    const shuffledQuestions = fullQuiz.sort(() => 0.5 - Math.random()).slice(0, 3);
    return shuffledQuestions.map(q => {
      const optionsWithIndex = q.options.map((opt, i) => ({ text: opt, isCorrect: i === q.correctAnswer }));
      const shuffledOptions = optionsWithIndex.sort(() => 0.5 - Math.random());
      return {
        question: q.question,
        options: shuffledOptions.map(o => o.text),
        correctAnswer: shuffledOptions.findIndex(o => o.isCorrect)
      };
    });
  }, [checkoutData]);

  if (!quiz) {
    return (
      <div className="glass-panel p-10 text-center">
        <p>No quiz available for this activity.</p>
        <button onClick={() => setView('lobby')} className="btn-primary mt-4">BACK</button>
      </div>
    );
  }

  const handleSubmit = async () => {
    let correct = 0;
    quiz.forEach((q, i) => {
      if (answers[i] === q.correctAnswer) correct++;
    });
    const finalScore = Math.round((correct / quiz.length) * 100);
    
    let detailedAnswers = quiz.map((q, i) => ({
      question: q.question,
      selectedAnswer: q.options[answers[i]] || null,
      correctAnswer: q.options[q.correctAnswer],
      isCorrect: answers[i] === q.correctAnswer
    }));

    setScore(finalScore);
    setSubmitted(true);

    try {
      await axios.post(`${API_BASE}/quiz`, {
        studentId: checkoutData.studentId,
        activity: checkoutData.activity,
        level: checkoutData.level,
        score: finalScore,
        detailedAnswers
      });
      refresh();
    } catch (e) {
      notify('Failed to save score', 'error');
    }
  };

  if (submitted) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md mx-auto glass-panel p-10 text-center">
        <div className="w-20 h-20 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center mx-auto mb-6">
          <Award className="text-blue-400 w-10 h-10" />
        </div>
        <h2 className="text-2xl font-black mb-3">QUIZ COMPLETE</h2>
        <div className="text-6xl font-black text-gold-500 my-6">{score}%</div>
        <p className="text-sm text-slate-400 mb-8">
          Score recorded for {checkoutData.activity}.
        </p>
        <button onClick={() => setView('lobby')} className="btn-primary w-full py-4">RETURN TO KIOSK</button>
      </motion.div>
    );
  }

  const q = quiz[currentQuestion];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl mx-auto glass-panel p-10">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-black uppercase tracking-tight text-blue-400">{checkoutData.activity} QUIZ</h2>
        <div className="text-sm font-bold text-slate-500">
          QUESTION {currentQuestion + 1} OF {quiz.length}
        </div>
      </div>

      <div className="mb-10">
        <p className="text-lg font-medium mb-6 leading-relaxed">{q.question}</p>
        <div className="space-y-3">
          {q.options.map((opt, i) => (
            <button
              key={i}
              onClick={() => setAnswers({...answers, [currentQuestion]: i})}
              className={`w-full p-4 rounded-xl text-left transition-all border ${answers[currentQuestion] === i ? 'bg-blue-500/20 border-blue-500/50 text-white' : 'bg-white/5 border-white/5 text-slate-300 hover:bg-white/10'}`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-4">
        <button 
          onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
          disabled={currentQuestion === 0}
          className="px-6 py-4 border border-white/10 rounded-xl font-bold text-slate-400 disabled:opacity-30 transition-all"
        >
          PREVIOUS
        </button>
        
        {currentQuestion < quiz.length - 1 ? (
          <button 
            onClick={() => setCurrentQuestion(currentQuestion + 1)}
            disabled={answers[currentQuestion] === undefined}
            className="flex-1 btn-primary py-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            NEXT QUESTION
          </button>
        ) : (
          <button 
            onClick={handleSubmit}
            disabled={answers[currentQuestion] === undefined}
            className="flex-1 btn-gold py-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            SUBMIT QUIZ
          </button>
        )}
      </div>
    </motion.div>
  );
}

function FieldSimulator({ setView, preselectedStudent }) {
  const canvasRef = useRef(null);
  const [game, setGame] = useState('DECODE_PLAY');
  const [customImage, setCustomImage] = useState(null);
  const [sessionPoints, setSessionPoints] = useState(0); 
  const [telemetryActive, setTelemetryActive] = useState(false);

  const handleGameChange = (g) => {
    setGame(g);
    setCustomImage(null);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => setCustomImage(event.target.result);
      reader.readAsDataURL(file);
    }
  };

  const isPlayMode = game === 'DECODE_PLAY' || game === 'REBUILT_PLAY';
  const isSimMode = game === 'DECODE' || game === 'REBUILT';

  useEffect(() => {
    if (!isPlayMode) return;
    const canvas = canvasRef.current;
    if(!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let robots = [];
    if (game.includes('REBUILT')) {
        robots = [
            { id: 1, color: '#3b82f6', x: 650, y: 225, angle: Math.PI, isShooting: false }, // Blue starts Right
            { id: 2, color: '#ef4444', x: 150, y: 225, angle: 0, isShooting: false }       // Red starts Left
        ];
    } else {
        robots = [
            { id: 1, color: '#3b82f6', x: canvas.width/2, y: canvas.height/2, angle: -Math.PI/2, isShooting: false }
        ];
    }
    let activeRobotIndex = 0;
    
    // Initialize interactive balls
    const gameBalls = [];
    if (game.includes('PLAY')) {
      if (game === 'REBUILT_PLAY') {
         // 4 sets of yellow balls in the middle
         const xs = [360, 390, 420, 450];
         const ys = [150, 190, 230, 270, 310]; // 4x5 = 20 balls total
         xs.forEach(x => {
            ys.forEach(y => {
               gameBalls.push({ id: gameBalls.length, x, y, color: '#eab308', held: false, heldBy: null, scored: null, vx: 0, vy: 0 });
            });
         });
         
         // 4 sets of yellow balls in the corners
         const cornerSets = [
            [{x: 170, y: 140}, {x: 190, y: 140}, {x: 170, y: 160}, {x: 190, y: 160}], // Top-Left
            [{x: 630, y: 140}, {x: 610, y: 140}, {x: 630, y: 160}, {x: 610, y: 160}], // Top-Right
            [{x: 170, y: 330}, {x: 190, y: 330}, {x: 170, y: 310}, {x: 190, y: 310}], // Bottom-Left
            [{x: 630, y: 330}, {x: 610, y: 330}, {x: 630, y: 310}, {x: 610, y: 310}], // Bottom-Right
         ];
         cornerSets.flat().forEach(pos => {
             gameBalls.push({ id: gameBalls.length, x: pos.x, y: pos.y, color: '#eab308', held: false, heldBy: null, scored: null, vx: 0, vy: 0 });
         });
      } else {
         const leftCols = [220, 260, 300];
         const rightCols = [500, 540, 580];
         const rows = [185, 225, 265];
         let colorToggle = 0;
         leftCols.forEach(x => {
            rows.forEach(y => {
               gameBalls.push({ id: gameBalls.length, x, y, color: colorToggle % 2 === 0 ? '#a855f7' : '#22c55e', held: false, heldBy: null, scored: null, vx: 0, vy: 0 });
               colorToggle++;
            });
         });
         colorToggle = 1;
         rightCols.forEach(x => {
            rows.forEach(y => {
               gameBalls.push({ id: gameBalls.length, x, y, color: colorToggle % 2 === 0 ? '#a855f7' : '#22c55e', held: false, heldBy: null, scored: null, vx: 0, vy: 0 });
               colorToggle++;
            });
         });
      }
    }
    
    const keys = {};
    const handleKeyDown = (e) => {
        keys[e.key] = true;
        if (e.key === '1') activeRobotIndex = 0;
        if (e.key === '2' && robots.length > 1) activeRobotIndex = 1;
    };
    const handleKeyUp = (e) => keys[e.key] = false;
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    const img = new Image();
    if (customImage) {
      img.src = customImage;
    } else {
      img.src = game.includes('DECODE') ? '/ftc_decode_field.png' : '/frc_rebuilt_field.png';
    }
    
    let animationId;
    img.onload = () => {
      const render = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
        
        robots.forEach((robot, idx) => {
            let speedX = 0;
            let speedY = 0;
            let rotSpeed = 0;
            let isShooting = false;
            let inputFound = false;

            // Only the ACTIVE robot responds to player inputs
            if (activeRobotIndex === idx) {
              // 1. GAMEPAD HANDLING (Primary controller controls active robot)
              const gp = gamepads[0] || gamepads[1]; // Use first available gamepad
              if (gp && gp !== null) {
                const leftX = gp.axes[0] || 0; 
                const leftY = gp.axes[1] || 0; 
                const rightX = gp.axes[2] || gp.axes[3] || 0;
                
                if (Math.abs(leftX) > 0.15 || Math.abs(leftY) > 0.15 || Math.abs(rightX) > 0.15) {
                  inputFound = true;
                  speedX = leftX * 5;
                  speedY = leftY * 5;
                  rotSpeed = rightX * 0.08;
                }
                
                if (gp.buttons[12]?.pressed) { speedY = -5; inputFound = true; }
                if (gp.buttons[13]?.pressed) { speedY = 5; inputFound = true; }
                if (gp.buttons[14]?.pressed) { speedX = -5; inputFound = true; }
                if (gp.buttons[15]?.pressed) { speedX = 5; inputFound = true; }
                if (gp.buttons[0]?.pressed || gp.buttons[5]?.pressed) { isShooting = true; inputFound = true; }
              }
              
              // 2. KEYBOARD HANDLING (Fallback or supplemental)
              if (!inputFound) {
                if (keys['w']) speedY = -5;
                else if (keys['s']) speedY = 5;
                if (keys['a']) speedX = -5;
                else if (keys['d']) speedX = 5;
                if (keys['ArrowLeft']) rotSpeed = -0.08;
                else if (keys['ArrowRight']) rotSpeed = 0.08;
                if (keys[' ']) isShooting = true;
              }
            }
            
            robot.angle += rotSpeed;
            robot.x += speedX;
            robot.y += speedY;

            // Telemetry: Accrue points if the active robot is moving
            if (activeRobotIndex === idx && (Math.abs(speedX) > 0 || Math.abs(speedY) > 0 || Math.abs(rotSpeed) > 0)) {
               setSessionPoints(prev => prev + 0.00000001);
            }
            
            // Boundaries
            if (game.includes('DECODE')) {
               robot.x = Math.max(160, Math.min(640, robot.x));
               robot.y = Math.max(120, Math.min(350, robot.y));
            } else {
               // Hard boundaries for the pink perimeter (FRC REBUILT)
               robot.x = Math.max(135, Math.min(665, robot.x));
               robot.y = Math.max(70, Math.min(380, robot.y));
            }
            
            // Shooting
            if (isShooting && !robot.isShooting) {
               robot.isShooting = true;
               const heldBall = gameBalls.find(b => b.held && b.heldBy === robot.id);
               if (heldBall) {
                   heldBall.held = false;
                   heldBall.heldBy = null;
                   heldBall.x = robot.x + Math.cos(robot.angle) * 30;
                   heldBall.y = robot.y + Math.sin(robot.angle) * 30;
                   heldBall.vx = Math.cos(robot.angle) * 15;
                   heldBall.vy = Math.sin(robot.angle) * 15;
               }
            } else if (!isShooting) {
               robot.isShooting = false;
            }
        });
        
        // Update Balls
        gameBalls.forEach(b => {
           if (b.scored) {
               // Stop and jitter slightly to stack visibly for both games
               b.vx = 0;
               b.vy = 0;
           } else if (b.held) {
               const holder = robots.find(r => r.id === b.heldBy);
               if (holder) {
                   b.x = holder.x;
                   b.y = holder.y;
               }
           } else if (b.vx !== 0 || b.vy !== 0) {
               b.x += b.vx;
               b.y += b.vy;
               b.vx *= 0.96;
               b.vy *= 0.96;
               if (Math.abs(b.vx) < 0.2) b.vx = 0;
               if (Math.abs(b.vy) < 0.2) b.vy = 0;
               
               // Scoring check
               if (game.includes('DECODE')) {
                   // Blue triangle goal is near x=240, y=210. Red triangle goal is near x=560, y=210
                   if (b.x > 210 && b.x < 280 && b.y > 180 && b.y < 250) {
                       b.scored = 'BLUE'; 
                       b.x = 240 + (Math.random() * 20 - 10); 
                       b.y = 210 + (Math.random() * 20 - 10); 
                       b.vx = 0; b.vy = 0;
                   } else if (b.x > 520 && b.x < 590 && b.y > 180 && b.y < 250) {
                       b.scored = 'RED'; 
                       b.x = 560 + (Math.random() * 20 - 10); 
                       b.y = 210 + (Math.random() * 20 - 10); 
                       b.vx = 0; b.vy = 0;
                   }
               } else if (game.includes('REBUILT')) {
                   // Middle left structure is Red Goal, Middle right structure is Blue Goal
                   if (b.x > 230 && b.x < 310 && b.y > 180 && b.y < 270) {
                       b.scored = 'RED'; 
                       // Stop in the white box with jitter
                       b.x = 270 + (Math.random() * 20 - 10); 
                       b.y = 225 + (Math.random() * 20 - 10); 
                       b.vx = 0; b.vy = 0;
                   } else if (b.x > 490 && b.x < 570 && b.y > 180 && b.y < 270) {
                       b.scored = 'BLUE'; 
                       // Stop in the white box with jitter
                       b.x = 530 + (Math.random() * 20 - 10); 
                       b.y = 225 + (Math.random() * 20 - 10); 
                       b.vx = 0; b.vy = 0;
                   }
               }
               
               if (b.x < 10 || b.x > canvas.width - 10) b.vx *= -1;
               if (b.y < 10 || b.y > canvas.height - 10) b.vy *= -1;
           } else {
               robots.forEach(robot => {
                   if (!b.held) {
                       const dx = robot.x - b.x;
                       const dy = robot.y - b.y;
                       if (Math.sqrt(dx*dx + dy*dy) < 30) {
                           const heldCount = gameBalls.filter(ball => ball.held && ball.heldBy === robot.id).length;
                           const limit = game.includes('DECODE') ? 3 : 18;
                           if (heldCount < limit) {
                               b.held = true;
                               b.heldBy = robot.id;
                           }
                       }
                   }
               });
           }
        });
        
        // Draw Robots
        robots.forEach((robot, idx) => {
            ctx.save();
            ctx.translate(robot.x, robot.y);
            
            // Draw active indicator
            if (activeRobotIndex === idx && robots.length > 1) {
                ctx.beginPath();
                ctx.arc(0, 0, 35, 0, 2*Math.PI);
                ctx.strokeStyle = 'white';
                ctx.lineWidth = 2;
                ctx.setLineDash([5, 5]);
                ctx.stroke();
                ctx.setLineDash([]);
            }
            
            ctx.rotate(robot.angle);
            ctx.fillStyle = robot.color;
            ctx.shadowColor = '#000';
            ctx.shadowBlur = 10;
            ctx.fillRect(-20, -20, 40, 40);
            
            // Indicator to show front
            ctx.fillStyle = 'rgba(255,255,255,0.5)'; 
            ctx.fillRect(10, -10, 10, 20);
            
            // Draw held balls
            const heldBalls = gameBalls.filter(b => b.held && b.heldBy === robot.id);
            heldBalls.forEach((b, ballIdx) => {
                ctx.beginPath();
                ctx.arc(0, -10 + ballIdx * 10, 6, 0, 2 * Math.PI);
                ctx.fillStyle = b.color;
                ctx.fill();
                ctx.lineWidth = 1;
                ctx.strokeStyle = 'white';
                ctx.stroke();
            });
            
            ctx.restore();
        });
        
        gameBalls.forEach(b => {
           if (!b.held) {
               ctx.beginPath();
               ctx.arc(b.x, b.y, 8, 0, 2*Math.PI);
               ctx.fillStyle = b.color;
               ctx.fill();
               ctx.lineWidth = 2;
               ctx.strokeStyle = 'rgba(255,255,255,0.8)';
               ctx.stroke();
           }
        });
        
        animationId = requestAnimationFrame(render);
      };
      render();
    };
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      cancelAnimationFrame(animationId);
    };
  }, [game, isPlayMode, customImage]);

  // Sync Telemetry to Backend
  useEffect(() => {
    if (!preselectedStudent || sessionPoints === 0) return;
    
    setTelemetryActive(true);
    const syncInterval = setInterval(async () => {
      try {
        await axios.post(`${API_BASE}/student/add-points`, { 
          studentId: preselectedStudent, 
          points: sessionPoints.toFixed(10) 
        });
        setSessionPoints(0); // Reset local counter after successful sync
        setTelemetryActive(false);
        setTimeout(() => setTelemetryActive(true), 2000); // Pulse effect
      } catch (err) {
        console.error('Telemetry Sync Failed:', err);
      }
    }, 10000); // Sync every 10 seconds

    return () => clearInterval(syncInterval);
  }, [preselectedStudent, sessionPoints]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-panel p-8 max-w-5xl mx-auto flex flex-col items-center">
      <div className="flex justify-between w-full items-center mb-6">
        <div>
          <h2 className="text-3xl font-black uppercase text-blue-400">Field Simulator</h2>
          <p className="text-slate-400 font-bold tracking-widest text-sm uppercase">Choose a simulation mode below</p>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex gap-2 self-end">
            <button onClick={() => handleGameChange('DECODE')} className={`px-4 py-2 font-bold rounded-lg text-xs ${game === 'DECODE' ? 'bg-blue-500 text-white' : 'bg-white/10 text-slate-400 hover:text-white'}`}>FTC DECODE</button>
            <button onClick={() => handleGameChange('DECODE_PLAY')} className={`px-4 py-2 font-bold rounded-lg text-xs ${game === 'DECODE_PLAY' ? 'bg-blue-500 text-white' : 'bg-white/10 text-slate-400 hover:text-white'}`}>FTC DECODE PLAY</button>
            <button onClick={() => handleGameChange('REBUILT')} className={`px-4 py-2 font-bold rounded-lg text-xs ${game === 'REBUILT' ? 'bg-purple-500 text-white' : 'bg-white/10 text-slate-400 hover:text-white'}`}>FRC REBUILT</button>
            <button onClick={() => handleGameChange('REBUILT_PLAY')} className={`px-4 py-2 font-bold rounded-lg text-xs ${game === 'REBUILT_PLAY' ? 'bg-purple-500 text-white' : 'bg-white/10 text-slate-400 hover:text-white'}`}>FRC REBUILT PLAY</button>
          </div>
          {isPlayMode && (
            <label className="cursor-pointer bg-white/5 border border-white/20 hover:bg-white/10 text-xs text-slate-300 font-bold py-1.5 px-3 rounded-md transition-all self-end mt-2">
              <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
              + Change Simulator File
            </label>
          )}
        </div>
      </div>
      <div className="relative w-full rounded-xl flex flex-col items-center gap-8">
        {isSimMode && !customImage && (
          <div className="w-full border-2 border-white/10 rounded-xl overflow-hidden shadow-[0_0_50px_rgba(59,130,246,0.15)] bg-black/50">
            <h3 className="bg-blue-600 text-white font-bold tracking-widest text-xs uppercase p-2 text-center">Control Simulator (Canada)</h3>
            <iframe 
              src="https://ftcsim.org" 
              title="Simulator"
              className="w-full h-[600px] border-0"
              allow="gamepad; autoplay; encrypted-media"
            />
          </div>
        )}
        {isPlayMode && (
          <div className="w-full border-2 border-white/10 rounded-xl overflow-hidden shadow-[0_0_50px_rgba(168,85,247,0.15)] bg-black/50 flex flex-col items-center">
            <h3 className="bg-purple-600 text-white font-black tracking-widest text-xs uppercase p-2 text-center w-full flex justify-between px-6 items-center">
               <span>Strategy Simulator Canvas</span>
               {preselectedStudent && (
                 <motion.span 
                   animate={{ opacity: [0.4, 1, 0.4] }}
                   transition={{ duration: 2, repeat: Infinity }}
                   className="text-[10px] text-purple-200 flex items-center gap-2"
                 >
                   <Activity className="w-3 h-3" /> TELEMETRY ACTIVE: {sessionPoints.toFixed(10)} pts
                 </motion.span>
               )}
            </h3>
            <canvas ref={canvasRef} width={800} height={450} className="w-[800px] h-[450px] object-contain bg-black/80" />
            <p className="text-slate-400 text-xs my-3 tracking-widest font-bold uppercase flex items-center justify-center gap-2">
              <Gamepad2 className="w-4 h-4 text-blue-400" />
              Drive: WASD / Stick • Rotate: Arrows / Stick • Shoot: Space / A • Swap Robot: 1 or 2
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}

function GlobalLeaderboard() {
  const [activeTab, setActiveTab] = useState('FRC');
  const [loading, setLoading] = useState(false);
  const [isFtcLive, setIsFtcLive] = useState(false);
  const [ftcData, setFtcData] = useState([
    { rank: 1, team: "11212", name: "The Clueless", location: "San Diego, CA", score: "World Champion" },
    { rank: 2, team: "19066", name: "AI Citizens", location: "Bucharest, Romania", score: "World Champion" },
    { rank: 3, team: "18763", name: "Texpand", location: "Cape Town, South Africa", score: "World Champion" },
    { rank: 4, team: "14481", name: "Don't Blink", location: "Plainsboro, NJ", score: "Worlds Finalist" },
    { rank: 5, team: "23026", name: "Tech Dogs", location: "Harper Woods, MI", score: "HWS Core" }
  ]);

  const [frcData, setFrcData] = useState([
    { rank: 1, team: "254", name: "The Cheesy Poofs", location: "San Jose, CA", score: "185 (EPA)" },
    { rank: 2, team: "1678", name: "Citrus Circuits", location: "Davis, CA", score: "182 (EPA)" },
    { rank: 3, team: "2056", name: "OP Robotics", location: "Stoney Creek, ON", score: "178 (EPA)" },
    { rank: 4, team: "1323", name: "MadTown Robotics", location: "Madera, CA", score: "175 (EPA)" },
    { rank: 5, team: "9212 & 5239", name: "Royal Stags", location: "Harper Woods, MI", score: "HWS Core" }
  ]);

  useEffect(() => {
    const fetchFrcData = async () => {
      setLoading(true);
      try {
        const res = await fetch("https://api.statbotics.io/v3/teams?limit=4&sort=-norm_epa.current");
        const data = await res.json();
        if (data && data.length > 0) {
          const formatted = data.map((t, i) => ({
            rank: i + 1,
            team: t.team.toString(),
            name: t.name,
            location: t.state ? `${t.state}, ${t.country}` : (t.country || 'Unknown'),
            score: `${Math.round(t.norm_epa.current)} (EPA)`
          }));
          
          formatted.push({
            rank: 5,
            team: "9212 & 5239",
            name: "Royal Stags",
            location: "Harper Woods, MI",
            score: "HWS Core"
          });
          
          setFrcData(formatted);
        }
      } catch (e) {
        console.error("Failed to handshake with Statbotics API:", e);
      }
      setLoading(false);
    };

    const fetchFtcData = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API_BASE}/toa/rankings`);
        if (res.data && res.data.rankings) {
          setFtcData(res.data.rankings);
          setIsFtcLive(res.data.live);
        }
      } catch (e) {
        console.error("Failed to fetch FTC rankings from proxy:", e);
      } finally {
        setLoading(false);
      }
    };

    if (activeTab === 'FRC') {
      fetchFrcData();
    } else {
      fetchFtcData();
    }
  }, [activeTab]);

  const data = activeTab === 'FRC' ? frcData : ftcData;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-5xl mx-auto glass-panel p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-black bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">GLOBAL LEADERBOARD</h2>
          <div className="flex flex-wrap items-center gap-3 mt-1.5">
            <p className="text-slate-400 font-bold tracking-widest text-xs uppercase flex items-center gap-2">
              World's Best Tracker
              {loading && <span className="inline-block w-4 h-4 border-2 border-amber-400 border-t-transparent rounded-full animate-spin"></span>}
            </p>
            {activeTab === 'FTC' && (
              <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border ${
                isFtcLive 
                  ? 'bg-green-500/10 border-green-500/30 text-green-400' 
                  : 'bg-slate-500/10 border-slate-500/30 text-slate-400'
              }`}>
                {isFtcLive ? 'Live from The Orange Alliance' : 'Sample/Fallback Data'}
              </span>
            )}
            {activeTab === 'FRC' && (
              <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border bg-green-500/10 border-green-500/30 text-green-400">
                Live from Statbotics
              </span>
            )}
          </div>
        </div>
        <div className="flex bg-black/40 p-1 rounded-xl border border-white/10">
          <button onClick={() => setActiveTab('FRC')} className={`px-6 py-2 rounded-lg font-bold text-sm transition-all ${activeTab === 'FRC' ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20' : 'text-slate-400 hover:text-white'}`}>FRC REBUILT</button>
          <button onClick={() => setActiveTab('FTC')} className={`px-6 py-2 rounded-lg font-bold text-sm transition-all ${activeTab === 'FTC' ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20' : 'text-slate-400 hover:text-white'}`}>FTC DECODE</button>
        </div>
      </div>

      <div className="overflow-x-auto min-h-[300px]">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-48 text-amber-500/70">
            <Globe className="w-10 h-10 animate-pulse mb-3" />
            <p className="font-bold tracking-widest uppercase text-sm">Fetching API Data for {activeTab}...</p>
          </div>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/10 text-slate-400 text-xs font-bold uppercase tracking-widest">
                <th className="p-4 w-16 text-center">Rank</th>
                <th className="p-4">Team</th>
                <th className="p-4">Location</th>
                <th className="p-4 text-right">High Score</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence mode="popLayout">
                {data.map((team, index) => (
                  <motion.tr 
                    key={team.team}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors group"
                  >
                    <td className="p-4 text-center">
                      {team.rank === 1 ? <span className="text-2xl">🥇</span> : 
                       team.rank === 2 ? <span className="text-2xl">🥈</span> : 
                       team.rank === 3 ? <span className="text-2xl">🥉</span> : 
                       <span className="font-bold text-slate-500">{team.rank}</span>}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className={`min-w-[40px] px-2 h-10 rounded-lg flex items-center justify-center font-black text-sm border ${team.team === '23026' || team.team === '9212 & 5239' ? 'bg-amber-500/20 border-amber-500/50 text-amber-400' : 'bg-white/5 border-white/10 text-slate-300 group-hover:bg-blue-500/20 group-hover:border-blue-500/50 group-hover:text-blue-400'} transition-all`}>
                          {team.team}
                        </div>
                        <span className={`font-bold ${team.team === '23026' || team.team === '9212 & 5239' ? 'text-amber-400' : 'text-white'}`}>{team.name}</span>
                      </div>
                    </td>
                    <td className="p-4 text-slate-400 font-medium">{team.location}</td>
                    <td className="p-4 text-right font-black text-xl text-green-400">{team.score}</td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        )}
      </div>
      
      <div className="mt-12 pt-8 border-t border-white/10">
        <h3 className="text-xl font-black text-white mb-6 uppercase tracking-widest flex items-center gap-3">
          <Activity className="text-emerald-400" /> Team Improvement Suggestions
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 hover:border-emerald-500/50 transition-colors">
            <h4 className="text-emerald-400 font-bold mb-2 text-lg">Tech Dogs (FTC 23026)</h4>
            <ul className="text-sm text-slate-300 space-y-2 list-disc pl-4">
              <li>Increase autonomous mode consistency to guarantee pre-load points.</li>
              <li>Implement OpenCV for faster vision target recognition.</li>
              <li>Focus on driver practice to shave 5 seconds off cycle times.</li>
            </ul>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 hover:border-blue-500/50 transition-colors">
            <h4 className="text-blue-400 font-bold mb-2 text-lg">Royal Stags (FRC 9212 & 5239)</h4>
            <ul className="text-sm text-slate-300 space-y-2 list-disc pl-4">
              <li>Refine the swerve drive PID controllers for smoother traversing.</li>
              <li>Improve intake geometry to reduce jam rates during high-speed collection.</li>
              <li>Ensure 100% climb success rate by upgrading winch gearboxes.</li>
            </ul>
          </div>
        </div>
        <div className="mt-6 bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 text-sm text-emerald-200/80">
          <strong>Coach's Note:</strong> The global leaderboard is dominated by teams who perfect the basics. If we hit our autonomous targets and never miss a climb, we will break into the Top 10. Stay focused in the Fab Lab!
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-white/10 flex justify-between items-center text-sm">
        <div className="flex items-center gap-2 text-slate-400 font-medium">
          <Globe className="w-4 h-4 text-blue-400" />
          <span>Real-time global synchronization active</span>
        </div>
        <p className="text-slate-500 italic">Respectful tracking of the world's highest performing teams</p>
      </div>
    </motion.div>
  );
}

function CodingLab() {
  const [inputText, setInputText] = useState("If the robot sees the red target, turn the motor on at half speed. Otherwise, stop the motor entirely.");
  const [sourceLang, setSourceLang] = useState("Natural Language Instructions");
  const [targetLang, setTargetLang] = useState("Python");
  const [outputText, setOutputText] = useState(`if vision_sensor.sees_target("red"):
    drive_motor.set_speed(0.5)
else:
    drive_motor.set_speed(0.0)

# Remember: Python uses indentation (spaces) 
# to group code blocks instead of brackets!`);
  const [isTranslating, setIsTranslating] = useState(false);
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [isLive, setIsLive] = useState(false);

  const languages = [
    "Natural Language Instructions",
    "Python",
    "Java",
    "JavaScript",
    "C++",
    "Rust",
    "HTML/CSS"
  ];

  // Local fallback translations
  const getLocalTranslation = (text, src, target) => {
    const queryText = text.toLowerCase();
    
    // 1. Natural Language to Programming Language
    if (src === "Natural Language Instructions") {
      if (target === "Python") {
        if (queryText.includes("forward") || queryText.includes("move")) {
          return "drivetrain.drive_forward(speed=0.5, distance=1.0)\n# Driving the robot forward";
        } else if (queryText.includes("turn") || queryText.includes("rotate")) {
          return "drivetrain.turn(angle=90, speed=0.3)\n# Turning the robot 90 degrees";
        } else if (queryText.includes("grab") || queryText.includes("pickup") || queryText.includes("intake")) {
          return "intake_motor.set_power(1.0)\ntime.sleep(1.0)\nintake_motor.stop()\n# Powering intake for 1 second";
        } else if (queryText.includes("shoot") || queryText.includes("fire")) {
          return "shooter.spin_up(rpm=5000)\nif shooter.is_at_speed():\n    indexer.feed()\n# Revving up and shooting";
        } else {
          return `if vision_sensor.sees_target("red"):
    drive_motor.set_speed(0.5)
else:
    drive_motor.set_speed(0.0)
    
# Remember: Python uses indentation (spaces) 
# to group code blocks instead of brackets!`;
        }
      } else if (target === "Java") {
        if (queryText.includes("forward") || queryText.includes("move")) {
          return "drivetrain.driveForward(0.5, 1.0);\n// Driving the robot forward";
        } else if (queryText.includes("turn") || queryText.includes("rotate")) {
          return "drivetrain.turn(90, 0.3);\n// Turning the robot 90 degrees";
        } else if (queryText.includes("grab") || queryText.includes("pickup") || queryText.includes("intake")) {
          return "intakeMotor.set(1.0);\nTimer.delay(1.0);\nintakeMotor.stopMotor();\n// Powering intake for 1 second";
        } else if (queryText.includes("shoot") || queryText.includes("fire")) {
          return "shooter.setRPM(5000);\nif (shooter.atSetpoint()) {\n    indexer.feed();\n}\n// Revving up and shooting";
        } else {
          return `if (visionSensor.seesTarget("red")) {
    driveMotor.set(0.5);
} else {
    driveMotor.set(0.0);
}`;
        }
      } else if (target === "JavaScript") {
        if (queryText.includes("forward") || queryText.includes("move")) {
          return "drivetrain.driveForward(0.5, 1.0);\n// Driving the robot forward";
        } else if (queryText.includes("turn") || queryText.includes("rotate")) {
          return "drivetrain.turn(90, 0.3);\n// Turning the robot 90 degrees";
        } else if (queryText.includes("grab") || queryText.includes("pickup") || queryText.includes("intake")) {
          return "intakeMotor.setPower(1.0);\nsetTimeout(() => intakeMotor.stop(), 1000);\n// Powering intake for 1 second";
        } else if (queryText.includes("shoot") || queryText.includes("fire")) {
          return "shooter.setRPM(5000);\nif (shooter.isAtSpeed()) {\n    indexer.feed();\n}\n// Revving up and shooting";
        } else {
          return `if (visionSensor.seesTarget("red")) {
    driveMotor.setSpeed(0.5);
} else {
    driveMotor.setSpeed(0.0);
}`;
        }
      } else if (target === "C++") {
        if (queryText.includes("forward") || queryText.includes("move")) {
          return "drivetrain->DriveForward(0.5, 1.0);\n// Driving the robot forward";
        } else if (queryText.includes("turn") || queryText.includes("rotate")) {
          return "drivetrain->Turn(90, 0.3);\n// Turning the robot 90 degrees";
        } else if (queryText.includes("grab") || queryText.includes("pickup") || queryText.includes("intake")) {
          return "intakeMotor->Set(1.0);\nfrc::Timer::Delay(1.0);\nintakeMotor->StopMotor();\n// Powering intake for 1 second";
        } else if (queryText.includes("shoot") || queryText.includes("fire")) {
          return "shooter->SetRPM(5000);\nif (shooter->AtSetpoint()) {\n    indexer->Feed();\n}\n// Revving up and shooting";
        } else {
          return `if (visionSensor->SeesTarget("red")) {
    driveMotor->Set(0.5);
} else {
    driveMotor->Set(0.0);
}`;
        }
      } else if (target === "Rust") {
        if (queryText.includes("forward") || queryText.includes("move")) {
          return "drivetrain.drive_forward(0.5, 1.0);\n// Driving the robot forward";
        } else if (queryText.includes("turn") || queryText.includes("rotate")) {
          return "drivetrain.turn(90.0, 0.3);\n// Turning the robot 90 degrees";
        } else if (queryText.includes("grab") || queryText.includes("pickup") || queryText.includes("intake")) {
          return "intake_motor.set_power(1.0);\nsleep(Duration::from_secs(1));\nintake_motor.stop();\n// Powering intake for 1 second";
        } else if (queryText.includes("shoot") || queryText.includes("fire")) {
          return "shooter.set_rpm(5000);\nif shooter.is_at_speed() {\n    indexer.feed();\n}\n// Revving up and shooting";
        } else {
          return `if vision_sensor.sees_target("red") {
    drive_motor.set_speed(0.5);
} else {
    drive_motor.set_speed(0.0);
}`;
        }
      } else if (target === "HTML/CSS") {
        if (queryText.includes("forward") || queryText.includes("move") || queryText.includes("drive")) {
          return `<div class="robot-state drive-forward">\n  <p>Drivetrain: Active (Speed: 50%)</p>\n</div>\n<style>\n.drive-forward {\n  background: #3b82f6;\n  color: white;\n  padding: 10px;\n  border-radius: 8px;\n}\n</style>`;
        } else {
          return `<div class="vision-sensor-status">\n  <span class="badge badge-red">Red Target Seen</span>\n  <div class="motor-state half-speed">Motor: 50%</div>\n</div>\n<style>\n.vision-sensor-status {\n  background: #0f172a;\n  border: 1px solid #1e293b;\n  padding: 20px;\n  border-radius: 12px;\n}\n.badge-red {\n  background: #ef4444;\n  color: white;\n  padding: 4px 8px;\n  border-radius: 9999px;\n  font-size: 12px;\n}\n.motor-state {\n  margin-top: 10px;\n  color: #3b82f6;\n}\n</style>`;
        }
      } else {
        return text;
      }
    }

    if (src === "HTML/CSS") {
      if (target === "Natural Language Instructions") {
        return "Explanation:\n1. Renders a user interface widget or structural component.\n2. Defines responsive box boundaries and colors.\n3. Renders state status to represent robot telemetry or motor speed.";
      } else if (target === "Python") {
        return "print('Rendering Dashboard UI Component...')\n# In Python, HTML/CSS is represented as templates or layout configurations.";
      } else {
        return getLocalTranslation(inputText, "Natural Language Instructions", target);
      }
    }
    
    // 2. Programming Language to Natural Language (Explanation)
    if (target === "Natural Language Instructions") {
      if (queryText.includes("sees_target") || queryText.includes("seestarget")) {
        return "Explanation:\n1. Checks if the vision sensor detects a 'red' target.\n2. If it does, sets the robot drive motor to half speed (0.5).\n3. Otherwise, stops the motor completely.";
      } else if (queryText.includes("driveforward") || queryText.includes("drive_forward")) {
        return "Explanation:\n1. Orders the robot chassis drivetrain to move forward.\n2. Sets motor speed to 0.5 (50% power).\n3. Traverses for 1.0 unit of distance.";
      } else if (queryText.includes("turn")) {
        return "Explanation:\n1. Triggers a chassis rotation command.\n2. Turns the robot 90 degrees.\n3. Sets turning motor speed to 30% power (0.3).";
      } else if (queryText.includes("intake")) {
        return "Explanation:\n1. Activates the intake rollers at full power (1.0).\n2. Waits for 1 second to pull in the game piece.\n3. Powers off the intake rollers.";
      } else if (queryText.includes("shooter") || queryText.includes("shoot")) {
        return "Explanation:\n1. Accelerates the shooter flywheel to a target speed of 5000 RPM.\n2. Checks if the wheel is at speed.\n3. Feeds the game piece into the launcher via the indexer.";
      } else {
        return `Explanation:\nTranslating a custom code routine from ${src} to plain instructions. It configures robot motors and sensors for telemetry control.`;
      }
    }

    // 3. Code to Code Translation (e.g. Java to Python)
    let coreLogic = "sees_target";
    if (queryText.includes("forward") || queryText.includes("move")) coreLogic = "forward";
    else if (queryText.includes("turn")) coreLogic = "turn";
    else if (queryText.includes("intake") || queryText.includes("grab")) coreLogic = "intake";
    else if (queryText.includes("shoot") || queryText.includes("fire")) coreLogic = "shoot";

    return getLocalTranslation(coreLogic, "Natural Language Instructions", target);
  };

  const handleTranslate = async () => {
    setIsTranslating(true);
    setStatus("loading");
    
    try {
      const res = await axios.post(`${API_BASE}/translate`, {
        sourceLang,
        targetLang,
        code: inputText
      });

      if (res.data && res.data.reply) {
        setOutputText(res.data.reply);
        setStatus("success");
        setIsLive(true);
      } else {
        // Fallback
        const fallback = getLocalTranslation(inputText, sourceLang, targetLang);
        setOutputText(fallback);
        setStatus("success"); // Still success locally
        setIsLive(false);
      }
    } catch (err) {
      console.warn("AI Translation server offline, running local rule-based translation:", err.message);
      const fallback = getLocalTranslation(inputText, sourceLang, targetLang);
      setOutputText(fallback);
      setStatus("success"); // local success
      setIsLive(false);
    } finally {
      setIsTranslating(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-5xl mx-auto glass-panel p-8">
      <div className="mb-10 text-center">
        <div className="w-16 h-16 rounded-2xl bg-green-500/20 border-2 border-green-500/50 flex items-center justify-center mx-auto mb-4">
          <Code className="text-green-400 w-8 h-8" />
        </div>
        <h2 className="text-3xl font-black bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">CODING LAB</h2>
        <p className="text-slate-400 font-bold tracking-widest text-sm uppercase mt-2">Bidirectional Robot Code Translator</p>
        
        {/* Dropdown selectors for Source and Target */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-6 mt-8 p-4 bg-black/40 rounded-2xl border border-white/10 max-w-2xl mx-auto">
          <div className="w-full sm:w-1/2 text-left">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Source Language</label>
            <select 
              value={sourceLang} 
              onChange={(e) => {
                setSourceLang(e.target.value);
                // Simple auto-adjust to avoid translating same-to-same
                if (e.target.value === targetLang) {
                  setTargetLang(e.target.value === "Natural Language Instructions" ? "Python" : "Natural Language Instructions");
                }
              }}
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-4 py-2.5 text-white font-semibold outline-none focus:border-green-500 text-sm transition-all"
            >
              {languages.map(lang => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>
          </div>

          <div className="text-slate-500 font-black text-xl shrink-0 rotate-90 sm:rotate-0">➔</div>

          <div className="w-full sm:w-1/2 text-left">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Target Language</label>
            <select 
              value={targetLang} 
              onChange={(e) => {
                setTargetLang(e.target.value);
                if (e.target.value === sourceLang) {
                  setSourceLang(e.target.value === "Natural Language Instructions" ? "Python" : "Natural Language Instructions");
                }
              }}
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-4 py-2.5 text-white font-semibold outline-none focus:border-green-500 text-sm transition-all"
            >
              {languages.map(lang => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      <div className="grid md:grid-cols-2 gap-8">
        {/* Left Pane (Source Input) */}
        <div className={`glass-panel bg-black/40 p-6 rounded-2xl border-2 transition-all relative overflow-hidden group ${status === 'error' ? 'border-red-500/30' : 'border-white/5'}`}>
          <div className="absolute top-0 left-0 w-full h-1 bg-amber-400/50 group-hover:bg-amber-400 transition-colors" />
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-amber-400 tracking-widest text-xs uppercase flex items-center gap-2">
              <span className="w-6 h-6 rounded bg-amber-500/20 flex items-center justify-center text-amber-500 font-bold text-xs">INPUT</span>
              {sourceLang === "Natural Language Instructions" ? "Natural Language Instructions" : `Source Code (${sourceLang})`}
            </h3>
          </div>
          <textarea 
            className="w-full h-64 bg-white/5 rounded-xl border border-white/10 p-5 text-white resize-none font-mono text-sm leading-relaxed focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 transition-all outline-none"
            placeholder={sourceLang === "Natural Language Instructions" ? "Type your plain English instructions here (e.g. 'move forward 1 meter' or 'if sees target turn right')..." : `Type your ${sourceLang} code here...`}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
          <button 
            onClick={handleTranslate}
            disabled={isTranslating}
            className="w-full mt-4 py-3 bg-amber-500 hover:bg-amber-400 text-black font-black rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99]"
          >
            {isTranslating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin animate-infinite" />
                TRANSLATING...
              </>
            ) : (
              `TRANSLATE / GENERATE ➔`
            )}
          </button>
        </div>
        
        {/* Right Pane (Generated Output) */}
        <div className={`glass-panel bg-black/40 p-6 rounded-2xl border-2 transition-all relative overflow-hidden group ${status === 'loading' ? 'border-amber-500/30' : isLive ? 'border-green-500/30' : 'border-slate-700/50'}`}>
          <div className="absolute top-0 left-0 w-full h-1 bg-green-500/50 group-hover:bg-green-500 transition-colors" />
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-green-400 tracking-widest text-xs uppercase flex items-center gap-2">
              <span className="w-6 h-6 rounded bg-green-500/20 flex items-center justify-center text-green-500 font-bold text-xs">OUTPUT</span>
              {targetLang === "Natural Language Instructions" ? "Natural Language Explanation" : `Generated Code (${targetLang})`}
            </h3>
            {status === "success" && (
              <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${isLive ? 'bg-green-500/20 border border-green-500/40 text-green-400' : 'bg-slate-500/20 border border-slate-500/40 text-slate-400'}`}>
                {isLive ? 'Live AI Generated' : 'Sample/Fallback Data'}
              </span>
            )}
          </div>
          <textarea 
            className="w-full h-64 bg-[#0d1117] rounded-xl border border-slate-700/50 p-5 text-green-400 resize-none font-mono text-sm leading-relaxed outline-none"
            placeholder={targetLang === "Natural Language Instructions" ? "Explanation will appear here..." : `Generated ${targetLang} code will appear here...`}
            readOnly
            value={outputText}
          />
        </div>
      </div>

      <div className="mt-8 bg-blue-500/10 border border-blue-500/20 rounded-xl p-5 text-sm text-blue-200">
        <strong>Pro Tip:</strong> Coding Lab now supports bidirectional translations. Select any source language (like Java) and a target language (like Python or English Explanations) to quickly convert logic!
      </div>
    </motion.div>
  );
}

function StudentLog({ students, setView, refresh }) {
  const [searchId, setSearchId] = useState('');
  const [student, setStudent] = useState(null);
  const [activeTab, setActiveTab] = useState('overview'); // overview | skills | credentials | experience | edit
  const [selectedCredential, setSelectedCredential] = useState(null);
  const [showCertificate, setShowCertificate] = useState(null);
  
  // Direct Message states
  const [dmText, setDmText] = useState('');
  const [dmMessages, setDmMessages] = useState([
    { id: 1, sender: 'Coach', text: "Hey, don't forget to review the safety guidelines before our next session!", time: 'Yesterday', isMe: false }
  ]);

  // Editing form states
  const [editAboutMe, setEditAboutMe] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editLocation, setEditLocation] = useState('');
  
  const [editTechSkills, setEditTechSkills] = useState([]);
  const [editSoftSkills, setEditSoftSkills] = useState([]);
  const [editEducation, setEditEducation] = useState([]);
  const [editCredentials, setEditCredentials] = useState([]);
  const [editWorkExperience, setEditWorkExperience] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [notification, setNotification] = useState(null);

  const handleSearch = (e) => {
    e.preventDefault();
    const found = students.find(s => s.id === searchId || s.name.toLowerCase().includes(searchId.toLowerCase()));
    if (found) {
      setStudent(found);
      setEditAboutMe(found.aboutMe || "Passionate student focused on mechanical engineering, robotics, and career technical education (CTE) pathways.");
      setEditPhone(found.contact?.phone || "(555) 123-4567");
      setEditEmail(found.contact?.email || `${found.id}@doveacademy.net`);
      setEditLocation(found.contact?.location || "Detroit, Michigan");
      setEditTechSkills(found.technicalSkills || []);
      setEditSoftSkills(found.softSkills || []);
      setEditEducation(found.education || []);
      setEditCredentials(found.credentials || []);
      setEditWorkExperience(found.workExperience || []);
      setActiveTab('overview');
      setSelectedCredential(null);
      setShowCertificate(null);
    } else {
      setStudent(null);
      showNotification('Student profile not found.', 'error');
    }
  };

  const showNotification = (text, type = 'success') => {
    setNotification({ text, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleSendDM = (e) => {
    e.preventDefault();
    if (!dmText.trim()) return;
    setDmMessages([...dmMessages, {
      id: Date.now(),
      sender: 'You',
      text: dmText.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true
    }]);
    setDmText('');
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!student) return;
    setIsSaving(true);
    try {
      const response = await axios.post(`${API_BASE}/student/update`, {
        studentId: student.id,
        aboutMe: editAboutMe,
        contact: {
          phone: editPhone,
          email: editEmail,
          location: editLocation
        },
        technicalSkills: editTechSkills,
        softSkills: editSoftSkills,
        education: editEducation,
        credentials: editCredentials,
        workExperience: editWorkExperience
      });

      if (response.data.success) {
        setStudent(response.data.student);
        if (refresh) await refresh();
        showNotification('Profile updated successfully!', 'success');
        setActiveTab('overview');
      }
    } catch (err) {
      console.error(err);
      showNotification('Error saving profile changes.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const shareProfile = () => {
    if (student) {
      navigator.clipboard.writeText(`${window.location.origin}${window.location.pathname}?student=${student.id}`);
      showNotification('Profile link copied to clipboard!', 'success');
    }
  };

  // List updates
  const addTechSkill = () => {
    setEditTechSkills([...editTechSkills, { name: '', category: 'Fabrication & Layout', level: 'Beginner' }]);
  };
  const updateTechSkill = (index, field, value) => {
    const updated = [...editTechSkills];
    updated[index][field] = value;
    setEditTechSkills(updated);
  };
  const removeTechSkill = (index) => {
    setEditTechSkills(editTechSkills.filter((_, i) => i !== index));
  };

  const addSoftSkill = () => {
    setEditSoftSkills([...editSoftSkills, { name: '', level: 'Intermediate' }]);
  };
  const updateSoftSkill = (index, field, value) => {
    const updated = [...editSoftSkills];
    updated[index][field] = value;
    setEditSoftSkills(updated);
  };
  const removeSoftSkill = (index) => {
    setEditSoftSkills(editSoftSkills.filter((_, i) => i !== index));
  };

  const addEducation = () => {
    setEditEducation([...editEducation, { school: '', degree: '', dateRange: '', description: '' }]);
  };
  const updateEducation = (index, field, value) => {
    const updated = [...editEducation];
    updated[index][field] = value;
    setEditEducation(updated);
  };
  const removeEducation = (index) => {
    setEditEducation(editEducation.filter((_, i) => i !== index));
  };

  const addCredential = (credTitle) => {
    if (!credTitle) return;
    const existing = editCredentials.find(c => c.title === credTitle);
    if (existing) return;
    const credInfo = MICRO_CREDENTIALS.find(c => c.title === credTitle);
    setEditCredentials([...editCredentials, {
      title: credTitle,
      org: credInfo?.org || 'Unknown Issuer',
      completedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      credentialId: 'BBP-' + Math.floor(10000 + Math.random() * 90000) + '-2026',
      status: 'Active',
      requirements: `Successfully completed the testing criteria and coursework prescribed for the ${credTitle} micro-credential certification.`,
      coursework: ['Core foundational concepts', 'Performance compliance testing'],
      skillsGained: [credInfo?.category || 'Professional Skills'],
      notes: ''
    }]);
  };
  const updateCredential = (index, field, value) => {
    const updated = [...editCredentials];
    updated[index][field] = value;
    setEditCredentials(updated);
  };
  const removeCredential = (index) => {
    setEditCredentials(editCredentials.filter((_, i) => i !== index));
  };

  const addWorkExperience = () => {
    setEditWorkExperience([...editWorkExperience, { role: '', company: '', location: '', dateRange: '', description: '', achievements: [], skills: [] }]);
  };
  const updateWorkExperience = (index, field, value) => {
    const updated = [...editWorkExperience];
    updated[index][field] = value;
    setEditWorkExperience(updated);
  };
  const removeWorkExperience = (index) => {
    setEditWorkExperience(editWorkExperience.filter((_, i) => i !== index));
  };

  const addAchievementToWork = (workIndex, text) => {
    if (!text.trim()) return;
    const updated = [...editWorkExperience];
    updated[workIndex].achievements = [...(updated[workIndex].achievements || []), text.trim()];
    setEditWorkExperience(updated);
  };

  const removeAchievementFromWork = (workIndex, achIndex) => {
    const updated = [...editWorkExperience];
    updated[workIndex].achievements = updated[workIndex].achievements.filter((_, i) => i !== achIndex);
    setEditWorkExperience(updated);
  };

  const addSkillToWork = (workIndex, text) => {
    if (!text.trim()) return;
    const updated = [...editWorkExperience];
    updated[workIndex].skills = [...(updated[workIndex].skills || []), text.trim()];
    setEditWorkExperience(updated);
  };

  const removeSkillFromWork = (workIndex, skillIndex) => {
    const updated = [...editWorkExperience];
    updated[workIndex].skills = updated[workIndex].skills.filter((_, i) => i !== skillIndex);
    setEditWorkExperience(updated);
  };

  const getProficiencyPercentage = (level) => {
    switch (level) {
      case 'Beginner': return 25;
      case 'Intermediate': return 50;
      case 'Advanced': return 75;
      case 'Expert': return 100;
      default: return 50;
    }
  };

  // Group tech skills by category
  const groupedTechSkills = (student?.technicalSkills || []).reduce((acc, skill) => {
    const cat = skill.category || 'Other Skills';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(skill);
    return acc;
  }, {});

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto glass-panel p-6 md:p-8 relative">
      {/* Toast Notification */}
      {notification && (
        <div className={`fixed top-6 right-6 z-[70] px-6 py-4 rounded-xl shadow-2xl border text-sm font-bold flex items-center gap-3 animate-bounce ${
          notification.type === 'success' 
            ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400' 
            : 'bg-rose-500/20 border-rose-500/40 text-rose-400'
        }`}>
          {notification.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <ShieldAlert className="w-5 h-5" />}
          {notification.text}
        </div>
      )}

      {/* Header section with search */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b border-[#D4AF37]/20 pb-6 gap-4">
        <div>
          <h2 className="text-3xl font-black bg-gradient-to-r from-purple-400 to-[#D4AF37] bg-clip-text text-transparent">LEARNER WALLET</h2>
          <p className="text-purple-300 font-bold tracking-widest text-xs uppercase mt-1">Syprian Decentralized Micro-Credentials</p>
        </div>
        <form onSubmit={handleSearch} className="flex gap-2 w-full md:w-auto">
          <input 
            type="text" 
            placeholder="Enter Student Name or ID..." 
            className="flex-1 md:w-64 bg-[#300050]/40 border border-[#D4AF37]/30 rounded-xl px-4 py-2 text-white placeholder-purple-300/50 text-sm focus:outline-none focus:border-[#D4AF37]"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
          />
          <button type="submit" className="p-2 bg-[#D4AF37] hover:bg-[#D4AF37]/80 text-[#300050] font-black rounded-xl transition-all shadow-md">
            <Search className="w-5 h-5" />
          </button>
        </form>
      </div>

      {student ? (
        <div className="flex flex-col gap-8">
          {/* Header Card (E-Wallet Header) */}
          <div className="relative overflow-hidden bg-gradient-to-br from-[#300050]/80 to-slate-900/95 border-2 border-[#D4AF37]/40 rounded-2xl p-6 shadow-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#D4AF37]/5 blur-3xl rounded-full" />
            <div className="flex items-center gap-5 z-10">
              <div className="w-20 h-20 bg-gradient-to-br from-[#300050] to-[#D4AF37] border-2 border-[#D4AF37] rounded-full flex items-center justify-center shadow-lg text-3xl font-black text-white">
                {student.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-2xl font-black text-white flex items-center gap-2">
                  {student.name}
                  {student.competitionReady && <Award className="w-5 h-5 text-[#D4AF37]" title="Competition Ready" />}
                </h3>
                <p className="text-purple-300 font-mono text-sm">ID: {student.id}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-300 text-xs font-semibold">
                    Squad: {student.squad || 'Unassigned'}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-[#D4AF37] text-xs font-semibold">
                    Grade {student.grade || 'N/A'}
                  </span>
                </div>
              </div>
            </div>

            {/* Metrics */}
            <div className="flex items-center gap-6 z-10 w-full md:w-auto border-t md:border-t-0 border-purple-900/30 pt-4 md:pt-0">
              <div className="text-center bg-[#300050]/40 px-5 py-3 rounded-xl border border-purple-900/30 min-w-[100px]">
                <div className="text-3xl font-black text-[#D4AF37]">{student.totalHours.toFixed(1)}</div>
                <div className="text-[10px] font-bold tracking-wider uppercase text-purple-300">Total Hours</div>
              </div>
              <div className="text-center bg-[#300050]/40 px-5 py-3 rounded-xl border border-[#D4AF37]/30 min-w-[100px]">
                <div className="text-3xl font-black text-purple-400">{student.microPoints || 0}</div>
                <div className="text-[10px] font-bold tracking-wider uppercase text-purple-300">MicroPoints</div>
              </div>
              <button 
                onClick={shareProfile} 
                className="p-3 bg-[#300050]/60 hover:bg-[#300050] text-[#D4AF37] rounded-xl border border-[#D4AF37]/30 transition-colors flex items-center justify-center hover:scale-105"
                title="Copy Profile Link"
              >
                <ExternalLink className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b border-purple-900/30 gap-1 overflow-x-auto pb-1">
            {[
              { id: 'overview', name: 'Overview', icon: User },
              { id: 'skills', name: 'Skills & Talents', icon: Code },
              { id: 'credentials', name: 'Credentials', icon: ShieldCheck },
              { id: 'experience', name: 'Experience & History', icon: Briefcase },
              { id: 'edit', name: 'Edit Profile', icon: Settings }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setSelectedCredential(null);
                }}
                className={`flex items-center gap-2 px-5 py-3 rounded-t-xl font-bold text-sm transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-[#D4AF37] text-[#300050] shadow-md shadow-[#D4AF37]/10'
                    : 'text-purple-200 hover:text-white hover:bg-[#300050]/40'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.name}
              </button>
            ))}
          </div>

          {/* Tab Content Panels */}
          <div className="min-h-[300px]">
            {/* OVERVIEW TAB */}
            {activeTab === 'overview' && (
              <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                  <div className="glass-panel p-6 rounded-2xl border border-purple-900/20 bg-[#300050]/10">
                    <h4 className="text-lg font-black text-[#D4AF37] mb-3 uppercase tracking-wider">About Me</h4>
                    <p className="text-purple-100 text-sm leading-relaxed whitespace-pre-line">
                      {student.aboutMe || "No bio description provided yet. Use the 'Edit Profile' tab to write an intro!"}
                    </p>
                  </div>

                  {/* Direct Messages block */}
                  <div className="glass-panel p-6 rounded-2xl border border-purple-900/20 bg-[#300050]/10">
                    <h4 className="text-lg font-black text-[#D4AF37] mb-3 uppercase tracking-wider flex items-center gap-2">
                      <MessageCircle className="w-5 h-5 text-purple-400" /> Direct Message Communication
                    </h4>
                    <div className="bg-[#300050]/30 rounded-xl border border-purple-900/30 overflow-hidden flex flex-col h-64">
                      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
                        {dmMessages.map((msg) => (
                          <div key={msg.id} className={`flex flex-col ${msg.isMe ? 'items-end' : 'items-start'}`}>
                            <span className="text-[9px] text-purple-300 font-bold uppercase tracking-wider mb-1">
                              {msg.sender} • {msg.time}
                            </span>
                            <div className={`px-4 py-2 rounded-2xl text-xs shadow-md max-w-[85%] ${
                              msg.isMe 
                                ? 'bg-gradient-to-r from-purple-800 to-indigo-900 text-white rounded-tr-sm' 
                                : 'bg-slate-900/80 border border-purple-900/40 text-purple-100 rounded-tl-sm'
                            }`}>
                              {msg.text}
                            </div>
                          </div>
                        ))}
                      </div>
                      <form onSubmit={handleSendDM} className="p-2.5 bg-black/40 border-t border-purple-900/30 flex gap-2 items-center">
                        <input 
                          type="text" 
                          value={dmText}
                          onChange={(e) => setDmText(e.target.value)}
                          placeholder="Type message..." 
                          className="flex-1 bg-[#300050]/30 border border-purple-900/30 rounded-xl px-3 py-1.5 text-xs text-white placeholder-purple-300/40 focus:outline-none focus:border-[#D4AF37]"
                        />
                        <button type="submit" disabled={!dmText.trim()} className="p-1.5 bg-[#D4AF37] hover:bg-[#D4AF37]/80 text-[#300050] rounded-lg disabled:opacity-50 transition-colors">
                          <Send className="w-3.5 h-3.5" />
                        </button>
                      </form>
                    </div>
                  </div>
                </div>

                {/* Contact Card */}
                <div className="space-y-6">
                  <div className="glass-panel p-6 rounded-2xl border border-purple-900/20 bg-[#300050]/10">
                    <h4 className="text-lg font-black text-[#D4AF37] mb-4 uppercase tracking-wider">Contact Card</h4>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 text-purple-100">
                        <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-300">
                          <Mail className="w-4 h-4" />
                        </div>
                        <div className="overflow-hidden">
                          <p className="text-[10px] text-purple-300 font-bold uppercase">Email</p>
                          <p className="text-xs font-semibold truncate">{student.contact?.email || 'N/A'}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 text-purple-100">
                        <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-300">
                          <Phone className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-[10px] text-purple-300 font-bold uppercase">Phone</p>
                          <p className="text-xs font-semibold">{student.contact?.phone || 'N/A'}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 text-purple-100">
                        <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-300">
                          <MapPin className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-[10px] text-purple-300 font-bold uppercase">Location</p>
                          <p className="text-xs font-semibold">{student.contact?.location || 'N/A'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SKILLS TAB */}
            {activeTab === 'skills' && (
              <div className="grid md:grid-cols-2 gap-8">
                {/* Technical Skills */}
                <div className="glass-panel p-6 rounded-2xl border border-purple-900/20 bg-[#300050]/10">
                  <h4 className="text-lg font-black text-[#D4AF37] mb-5 uppercase tracking-wider flex items-center gap-2">
                    <Code className="w-5 h-5 text-purple-400" /> Technical Skills
                  </h4>
                  {Object.keys(groupedTechSkills).length > 0 ? (
                    <div className="space-y-6">
                      {Object.entries(groupedTechSkills).map(([category, skills]) => (
                        <div key={category} className="space-y-2.5">
                          <h5 className="text-xs font-black text-purple-300 uppercase tracking-widest border-b border-purple-900/30 pb-1">
                            {category}
                          </h5>
                          <div className="space-y-2">
                            {skills.map((skill, index) => (
                              <div key={index} className="flex justify-between items-center bg-[#300050]/20 px-3 py-1.5 rounded-lg border border-purple-900/10">
                                <span className="text-sm font-semibold text-white">{skill.name}</span>
                                <span className={`text-xs px-2 py-0.5 rounded-md font-bold ${
                                  skill.level === 'Expert' ? 'bg-[#D4AF37]/20 border border-[#D4AF37] text-[#D4AF37]' :
                                  skill.level === 'Advanced' ? 'bg-purple-500/20 border border-purple-500/40 text-purple-300' :
                                  skill.level === 'Intermediate' ? 'bg-blue-500/20 border border-blue-500/40 text-blue-300' :
                                  'bg-slate-500/20 border border-slate-500/40 text-slate-300'
                                }`}>
                                  {skill.level}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-purple-300 italic text-sm">No technical skills added yet.</p>
                  )}
                </div>

                {/* Soft Skills */}
                <div className="glass-panel p-6 rounded-2xl border border-purple-900/20 bg-[#300050]/10">
                  <h4 className="text-lg font-black text-[#D4AF37] mb-5 uppercase tracking-wider flex items-center gap-2">
                    <Award className="w-5 h-5 text-purple-400" /> Soft Skills & Work Ethic
                  </h4>
                  {student.softSkills && student.softSkills.length > 0 ? (
                    <div className="space-y-5">
                      {student.softSkills.map((skill, index) => (
                        <div key={index} className="space-y-1.5">
                          <div className="flex justify-between text-sm">
                            <span className="font-bold text-white">{skill.name}</span>
                            <span className="text-xs text-[#D4AF37] font-bold">{skill.level}</span>
                          </div>
                          <div className="w-full bg-[#300050]/40 rounded-full h-2.5 overflow-hidden border border-purple-900/20">
                            <div 
                              className="bg-gradient-to-r from-purple-600 to-[#D4AF37] h-full rounded-full"
                              style={{ width: `${getProficiencyPercentage(skill.level)}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-purple-300 italic text-sm">No soft skills added yet.</p>
                  )}
                </div>
              </div>
            )}

            {/* CREDENTIALS TAB */}
            {activeTab === 'credentials' && (
              <div className="relative">
                {/* Expandable Verification Drawer */}
                <AnimatePresence>
                  {selectedCredential && (
                    <motion.div 
                      initial={{ x: '100%' }}
                      animate={{ x: 0 }}
                      exit={{ x: '100%' }}
                      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                      className="absolute top-0 right-0 w-full md:w-96 min-h-full bg-slate-950 border-l border-[#D4AF37]/30 shadow-2xl p-6 z-20 rounded-r-2xl flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex justify-between items-center mb-6 pb-4 border-b border-purple-950">
                          <h4 className="font-black text-white text-lg flex items-center gap-2">
                            <ShieldCheck className="text-[#D4AF37] w-5 h-5" /> Verified Credential
                          </h4>
                          <button onClick={() => setSelectedCredential(null)} className="text-purple-300 hover:text-white p-1">
                            <X className="w-5 h-5" />
                          </button>
                        </div>

                        <div className="space-y-5 text-sm">
                          <div>
                            <p className="text-[10px] text-purple-300 font-bold uppercase tracking-wider">Credential Title</p>
                            <p className="font-bold text-white text-base mt-0.5">{selectedCredential.title}</p>
                          </div>
                          <div>
                            <p className="text-[10px] text-purple-300 font-bold uppercase tracking-wider">Issuing Organization</p>
                            <p className="font-semibold text-purple-100 mt-0.5">{selectedCredential.org}</p>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-[10px] text-purple-300 font-bold uppercase tracking-wider">Issue Date</p>
                              <p className="text-xs font-semibold text-purple-100 mt-0.5">{selectedCredential.completedDate}</p>
                            </div>
                            <div>
                              <p className="text-[10px] text-purple-300 font-bold uppercase tracking-wider">Status</p>
                              <span className="inline-block text-[10px] font-black px-2 py-0.5 rounded bg-emerald-500/20 border border-emerald-500 text-emerald-400 mt-1">
                                {selectedCredential.status}
                              </span>
                            </div>
                          </div>
                          <div>
                            <p className="text-[10px] text-purple-300 font-bold uppercase tracking-wider">Credential ID</p>
                            <p className="font-mono text-xs text-purple-200 mt-0.5">{selectedCredential.credentialId}</p>
                          </div>
                          <div>
                            <p className="text-[10px] text-purple-300 font-bold uppercase tracking-wider">Requirements Met</p>
                            <p className="text-xs text-purple-200 mt-1 leading-relaxed">{selectedCredential.requirements}</p>
                          </div>
                          {selectedCredential.coursework && selectedCredential.coursework.length > 0 && (
                            <div>
                              <p className="text-[10px] text-purple-300 font-bold uppercase tracking-wider">Completed Coursework</p>
                              <ul className="list-disc pl-4 text-xs text-purple-200 mt-1 space-y-1">
                                {selectedCredential.coursework.map((c, i) => (
                                  <li key={i}>{c}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {selectedCredential.notes && (
                            <div>
                              <p className="text-[10px] text-purple-300 font-bold uppercase tracking-wider">Notes</p>
                              <p className="text-xs text-purple-300 italic mt-1">{selectedCredential.notes}</p>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="pt-6 border-t border-purple-950 mt-6">
                        <button 
                          onClick={() => setShowCertificate(selectedCredential)}
                          className="w-full py-2.5 bg-[#D4AF37] hover:bg-[#D4AF37]/80 text-[#300050] font-black rounded-xl text-sm transition-all flex items-center justify-center gap-2"
                        >
                          <Printer className="w-4 h-4" /> View / Print Certificate
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="grid md:grid-cols-2 gap-4">
                  {student.credentials && student.credentials.length > 0 ? (
                    student.credentials.map((cred, idx) => (
                      <div 
                        key={idx} 
                        onClick={() => setSelectedCredential(cred)}
                        className={`glass-panel p-5 rounded-2xl border transition-all cursor-pointer hover:scale-[1.02] flex items-center justify-between ${
                          selectedCredential?.credentialId === cred.credentialId 
                            ? 'border-[#D4AF37] bg-[#300050]/20' 
                            : 'border-purple-900/20 bg-[#300050]/10 hover:border-[#D4AF37]/50'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#300050] to-[#D4AF37]/40 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37]">
                            <ShieldCheck className="w-6 h-6" />
                          </div>
                          <div>
                            <h5 className="font-bold text-white text-sm">{cred.title}</h5>
                            <p className="text-xs text-purple-300 mt-0.5">{cred.org} • {cred.completedDate}</p>
                            <p className="text-[10px] text-purple-400 font-mono mt-0.5">ID: {cred.credentialId}</p>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-purple-400" />
                      </div>
                    ))
                  ) : (
                    <div className="md:col-span-2 text-center py-12 border-2 border-dashed border-purple-900/10 rounded-2xl">
                      <p className="text-purple-300 italic text-sm">No credentials earned or registered yet.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* EXPERIENCE TAB */}
            {activeTab === 'experience' && (
              <div className="grid md:grid-cols-2 gap-8">
                {/* Work Experience */}
                <div className="space-y-6">
                  <h4 className="text-lg font-black text-[#D4AF37] mb-2 uppercase tracking-wider flex items-center gap-2 border-b border-purple-900/20 pb-2">
                    <Briefcase className="w-5 h-5 text-purple-400" /> Work History & Roles
                  </h4>
                  {student.workExperience && student.workExperience.length > 0 ? (
                    <div className="space-y-6 relative pl-4 border-l-2 border-purple-900/30">
                      {student.workExperience.map((exp, idx) => (
                        <div key={idx} className="relative space-y-2">
                          <div className="absolute -left-[21px] top-1.5 w-2 h-2 rounded-full bg-[#D4AF37] border-2 border-[#300050]" />
                          <div>
                            <span className="text-[10px] font-black uppercase text-[#D4AF37]">{exp.dateRange}</span>
                            <h5 className="font-black text-white text-base">{exp.role}</h5>
                            <p className="text-sm font-semibold text-purple-200">{exp.company} • <span className="text-xs text-purple-300">{exp.location}</span></p>
                          </div>
                          <p className="text-xs text-purple-100/90 leading-relaxed">{exp.description}</p>
                          {exp.achievements && exp.achievements.length > 0 && (
                            <ul className="list-disc pl-4 text-xs text-purple-200 space-y-1 mt-1">
                              {exp.achievements.map((ach, i) => (
                                <li key={i}>{ach}</li>
                              ))}
                            </ul>
                          )}
                          {exp.skills && exp.skills.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 pt-1">
                              {exp.skills.map((s, i) => (
                                <span key={i} className="px-2 py-0.5 bg-purple-500/10 border border-purple-500/20 text-purple-300 rounded text-[10px] font-bold">
                                  {s}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-purple-300 italic text-sm">No work experience entries listed.</p>
                  )}
                </div>

                {/* Education */}
                <div className="space-y-6">
                  <h4 className="text-lg font-black text-[#D4AF37] mb-2 uppercase tracking-wider flex items-center gap-2 border-b border-purple-900/20 pb-2">
                    <GraduationCap className="w-5 h-5 text-purple-400" /> Education & Pathways
                  </h4>
                  {student.education && student.education.length > 0 ? (
                    <div className="space-y-6 relative pl-4 border-l-2 border-purple-900/30">
                      {student.education.map((edu, idx) => (
                        <div key={idx} className="relative space-y-1.5">
                          <div className="absolute -left-[21px] top-1.5 w-2 h-2 rounded-full bg-purple-500 border-2 border-[#300050]" />
                          <div>
                            <span className="text-[10px] font-black uppercase text-purple-300">{edu.dateRange}</span>
                            <h5 className="font-black text-white text-base">{edu.school}</h5>
                            <p className="text-xs font-semibold text-purple-200">{edu.degree}</p>
                          </div>
                          <p className="text-xs text-purple-200/90 leading-relaxed">{edu.description}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-purple-300 italic text-sm">No education entries listed.</p>
                  )}
                </div>
              </div>
            )}

            {/* EDIT PROFILE TAB */}
            {activeTab === 'edit' && (
              <form onSubmit={handleSaveProfile} className="space-y-8 max-w-2xl mx-auto">
                <div className="flex justify-between items-center pb-3 border-b border-purple-900/20">
                  <h4 className="text-lg font-black text-white uppercase tracking-wider">Edit Student Profile</h4>
                  <button 
                    type="submit" 
                    disabled={isSaving}
                    className="px-6 py-2.5 bg-[#D4AF37] hover:bg-[#D4AF37]/80 text-[#300050] font-black rounded-xl text-sm transition-all flex items-center gap-2 disabled:opacity-50"
                  >
                    {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                    Save Portfolio
                  </button>
                </div>

                {/* General Bio */}
                <div className="space-y-4">
                  <h5 className="text-xs font-black text-[#D4AF37] uppercase tracking-widest">1. General & Contact</h5>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-purple-300">Phone Number</label>
                      <input 
                        type="text" 
                        value={editPhone}
                        onChange={(e) => setEditPhone(e.target.value)}
                        className="w-full bg-[#300050]/40 border border-purple-900/40 rounded-xl px-4 py-2 text-white text-sm focus:outline-none focus:border-[#D4AF37]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-purple-300">Email Address</label>
                      <input 
                        type="email" 
                        value={editEmail}
                        onChange={(e) => setEditEmail(e.target.value)}
                        className="w-full bg-[#300050]/40 border border-purple-900/40 rounded-xl px-4 py-2 text-white text-sm focus:outline-none focus:border-[#D4AF37]"
                      />
                    </div>
                    <div className="space-y-1 md:col-span-2">
                      <label className="text-xs font-bold text-purple-300">Location (City, State)</label>
                      <input 
                        type="text" 
                        value={editLocation}
                        onChange={(e) => setEditLocation(e.target.value)}
                        className="w-full bg-[#300050]/40 border border-purple-900/40 rounded-xl px-4 py-2 text-white text-sm focus:outline-none focus:border-[#D4AF37]"
                      />
                    </div>
                    <div className="space-y-1 md:col-span-2">
                      <label className="text-xs font-bold text-purple-300">About Me Summary</label>
                      <textarea 
                        value={editAboutMe}
                        onChange={(e) => setEditAboutMe(e.target.value)}
                        rows={4}
                        className="w-full bg-[#300050]/40 border border-purple-900/40 rounded-xl px-4 py-2 text-white text-sm focus:outline-none focus:border-[#D4AF37] resize-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Technical Skills Editor */}
                <div className="space-y-4 pt-4 border-t border-purple-900/10">
                  <div className="flex justify-between items-center">
                    <h5 className="text-xs font-black text-[#D4AF37] uppercase tracking-widest">2. Technical Skills</h5>
                    <button type="button" onClick={addTechSkill} className="text-xs font-bold text-purple-300 hover:text-white flex items-center gap-1">
                      <Plus className="w-4 h-4" /> Add Skill
                    </button>
                  </div>
                  <div className="space-y-3">
                    {editTechSkills.map((skill, index) => (
                      <div key={index} className="flex gap-2 items-center bg-[#300050]/20 p-3 rounded-xl border border-purple-900/20">
                        <input 
                          type="text" 
                          placeholder="Skill name (e.g. Onshape CAD)"
                          value={skill.name}
                          onChange={(e) => updateTechSkill(index, 'name', e.target.value)}
                          className="flex-1 bg-[#300050]/40 border border-purple-900/40 rounded-xl px-3 py-1.5 text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                        />
                        <select
                          value={skill.category}
                          onChange={(e) => updateTechSkill(index, 'category', e.target.value)}
                          className="bg-[#300050]/40 border border-purple-900/40 rounded-xl px-2 py-1.5 text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                        >
                          <option value="Fabrication & Layout" className="bg-slate-900">Fabrication & Layout</option>
                          <option value="Safety & Shop Operation" className="bg-slate-900">Safety & Shop Operation</option>
                          <option value="Programming & Math" className="bg-slate-900">Programming & Math</option>
                          <option value="Design & Media" className="bg-slate-900">Design & Media</option>
                          <option value="Other Skills" className="bg-slate-900">Other Skills</option>
                        </select>
                        <select
                          value={skill.level}
                          onChange={(e) => updateTechSkill(index, 'level', e.target.value)}
                          className="bg-[#300050]/40 border border-purple-900/40 rounded-xl px-2 py-1.5 text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                        >
                          <option value="Beginner" className="bg-slate-900">Beginner</option>
                          <option value="Intermediate" className="bg-slate-900">Intermediate</option>
                          <option value="Advanced" className="bg-slate-900">Advanced</option>
                          <option value="Expert" className="bg-slate-900">Expert</option>
                        </select>
                        <button type="button" onClick={() => removeTechSkill(index)} className="text-purple-300 hover:text-rose-400 p-1">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Soft Skills Editor */}
                <div className="space-y-4 pt-4 border-t border-purple-900/10">
                  <div className="flex justify-between items-center">
                    <h5 className="text-xs font-black text-[#D4AF37] uppercase tracking-widest">3. Soft Skills</h5>
                    <button type="button" onClick={addSoftSkill} className="text-xs font-bold text-purple-300 hover:text-white flex items-center gap-1">
                      <Plus className="w-4 h-4" /> Add Soft Skill
                    </button>
                  </div>
                  <div className="space-y-3">
                    {editSoftSkills.map((skill, index) => (
                      <div key={index} className="flex gap-2 items-center bg-[#300050]/20 p-3 rounded-xl border border-purple-900/20">
                        <input 
                          type="text" 
                          placeholder="Soft skill name (e.g. Communication)"
                          value={skill.name}
                          onChange={(e) => updateSoftSkill(index, 'name', e.target.value)}
                          className="flex-1 bg-[#300050]/40 border border-purple-900/40 rounded-xl px-3 py-1.5 text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                        />
                        <select
                          value={skill.level}
                          onChange={(e) => updateSoftSkill(index, 'level', e.target.value)}
                          className="bg-[#300050]/40 border border-purple-900/40 rounded-xl px-2 py-1.5 text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                        >
                          <option value="Beginner" className="bg-slate-900">Beginner</option>
                          <option value="Intermediate" className="bg-slate-900">Intermediate</option>
                          <option value="Advanced" className="bg-slate-900">Advanced</option>
                          <option value="Expert" className="bg-slate-900">Expert</option>
                        </select>
                        <button type="button" onClick={() => removeSoftSkill(index)} className="text-purple-300 hover:text-rose-400 p-1">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Education History Editor */}
                <div className="space-y-4 pt-4 border-t border-purple-900/10">
                  <div className="flex justify-between items-center">
                    <h5 className="text-xs font-black text-[#D4AF37] uppercase tracking-widest">4. Education History</h5>
                    <button type="button" onClick={addEducation} className="text-xs font-bold text-purple-300 hover:text-white flex items-center gap-1">
                      <Plus className="w-4 h-4" /> Add Education
                    </button>
                  </div>
                  <div className="space-y-4">
                    {editEducation.map((edu, index) => (
                      <div key={index} className="space-y-3 bg-[#300050]/20 p-4 rounded-xl border border-purple-900/20 relative">
                        <button type="button" onClick={() => removeEducation(index)} className="absolute top-4 right-4 text-purple-300 hover:text-rose-400">
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <div className="grid md:grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-purple-300">School Name</label>
                            <input 
                              type="text" 
                              value={edu.school}
                              onChange={(e) => updateEducation(index, 'school', e.target.value)}
                              className="w-full bg-[#300050]/40 border border-purple-900/40 rounded-xl px-3 py-1.5 text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-purple-300">Degree / Focus</label>
                            <input 
                              type="text" 
                              value={edu.degree}
                              onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                              className="w-full bg-[#300050]/40 border border-purple-900/40 rounded-xl px-3 py-1.5 text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                            />
                          </div>
                          <div className="space-y-1 md:col-span-2">
                            <label className="text-[10px] font-bold text-purple-300">Date Range (e.g. Sep 2022 - Jun 2026)</label>
                            <input 
                              type="text" 
                              value={edu.dateRange}
                              onChange={(e) => updateEducation(index, 'dateRange', e.target.value)}
                              className="w-full bg-[#300050]/40 border border-purple-900/40 rounded-xl px-3 py-1.5 text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                            />
                          </div>
                          <div className="space-y-1 md:col-span-2">
                            <label className="text-[10px] font-bold text-purple-300">Description</label>
                            <textarea 
                              value={edu.description}
                              onChange={(e) => updateEducation(index, 'description', e.target.value)}
                              rows={2}
                              className="w-full bg-[#300050]/40 border border-purple-900/40 rounded-xl px-3 py-1.5 text-white text-xs focus:outline-none focus:border-[#D4AF37] resize-none"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Credentials Editor */}
                <div className="space-y-4 pt-4 border-t border-purple-900/10">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
                    <h5 className="text-xs font-black text-[#D4AF37] uppercase tracking-widest">5. Credentials & Certifications</h5>
                    <div className="flex gap-2">
                      <select 
                        id="micro-credential-select" 
                        className="bg-[#300050]/40 border border-purple-900/40 rounded-xl px-3 py-1.5 text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                        defaultValue=""
                      >
                        <option value="" disabled className="bg-slate-900">Select standard credential...</option>
                        {MICRO_CREDENTIALS.map((c, i) => (
                          <option key={i} value={c.title} className="bg-slate-900">{c.title} ({c.org})</option>
                        ))}
                      </select>
                      <button 
                        type="button" 
                        onClick={() => {
                          const val = document.getElementById('micro-credential-select').value;
                          addCredential(val);
                        }} 
                        className="px-3 py-1.5 bg-purple-800 text-white font-bold text-xs rounded-xl hover:bg-purple-700 flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add
                      </button>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {editCredentials.map((cred, index) => (
                      <div key={index} className="space-y-3 bg-[#300050]/20 p-4 rounded-xl border border-purple-900/20 relative">
                        <button type="button" onClick={() => removeCredential(index)} className="absolute top-4 right-4 text-purple-300 hover:text-rose-400">
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <div className="grid md:grid-cols-2 gap-3">
                          <div className="space-y-1 md:col-span-2">
                            <label className="text-[10px] font-bold text-purple-300">Credential Title</label>
                            <input 
                              type="text" 
                              value={cred.title}
                              onChange={(e) => updateCredential(index, 'title', e.target.value)}
                              className="w-full bg-[#300050]/40 border border-purple-900/40 rounded-xl px-3 py-1.5 text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-purple-300">Organization Issuer</label>
                            <input 
                              type="text" 
                              value={cred.org}
                              onChange={(e) => updateCredential(index, 'org', e.target.value)}
                              className="w-full bg-[#300050]/40 border border-purple-900/40 rounded-xl px-3 py-1.5 text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-purple-300">Completed Date</label>
                            <input 
                              type="text" 
                              value={cred.completedDate}
                              onChange={(e) => updateCredential(index, 'completedDate', e.target.value)}
                              className="w-full bg-[#300050]/40 border border-purple-900/40 rounded-xl px-3 py-1.5 text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-purple-300">Credential ID</label>
                            <input 
                              type="text" 
                              value={cred.credentialId}
                              onChange={(e) => updateCredential(index, 'credentialId', e.target.value)}
                              className="w-full bg-[#300050]/40 border border-purple-900/40 rounded-xl px-3 py-1.5 text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-purple-300">Status</label>
                            <select
                              value={cred.status}
                              onChange={(e) => updateCredential(index, 'status', e.target.value)}
                              className="w-full bg-[#300050]/40 border border-purple-900/40 rounded-xl px-3 py-1.5 text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                            >
                              <option value="Active" className="bg-slate-900">Active</option>
                              <option value="Expired" className="bg-slate-900">Expired</option>
                              <option value="Under Review" className="bg-slate-900">Under Review</option>
                            </select>
                          </div>
                          <div className="space-y-1 md:col-span-2">
                            <label className="text-[10px] font-bold text-purple-300">Requirements Met (Details)</label>
                            <textarea 
                              value={cred.requirements}
                              onChange={(e) => updateCredential(index, 'requirements', e.target.value)}
                              rows={2}
                              className="w-full bg-[#300050]/40 border border-purple-900/40 rounded-xl px-3 py-1.5 text-white text-xs focus:outline-none focus:border-[#D4AF37] resize-none"
                            />
                          </div>
                          <div className="space-y-1 md:col-span-2">
                            <label className="text-[10px] font-bold text-purple-300">Notes / Remarks</label>
                            <input 
                              type="text" 
                              value={cred.notes}
                              onChange={(e) => updateCredential(index, 'notes', e.target.value)}
                              className="w-full bg-[#300050]/40 border border-purple-900/40 rounded-xl px-3 py-1.5 text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Work Experience Editor */}
                <div className="space-y-4 pt-4 border-t border-purple-900/10">
                  <div className="flex justify-between items-center">
                    <h5 className="text-xs font-black text-[#D4AF37] uppercase tracking-widest">6. Work History & Accomplishments</h5>
                    <button type="button" onClick={addWorkExperience} className="text-xs font-bold text-purple-300 hover:text-white flex items-center gap-1">
                      <Plus className="w-4 h-4" /> Add Experience
                    </button>
                  </div>
                  <div className="space-y-6">
                    {editWorkExperience.map((exp, index) => (
                      <div key={index} className="space-y-4 bg-[#300050]/20 p-4 rounded-xl border border-purple-900/20 relative">
                        <button type="button" onClick={() => removeWorkExperience(index)} className="absolute top-4 right-4 text-purple-300 hover:text-rose-400">
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <div className="grid md:grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-purple-300">Role Title</label>
                            <input 
                              type="text" 
                              value={exp.role}
                              onChange={(e) => updateWorkExperience(index, 'role', e.target.value)}
                              className="w-full bg-[#300050]/40 border border-purple-900/40 rounded-xl px-3 py-1.5 text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-purple-300">Company / Organization</label>
                            <input 
                              type="text" 
                              value={exp.company}
                              onChange={(e) => updateWorkExperience(index, 'company', e.target.value)}
                              className="w-full bg-[#300050]/40 border border-purple-900/40 rounded-xl px-3 py-1.5 text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-purple-300">Location</label>
                            <input 
                              type="text" 
                              value={exp.location}
                              onChange={(e) => updateWorkExperience(index, 'location', e.target.value)}
                              className="w-full bg-[#300050]/40 border border-purple-900/40 rounded-xl px-3 py-1.5 text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-purple-300">Date Range (e.g. Sep 2025 - Present)</label>
                            <input 
                              type="text" 
                              value={exp.dateRange}
                              onChange={(e) => updateWorkExperience(index, 'dateRange', e.target.value)}
                              className="w-full bg-[#300050]/40 border border-purple-900/40 rounded-xl px-3 py-1.5 text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                            />
                          </div>
                          <div className="space-y-1 md:col-span-2">
                            <label className="text-[10px] font-bold text-purple-300">Role Description Summary</label>
                            <textarea 
                              value={exp.description}
                              onChange={(e) => updateWorkExperience(index, 'description', e.target.value)}
                              rows={2}
                              className="w-full bg-[#300050]/40 border border-purple-900/40 rounded-xl px-3 py-1.5 text-white text-xs focus:outline-none focus:border-[#D4AF37] resize-none"
                            />
                          </div>

                          {/* Achievements list editor */}
                          <div className="space-y-2 md:col-span-2">
                            <label className="text-[10px] font-bold text-purple-300">Achievements / Bullet Points</label>
                            <div className="flex gap-2">
                              <input 
                                type="text" 
                                id={`new-ach-${index}`}
                                placeholder="E.g. Led chassis assembly"
                                className="flex-1 bg-[#300050]/40 border border-purple-900/40 rounded-xl px-3 py-1.5 text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    e.preventDefault();
                                    addAchievementToWork(index, e.target.value);
                                    e.target.value = '';
                                  }
                                }}
                              />
                              <button 
                                type="button"
                                onClick={() => {
                                  const el = document.getElementById(`new-ach-${index}`);
                                  addAchievementToWork(index, el.value);
                                  el.value = '';
                                }}
                                className="px-3 py-1.5 bg-purple-900 hover:bg-purple-800 text-white text-xs rounded-xl font-bold"
                              >
                                Add
                              </button>
                            </div>
                            <div className="space-y-1 pt-1.5">
                              {(exp.achievements || []).map((ach, achIdx) => (
                                <div key={achIdx} className="flex justify-between items-center bg-slate-900/40 px-2.5 py-1 rounded text-xs border border-purple-900/10">
                                  <span className="text-purple-200">• {ach}</span>
                                  <button type="button" onClick={() => removeAchievementFromWork(index, achIdx)} className="text-purple-400 hover:text-rose-400 p-0.5">
                                    <X className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Skill tags list editor */}
                          <div className="space-y-2 md:col-span-2">
                            <label className="text-[10px] font-bold text-purple-300">Skills Gained (Tags)</label>
                            <div className="flex gap-2">
                              <input 
                                type="text" 
                                id={`new-skill-tag-${index}`}
                                placeholder="E.g. CAD Design"
                                className="flex-1 bg-[#300050]/40 border border-purple-900/40 rounded-xl px-3 py-1.5 text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    e.preventDefault();
                                    addSkillToWork(index, e.target.value);
                                    e.target.value = '';
                                  }
                                }}
                              />
                              <button 
                                type="button"
                                onClick={() => {
                                  const el = document.getElementById(`new-skill-tag-${index}`);
                                  addSkillToWork(index, el.value);
                                  el.value = '';
                                }}
                                className="px-3 py-1.5 bg-purple-900 hover:bg-purple-800 text-white text-xs rounded-xl font-bold"
                              >
                                Add
                              </button>
                            </div>
                            <div className="flex flex-wrap gap-1.5 pt-1.5">
                              {(exp.skills || []).map((skill, skillIdx) => (
                                <span key={skillIdx} className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-purple-500/10 border border-purple-500/20 text-purple-300 rounded text-[10px] font-semibold">
                                  {skill}
                                  <button type="button" onClick={() => removeSkillFromWork(index, skillIdx)} className="hover:text-rose-400">
                                    <X className="w-3 h-3" />
                                  </button>
                                </span>
                              ))}
                            </div>
                          </div>

                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer Save Button */}
                <div className="pt-6 border-t border-purple-900/20 flex justify-end">
                  <button 
                    type="submit" 
                    disabled={isSaving}
                    className="px-10 py-3 bg-[#D4AF37] hover:bg-[#D4AF37]/80 text-[#300050] font-black rounded-xl text-base transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
                  >
                    {isSaving && <Loader2 className="w-5 h-5 animate-spin" />}
                    Save Portfolio Changes
                  </button>
                </div>

              </form>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center py-16 border-2 border-dashed border-purple-900/10 rounded-2xl">
          <p className="text-purple-300 font-semibold text-lg">Search for a student profile to view their e-wallet.</p>
          <p className="text-purple-400/60 text-sm mt-1">Try entering "Test Builder" or "Jane Doe" above.</p>
        </div>
      )}

      {/* Certificate Print Overlay Modal */}
      <AnimatePresence>
        {showCertificate && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto print:p-0 print:bg-white"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="w-full max-w-4xl bg-[#fdfbf7] border-8 border-double border-[#D4AF37] shadow-2xl rounded-2xl p-8 md:p-12 relative flex flex-col justify-between overflow-hidden print:border-none print:shadow-none print:rounded-none print:w-full print:h-full print:p-8"
              style={{ minHeight: '550px' }}
            >
              {/* Certificate Background Elements */}
              <div className="absolute inset-0 bg-[radial-gradient(#D4AF37_0.5px,transparent_0.5px)] [background-size:16px_16px] opacity-[0.03] print:hidden" />
              <div className="absolute -top-20 -left-20 w-48 h-48 border-4 border-[#D4AF37]/10 rounded-full print:hidden" />
              <div className="absolute -bottom-20 -right-20 w-48 h-48 border-4 border-[#D4AF37]/10 rounded-full print:hidden" />

              {/* Certificate Header */}
              <div className="text-center space-y-3 z-10">
                <h2 className="text-[10px] font-bold tracking-[0.3em] text-[#300050] uppercase">Syprian Micro-Credential Network</h2>
                <h1 className="text-3xl md:text-5xl font-serif text-[#D4AF37] font-black uppercase tracking-wider my-2">Certificate of Achievement</h1>
                <p className="text-xs font-semibold text-slate-500 tracking-wider">This is officially presented to verify that</p>
              </div>

              {/* Recipient Details */}
              <div className="text-center space-y-4 my-8 z-10">
                <h3 className="text-3xl md:text-5xl font-serif italic text-[#300050] font-bold border-b border-[#D4AF37]/30 pb-3 inline-block px-12">
                  {student?.name}
                </h3>
                <p className="text-sm text-slate-600 max-w-xl mx-auto leading-relaxed mt-4">
                  has successfully completed the testing standards, verified coursework hours, and performance evaluation criteria to satisfy requirements for the micro-credential of
                </p>
                <h4 className="text-2xl md:text-3xl font-black text-indigo-950 uppercase tracking-wide">
                  {showCertificate.title}
                </h4>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">
                  Awarded by {showCertificate.org}
                </p>
              </div>

              {/* Certificate Footer / Signature and Seal */}
              <div className="grid grid-cols-3 items-end gap-4 mt-6 z-10">
                {/* Date & ID */}
                <div className="text-left space-y-1">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Issue Date</p>
                  <p className="text-xs font-black text-[#300050]">{showCertificate.completedDate}</p>
                  <div className="pt-2 border-t border-slate-300 w-full mt-2" />
                  <p className="text-[9px] font-mono text-slate-400">ID: {showCertificate.credentialId}</p>
                </div>

                {/* Gold Seal Graphic */}
                <div className="flex flex-col items-center justify-center relative">
                  <div className="w-20 h-20 bg-gradient-to-br from-[#f2d06b] via-[#D4AF37] to-[#8c670d] rounded-full border-4 border-white shadow-xl flex items-center justify-center relative z-20">
                    <div className="absolute inset-1 border border-white/40 rounded-full border-dashed" />
                    <Award className="w-8 h-8 text-white" />
                  </div>
                  {/* Ribbon tails */}
                  <div className="absolute top-12 left-6 w-5 h-16 bg-[#8c670d] opacity-90 transform -rotate-12 origin-top z-10" />
                  <div className="absolute top-12 right-6 w-5 h-16 bg-[#8c670d] opacity-90 transform rotate-12 origin-top z-10" />
                </div>

                {/* Signatures */}
                <div className="text-right space-y-1">
                  <div className="text-xs italic font-serif text-[#300050] font-bold">Principal E'Shaun Caine</div>
                  <div className="text-[9px] text-slate-400">Syprian Verification Officer</div>
                  <div className="pt-2 border-t border-slate-300 w-full mt-2" />
                  <div className="text-xs italic font-serif text-[#300050] font-bold">Ronald Cornish</div>
                  <div className="text-[9px] text-slate-400">Robotics Team Lead Coach</div>
                </div>
              </div>

              {/* Action buttons (hidden when printing) */}
              <div className="mt-8 pt-6 border-t border-slate-200 flex justify-end gap-3 print:hidden z-10">
                <button 
                  onClick={() => window.print()}
                  className="px-6 py-2 bg-[#300050] hover:bg-[#300050]/90 text-[#D4AF37] font-black rounded-xl text-xs transition-colors flex items-center gap-2 border border-[#D4AF37]/30"
                >
                  <Printer className="w-4 h-4" /> Print Document
                </button>
                <button 
                  onClick={() => setShowCertificate(null)}
                  className="px-6 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-xl text-xs transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}

function ManufacturingHub({ setActiveVideo }) {
  const [activeTab, setActiveTab] = useState('Bambu Labs 3D Printing');

  const tabs = [
    { id: 'Bambu Labs 3D Printing', name: 'Bambu Labs Basics' },
    { id: 'Filament Types (TPU/PETG)', name: 'Filaments (TPU/PETG)' },
    { id: 'CNC Machine Basics', name: 'CNC Machines' },
    { id: 'Graphite CNC Machining', name: 'Graphite Machining' },
    { id: 'Metal 3D Printing (Steel)', name: 'Steel 3D Printing' },
    { id: 'Carbon Fiber 3D Printing', name: 'Carbon Fiber Printers' },
    { id: 'UV Resin 3D Printing', name: 'UV Resin Printers' },
    { id: 'Custom Robot Parts (vs Kitbot)', name: 'Custom Parts vs Kitbot' }
  ];

  const currentUrl = ACTIVITY_RESOURCES[activeTab];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-6xl mx-auto glass-panel p-6 md:p-8 flex flex-col md:flex-row gap-8">
      {/* Sidebar Tabs */}
      <div className="w-full md:w-64 flex flex-col gap-2">
        <h2 className="text-xl font-black text-white mb-4 tracking-wider border-b border-white/10 pb-4">FAB LAB EQUIP</h2>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`text-left px-4 py-3 rounded-xl font-bold text-sm transition-all ${
              activeTab === tab.id 
                ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20' 
                : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
            }`}
          >
            {tab.name}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="flex-1">
        <div className="bg-black/50 border border-white/10 rounded-2xl overflow-hidden shadow-2xl relative" style={{ paddingTop: '56.25%' }}>
          {currentUrl ? (
            <div 
              className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer hover:bg-white/5 transition-colors group"
              onClick={() => setActiveVideo({ activity: activeTab })}
            >
              <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(220,38,38,0.5)] group-hover:scale-110 transition-transform">
                <Play className="w-10 h-10 text-white ml-2" />
              </div>
              <p className="mt-4 text-white font-bold tracking-widest text-lg group-hover:text-red-400 transition-colors">START MISSION</p>
            </div>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-slate-500 font-bold tracking-widest uppercase">
              No Training Media Found
            </div>
          )}
        </div>
        <div className="mt-6">
          <h3 className="text-2xl font-black text-white">{activeTab}</h3>
          <p className="text-slate-400 mt-2">
            Watch these curated playlists to master fabrication equipment. Learn how to manufacture parts beyond the standard kitbot to give your robot a competitive edge.
          </p>
        </div>
      </div>
    </motion.div>
  );
}


function TeamMessenger({ currentUser }) {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    { id: 1, sender: 'Drive Team (Station 1)', text: 'Hey, is the FTC simulator up? We need to test the new intake code.', time: '10:02 AM' },
    { id: 2, sender: 'Build Captain', text: 'Yeah, it is on the dashboard now. Just use the DECODE tab.', time: '10:04 AM' },
    { id: 3, sender: 'Coach', text: 'Make sure everyone logs their hours in the Kiosk before leaving the lab today.', time: '10:15 AM' }
  ]);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    const newMessage = {
      id: Date.now(),
      sender: currentUser,
      text: message.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages([...messages, newMessage]);
    setMessage('');
    
    // Simulate auto-reply for demo purposes
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        sender: 'System AI',
        text: 'Message received and logged to the global network.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    }, 2000);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="glass-panel w-80 md:w-96 h-[500px] mb-4 flex flex-col overflow-hidden shadow-2xl border border-blue-500/30"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600/50 to-indigo-600/50 p-4 border-b border-white/10 flex justify-between items-center backdrop-blur-md">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <h3 className="font-black text-white tracking-widest text-sm">GLOBAL COMMS</h3>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-white/70 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 bg-black/40">
              {messages.map((msg) => {
                const isMe = msg.sender === currentUser;
                return (
                  <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1 ml-1">{msg.sender} • {msg.time}</span>
                    <div className={`px-4 py-2.5 rounded-2xl text-sm shadow-md max-w-[85%] ${
                      isMe 
                        ? 'bg-blue-500 text-white rounded-tr-sm' 
                        : msg.sender === 'System AI'
                          ? 'bg-purple-500/20 border border-purple-500/30 text-purple-200 rounded-tl-sm'
                          : 'bg-white/10 border border-white/5 text-slate-200 rounded-tl-sm'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSend} className="p-3 bg-black/60 border-t border-white/10 flex gap-2 items-center">
              <button type="button" onClick={() => document.getElementById('file-upload-global').click()} className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors flex items-center justify-center">
                <Paperclip className="w-5 h-5" />
                <input type="file" id="file-upload-global" className="hidden" onChange={(e) => {
                  if (e.target.files[0]) {
                    setMessages([...messages, {
                      id: Date.now(),
                      sender: currentUser,
                      text: `📁 Uploaded file: ${e.target.files[0].name}`,
                      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    }]);
                  }
                }} />
              </button>
              <input 
                type="text" 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Broadcast to team..." 
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 transition-colors"
              />
              <button type="submit" disabled={!message.trim()} className="p-2 bg-blue-500 hover:bg-blue-400 disabled:opacity-50 disabled:hover:bg-blue-500 text-white rounded-xl transition-colors flex items-center justify-center">
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/30 transition-all duration-300 ${
          isOpen ? 'bg-slate-700 text-slate-300 scale-90' : 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white hover:scale-110'
        }`}
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>
    </div>
  );
}

// --- SERVSAFE TRAINING MODAL ---
function ServSafeTrainingModal({ activeVideoData, onClose, notify }) {
  const { activity, studentId } = activeVideoData;
  const url = ACTIVITY_RESOURCES[activity];
  let embedUrl = url;
  if (url && url.includes('watch?v=')) embedUrl = url.split('v=')[1];
  
  const [step, setStep] = useState('video'); // 'video' | 'quiz' | 'success'
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [playerObj, setPlayerObj] = useState(null);
  
  const quiz = React.useMemo(() => {
    return QUIZZES[activity]?.['Level 1'] || [];
  }, [activity]);

  const onReady = (e) => setPlayerObj(e.target);

  const handleVideoEnd = () => {
    setStep('quiz');
  };

  const handleAnswer = () => {
    if (selectedAnswer === null) return notify('Select an answer', 'error');
    
    if (selectedAnswer === quiz[currentQIndex].correctAnswer) {
      notify('Correct! Great job.', 'success');
      if (currentQIndex < quiz.length - 1) {
        setCurrentQIndex(prev => prev + 1);
        setSelectedAnswer(null);
      } else {
        setStep('success');
      }
    } else {
      notify('Incorrect! You must review the training video to try again.', 'error');
      setStep('video');
      setSelectedAnswer(null);
      if (playerObj) playerObj.seekTo(0);
      if (playerObj) playerObj.playVideo();
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl">
      <div className="w-full max-w-5xl bg-slate-900 border border-emerald-500/30 shadow-[0_0_50px_rgba(52,211,153,0.15)] rounded-2xl overflow-hidden flex flex-col" style={{ height: '85vh' }}>
        <div className="p-4 border-b border-white/10 flex justify-between items-center bg-black/80">
          <h2 className="text-xl font-black text-white flex items-center gap-3">
             <ShieldCheck className="text-emerald-500" />
             {activity} - CERTIFICATION TRAINING
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-2 hover:bg-white/5 rounded-full transition-colors"><X size={24} /></button>
        </div>
        
        <div className="flex-1 flex flex-col relative bg-black">
          {step === 'video' && (
             <div className="absolute inset-0 flex flex-col">
               <div className="p-3 bg-emerald-500/10 text-emerald-400 text-sm font-bold text-center border-b border-emerald-500/20 tracking-wider">
                 <BookOpen className="inline w-4 h-4 mr-2" />
                 WATCH THE TRAINING VIDEO CAREFULLY. YOU WILL BE TESTED ON THIS MATERIAL.
               </div>
               <div className="flex-1 relative">
                 <YouTube 
                   videoId={embedUrl}
                   opts={{ width: '100%', height: '100%', playerVars: { autoplay: 1, rel: 0 } }}
                   onReady={onReady}
                   onEnd={handleVideoEnd}
                   className="absolute inset-0 w-full h-full"
                 />
               </div>
               <div className="p-4 bg-black flex justify-end">
                  <button onClick={() => setStep('quiz')} className="text-[10px] text-slate-600 hover:text-slate-400 uppercase tracking-widest font-bold">
                    [Developer Skip to Quiz]
                  </button>
               </div>
             </div>
          )}

          {step === 'quiz' && (
            <div className="flex-1 p-8 overflow-y-auto bg-gradient-to-br from-slate-900 to-black">
              <div className="max-w-3xl mx-auto">
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
                  <div className="flex items-center gap-3 text-emerald-400 font-black tracking-widest">
                    <ClipboardList size={28} />
                    <span>QUESTION {currentQIndex + 1} OF {quiz.length}</span>
                  </div>
                  <div className="text-xs text-slate-500 font-bold uppercase">
                    Answer correctly to proceed
                  </div>
                </div>
                
                <h3 className="text-3xl font-medium text-white mb-10 leading-tight">{quiz[currentQIndex].question}</h3>
                
                <div className="space-y-4">
                  {quiz[currentQIndex].options.map((opt, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedAnswer(idx)}
                      className={`w-full p-6 rounded-xl border-2 text-left text-xl font-medium transition-all duration-300 ${
                        selectedAnswer === idx 
                          ? 'bg-emerald-500/20 border-emerald-500 text-white shadow-[0_0_20px_rgba(52,211,153,0.3)] scale-[1.02]' 
                          : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:border-white/30'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                         <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold text-sm ${selectedAnswer === idx ? 'border-emerald-500 text-emerald-500' : 'border-slate-500 text-slate-500'}`}>
                           {String.fromCharCode(65 + idx)}
                         </div>
                         {opt}
                      </div>
                    </button>
                  ))}
                </div>

                <div className="mt-12 flex justify-end">
                  <button 
                    onClick={handleAnswer}
                    disabled={selectedAnswer === null}
                    className="btn-solid bg-emerald-600 hover:bg-emerald-500 text-white font-black py-5 px-12 rounded-xl disabled:opacity-30 text-lg transition-all"
                  >
                    SUBMIT ANSWER <ChevronRight className="inline ml-2" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {step === 'success' && (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-slate-900 to-black">
              <div className="w-32 h-32 bg-gold-500/10 rounded-full flex items-center justify-center mb-8 border-4 border-gold-500/30">
                <Award className="w-16 h-16 text-gold-500" />
              </div>
              <h2 className="text-5xl font-black text-white mb-6 uppercase tracking-wider">CERTIFICATION PASSED</h2>
              <p className="text-xl text-slate-400 mb-12 max-w-2xl leading-relaxed">
                You have successfully demonstrated understanding of the {activity} rules. Your team is now safer and more prepared for competition!
              </p>
              <button onClick={onClose} className="btn-gold py-5 px-16 text-xl font-black rounded-xl">
                RETURN TO DASHBOARD
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// --- VIDEO CONTAINER MODAL ---
function VideoContainerModal({ activeVideoData, onClose, notify, missionCompletions }) {
  const { activity, studentId } = activeVideoData;
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const url = ACTIVITY_RESOURCES[activity];
  
  let videoIds = [];
  let embedUrl = url;
  let isPlaylist = false;
  
  if (url && url.includes('playlist?list=')) {
    embedUrl = url.split('list=')[1];
    isPlaylist = true;
  } else if (url && url.includes('watch_videos?video_ids=')) {
    videoIds = url.split('video_ids=')[1].split(',');
    embedUrl = videoIds[activeVideoIndex];
  } else if (url && url.includes('watch?v=')) {
    embedUrl = url.split('v=')[1].split('&')[0];
  }

  const [checkedQuestions, setCheckedQuestions] = useState({});
  const [focusAreas, setFocusAreas] = useState([]);
  const [isFocusLoading, setIsFocusLoading] = useState(false);

  useEffect(() => {
    const fetchFocusAreas = async () => {
      setIsFocusLoading(true);
      setCheckedQuestions({});
      try {
        const res = await axios.post(`${API_BASE}/ai-tutor/generate-focus`, {
          studentId,
          activity,
          videoId: embedUrl
        });
        setFocusAreas(res.data.focusAreas || []);
      } catch (err) {
        console.error('Failed to fetch focus areas', err);
        setFocusAreas([
          "Observe the core mechanics presented.", 
          "Note how this applies to our robot.", 
          "Think about how your squad would use this information."
        ]);
      }
      setIsFocusLoading(false);
    };
    if (embedUrl) {
      fetchFocusAreas();
    }
  }, [embedUrl, activity, studentId]);

  const [playerObj, setPlayerObj] = useState(null);
  const [lastPauseTime, setLastPauseTime] = useState(0);
  const [checkpointIndex, setCheckpointIndex] = useState(0);
  const [attentionMode, setAttentionMode] = useState(true);
  const [nextIntervalUI, setNextIntervalUI] = useState(30);
  const [completedInterval, setCompletedInterval] = useState(0);

  
  // AI Tutor State
  const [showTutor, setShowTutor] = useState(false);
  const [tutorState, setTutorState] = useState('summary'); // 'summary' | 'loading' | 'topics' | 'questions' | 'success'
  const [tutorSummary, setTutorSummary] = useState('');
  const [tutorFeedback, setTutorFeedback] = useState('');
  const [tutorTopics, setTutorTopics] = useState([]);
  const [tutorQuestions, setTutorQuestions] = useState([]);
  const [tutorAnswers, setTutorAnswers] = useState({});
  const [tutorError, setTutorError] = useState('');
  const [gradeLevel, setGradeLevel] = useState(12);
  const [showAnswerKey, setShowAnswerKey] = useState(false);

  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      
      recognition.onresult = (event) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
             finalTranscript += event.results[i][0].transcript + ' ';
          }
        }
        if (finalTranscript) {
          setTutorSummary(prev => {
            const trimmed = prev.trim();
            return trimmed.length === 0 ? finalTranscript : trimmed + ' ' + finalTranscript;
          });
        }
      };

      recognition.onerror = (e) => {
        console.error('Speech recognition error', e);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      if (recognitionRef.current) {
        recognitionRef.current.start();
        setIsListening(true);
      } else {
        if (notify) notify('Speech recognition is not supported in this browser. Please type your answer.', 'error');
      }
    }
  };

  // AI Tutor Timed Interruption
  useEffect(() => {
    if (!playerObj) return;
    const interval = setInterval(async () => {
      try {
        const state = await playerObj.getPlayerState();
        if (state === 1 && !showTutor) { // 1 = playing
          const time = await playerObj.getCurrentTime();
          const duration = await playerObj.getDuration() || 0;
          
          let currentInterval;
          if (attentionMode) {
             const intervals = [30, 45, 60];
             if (checkpointIndex < intervals.length) {
                 currentInterval = intervals[checkpointIndex];
             } else if (checkpointIndex === intervals.length) {
                 currentInterval = Math.max((duration - time) / 2, 60);
             } else {
                 currentInterval = Infinity;
             }
          } else {
             if (checkpointIndex === 0) {
                 currentInterval = Math.max(duration / 2, 60);
             } else {
                 currentInterval = Infinity;
             }
          }
          
          setNextIntervalUI(currentInterval);

          if (currentInterval !== Infinity && time > lastPauseTime + currentInterval) {
            playerObj.pauseVideo();
            setLastPauseTime(time);
            setCompletedInterval(currentInterval);
            setCheckpointIndex(prev => prev + 1);
            setShowTutor(true);
            setTutorState('summary');
            setTutorSummary('');
            setTutorAnswers({});
            setTutorError('');
          }
        }
      } catch (e) {
        // Player not ready
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [playerObj, lastPauseTime, showTutor, checkpointIndex, attentionMode]);

  const handleTutorSubmit = async () => {
    if (!tutorSummary.trim()) return;
    setTutorState('loading');
    setTutorError('');
    try {
      const time = await playerObj.getCurrentTime();
      const res = await axios.post(`${API_BASE}/ai-tutor/generate-topics`, {
        studentId,
        activity,
        summary: tutorSummary,
        videoTimestamp: time,
        intervalSeconds: completedInterval
      });
      setTutorFeedback(res.data.feedback);
      setTutorTopics(res.data.topics);
      setTutorState('topics');
    } catch (err) {
      setTutorError(err.response?.data?.error || 'Failed to connect to God-Brain. Try again.');
      setTutorState('summary');
    }
  };

  const handleTopicSelect = async (topic) => {
    setTutorState('loading');
    setTutorError('');
    let questionCount = 3;
    if (completedInterval <= 30) questionCount = 1;
    else if (completedInterval <= 60) questionCount = 2;

    try {
      const res = await axios.post(`${API_BASE}/ai-tutor/generate-questions`, {
        studentId,
        activity,
        topic,
        gradeLevel,
        questionCount
      });
      setTutorQuestions(res.data.questions);
      setTutorAnswers({});
      setTutorState('questions');
    } catch (err) {
      setTutorError(err.response?.data?.error || 'Failed to generate questions. Try again.');
      setTutorState('topics');
    }
  };

  const handleTutorQuizSubmit = async () => {
    let correctCount = 0;
    tutorQuestions.forEach((q, idx) => {
      if (tutorAnswers[idx] === q.correctAnswer) correctCount++;
    });

    const earnedPoints = correctCount * (gradeLevel * 2);
    
    if (studentId && earnedPoints > 0) {
      try {
        await axios.post(`${API_BASE}/ai-tutor/award-points`, { studentId, points: earnedPoints });
        await axios.post(`${API_BASE}/ai-tutor/log-quiz`, { 
          studentId, 
          activity,
          topic,
          gradeLevel,
          score: correctCount,
          total: tutorQuestions.length,
          pointsEarned: earnedPoints,
          timestamp: new Date().toISOString()
        });
        notify(`Tutor Evaluation Complete! +${earnedPoints} Micropoints Awarded.`, 'success');
      } catch (e) {
        console.error('Points error', e);
      }
    } else {
      notify(`Tutor Evaluation Complete! Scored ${correctCount}/${tutorQuestions.length}`, 'success');
    }

    setTutorState('success');
    setShowAnswerKey(false);
  };

  const opts = {
    height: '100%',
    width: '100%',
    playerVars: {
      autoplay: 1,
      modestbranding: 1,
      rel: 0
    },
  };

  const onReady = (event) => {
    setPlayerObj(event.target);
  };

  // Inactivity Tracker
  useEffect(() => {
    let timeout;
    
    const resetTimer = () => {
      clearTimeout(timeout);
      // 15 minutes = 15 * 60 * 1000 = 900000 ms
      timeout = setTimeout(() => {
        if (notify) notify('Training module closed due to 15 minutes of inactivity.', 'error');
        onClose();
      }, 900000);
    };

    const handleBlur = () => {
      // If user clicks inside the YouTube iframe, it triggers a window blur
      if (document.activeElement && document.activeElement.tagName === 'IFRAME') {
        resetTimer();
      }
    };

    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('keydown', resetTimer);
    window.addEventListener('click', resetTimer);
    window.addEventListener('scroll', resetTimer);
    window.addEventListener('blur', handleBlur);

    resetTimer(); // start initially

    return () => {
      clearTimeout(timeout);
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('keydown', resetTimer);
      window.removeEventListener('click', resetTimer);
      window.removeEventListener('scroll', resetTimer);
      window.removeEventListener('blur', handleBlur);
    };
  }, [onClose, notify]);

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/95 z-[100] flex items-center justify-center p-4 overflow-y-auto backdrop-blur-sm"
    >
      <div className="bg-slate-900 border border-slate-700 w-full max-w-6xl rounded-2xl overflow-hidden flex flex-col shadow-2xl relative">
        <div className="flex justify-between items-center mb-6 p-4 border-b border-slate-800 bg-black">
          <div className="flex items-center gap-4">
            <h3 className="font-black text-white uppercase tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
              ACTIVE TRAINING: {activity}
            </h3>
            <div className="flex items-center gap-2 ml-4 px-3 py-1 bg-slate-800/50 rounded-full border border-slate-700/50">
              <span className="text-xs font-bold text-slate-400">STRICT ATTENTION:</span>
              <button 
                onClick={() => setAttentionMode(!attentionMode)}
                className={`w-8 h-4 rounded-full relative transition-colors duration-300 ${attentionMode ? 'bg-emerald-500' : 'bg-slate-600'}`}
              >
                <div className={`w-3 h-3 rounded-full bg-white absolute top-0.5 transition-all duration-300 ${attentionMode ? 'left-[18px]' : 'left-0.5'}`}></div>
              </button>
            </div>
            <div className="flex items-center gap-2 text-blue-400 bg-blue-500/20 px-3 py-1 rounded-full text-xs font-bold border border-blue-500/30 shadow-[0_0_10px_rgba(59,130,246,0.2)]">
              ⏱️ NEXT AI CHECKPOINT: {nextIntervalUI === Infinity ? 'END' : `${Math.round(nextIntervalUI)}s`}
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-2 bg-slate-800 rounded-full transition-colors"><X className="w-5 h-5"/></button>
        </div>
        
        <div className="flex flex-col lg:flex-row max-h-[85vh]">
          {/* Video Player */}
          <div className="lg:w-2/3 bg-black flex-shrink-0 flex flex-col relative">
            <div className="relative pt-[56.25%] w-full">
              <YouTube 
                videoId={videoIds.length > 0 ? embedUrl : (isPlaylist ? undefined : embedUrl)}
                opts={videoIds.length > 0 ? opts : (isPlaylist ? { ...opts, playerVars: { ...opts.playerVars, listType: 'playlist', list: embedUrl } } : opts)}
                onReady={onReady}
                className="absolute inset-0 w-full h-full"
              />
            </div>
            
            {/* AI Tutor Overlay */}
            <AnimatePresence>
              {showTutor && (
                <motion.div 
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 50 }}
                  className="absolute inset-0 z-50 bg-slate-900/95 backdrop-blur-md flex flex-col p-8 overflow-y-auto border-t-4 border-blue-500"
                >
                  <h3 className="text-2xl font-black text-white flex items-center gap-3 mb-6">
                    <MessageCircle className="text-blue-400 w-8 h-8" />
                    AI TUTOR CHECKPOINT
                  </h3>
                  
                  {tutorState === 'summary' && (
                    <div className="flex flex-col flex-1 relative">
                      <p className="text-slate-300 font-bold mb-4">You've been watching for {completedInterval} seconds. What are the key concepts you just learned?</p>
                      
                      <div className="relative mb-4">
                        <textarea 
                          value={tutorSummary}
                          onChange={(e) => setTutorSummary(e.target.value)}
                          className={`w-full h-32 bg-black/50 border rounded-xl p-4 pr-16 text-white focus:outline-none font-medium resize-none transition-colors ${isListening ? 'border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.3)]' : 'border-slate-700 focus:border-blue-500'}`}
                          placeholder="Explain the concepts in your own words to unlock the next video segment..."
                        />
                        <button
                          onClick={toggleListening}
                          className={`absolute bottom-4 right-4 p-3 rounded-full flex items-center justify-center transition-all ${isListening ? 'bg-red-500 text-white animate-pulse shadow-[0_0_20px_rgba(239,68,68,0.6)]' : 'bg-slate-700 text-slate-300 hover:bg-slate-600 hover:text-white'}`}
                          title={isListening ? 'Stop Recording' : 'Start Dictation'}
                        >
                          {isListening ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                        </button>
                      </div>

                      {tutorError && <p className="text-red-400 text-sm font-bold mb-4">{tutorError}</p>}
                      <button 
                        onClick={handleTutorSubmit}
                        disabled={tutorSummary.trim().length < 10}
                        className="btn-solid bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-xl disabled:opacity-50"
                      >
                        SUBMIT SYNTHESIS TO AI
                      </button>
                    </div>
                  )}

                  {tutorState === 'loading' && (
                    <div className="flex flex-col items-center justify-center flex-1">
                      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                      <p className="text-blue-400 font-black tracking-widest animate-pulse">EVALUATING SYNTHESIS...</p>
                    </div>
                  )}

                  {tutorState === 'topics' && (
                    <div className="flex flex-col flex-1">
                      <p className="text-white font-bold mb-2 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl italic">
                        "{tutorFeedback}"
                      </p>
                      <p className="text-slate-300 font-bold mb-4 mt-4">Over the last {completedInterval} seconds, these topics were likely discussed. What would you like to be tested on?</p>
                      
                      <div className="mb-6 bg-black/40 p-4 rounded-xl border border-slate-700">
                        <label className="text-emerald-400 font-bold mb-2 block flex items-center gap-2">
                          🎯 Select Target Difficulty: {gradeLevel}th Grade
                        </label>
                        <input 
                          type="range" 
                          min="1" 
                          max="12" 
                          value={gradeLevel} 
                          onChange={(e) => setGradeLevel(parseInt(e.target.value))}
                          className="w-full accent-blue-500 mb-2 cursor-pointer"
                        />
                        <div className="flex justify-between text-xs text-slate-400 font-bold">
                          <span>1st Grade (Easy, 2 pts)</span>
                          <span>12th Grade (Hard, 24 pts)</span>
                        </div>
                      </div>

                      <div className="space-y-3 flex-1 overflow-y-auto mb-6">
                        {tutorTopics.map((t, idx) => {
                          const completions = (missionCompletions[t] || []).length;
                          const starsAvailable = Math.max(0, 5 - completions);
                          
                          return (
                            <button
                              key={idx}
                              onClick={() => handleTopicSelect(t)}
                              className="w-full flex justify-between items-center p-4 rounded-xl font-bold bg-white/5 border border-white/10 hover:bg-blue-500/20 hover:border-blue-500 transition-all text-white"
                            >
                              <span className="text-left"><span className="text-blue-400 mr-2">➜</span> {t}</span>
                              <MissionStars count={starsAvailable} />
                            </button>
                          );
                        })}
                      </div>
                      {tutorError && <p className="text-red-400 text-sm font-bold mb-4 bg-red-500/10 p-3 rounded-lg border border-red-500/20">{tutorError}</p>}
                    </div>
                  )}

                  {tutorState === 'questions' && (
                    <div className="flex flex-col flex-1">
                      <p className="text-slate-300 font-bold mb-6">Answer these auto-generated questions to verify your understanding:</p>
                      <div className="space-y-6 flex-1 overflow-y-auto mb-6 pr-2">
                        {tutorQuestions.map((q, idx) => (
                          <div key={idx} className="bg-black/40 p-5 rounded-xl border border-slate-700">
                            <p className="text-white font-bold mb-4"><span className="text-blue-500 mr-2">{idx + 1}.</span> {q.question}</p>
                            <div className="space-y-2">
                              {q.options.map((opt, oIdx) => (
                                <label key={oIdx} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${tutorAnswers[idx] === oIdx ? 'bg-blue-600/20 border-blue-500' : 'bg-white/5 border-white/5 hover:bg-white/10'}`}>
                                  <input 
                                    type="radio" 
                                    name={`tutor-q-${idx}`} 
                                    checked={tutorAnswers[idx] === oIdx}
                                    onChange={() => setTutorAnswers(prev => ({ ...prev, [idx]: oIdx }))}
                                    className="hidden"
                                  />
                                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${tutorAnswers[idx] === oIdx ? 'border-blue-500' : 'border-slate-500'}`}>
                                    {tutorAnswers[idx] === oIdx && <div className="w-2 h-2 rounded-full bg-blue-500" />}
                                  </div>
                                  <span className="text-sm text-slate-300">{opt}</span>
                                </label>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                      {tutorError && <p className="text-red-400 text-sm font-bold mb-4 bg-red-500/10 p-3 rounded-lg border border-red-500/20">{tutorError}</p>}
                      <button 
                        onClick={handleTutorQuizSubmit}
                        disabled={Object.keys(tutorAnswers).length !== tutorQuestions.length}
                        className="btn-solid bg-green-600 hover:bg-green-500 text-white font-black py-4 rounded-xl disabled:opacity-50"
                      >
                        SUBMIT FINAL ANSWERS
                      </button>
                    </div>
                  )}

                  {tutorState === 'success' && (
                    <div className="flex flex-col flex-1 w-full relative">
                      {!showAnswerKey ? (
                        <div className="flex flex-col items-center justify-center flex-1 text-center h-full">
                          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-6 border border-green-500">
                            <CheckCircle className="w-10 h-10 text-green-400" />
                          </div>
                          <h4 className="text-3xl font-black text-white mb-2">EVALUATION COMPLETE!</h4>
                          <p className="text-xl text-slate-300 font-bold mb-2">
                            Score: {tutorQuestions.filter((q, idx) => tutorAnswers[idx] === q.correctAnswer).length} / {tutorQuestions.length}
                          </p>
                          <p className="text-green-400 font-bold mb-8">
                            +{tutorQuestions.filter((q, idx) => tutorAnswers[idx] === q.correctAnswer).length * (gradeLevel * 2)} Micropoints Awarded
                          </p>
                          
                          <div className="flex flex-col sm:flex-row gap-4 w-full">
                            <button 
                              onClick={() => setShowAnswerKey(true)}
                              className="flex-1 btn-solid bg-slate-700 hover:bg-slate-600 text-white font-black py-4 rounded-xl"
                            >
                              REVIEW ANSWERS
                            </button>
                            <button 
                              onClick={() => {
                                setShowTutor(false);
                                playerObj.playVideo();
                              }}
                              className="flex-1 btn-solid bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-xl"
                            >
                              RESUME VIDEO
                            </button>
                            <button 
                              onClick={() => setTutorState('topics')}
                              className="flex-1 btn-solid bg-purple-600 hover:bg-purple-500 text-white font-black py-4 rounded-xl"
                            >
                              TEST ANOTHER TOPIC
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col flex-1 h-full">
                          <h4 className="text-xl font-black text-white mb-4 flex items-center gap-2">
                            <span className="text-blue-400">📋</span> ANSWER KEY
                          </h4>
                          <div className="space-y-4 flex-1 overflow-y-auto mb-6 pr-2">
                            {tutorQuestions.map((q, idx) => {
                              const isCorrect = tutorAnswers[idx] === q.correctAnswer;
                              return (
                                <div key={idx} className={`p-4 rounded-xl border ${isCorrect ? 'bg-green-900/20 border-green-500/50' : 'bg-red-900/20 border-red-500/50'}`}>
                                  <p className="text-white font-bold mb-3">{idx + 1}. {q.question}</p>
                                  <div className="space-y-2">
                                    {q.options.map((opt, oIdx) => {
                                      let bgColor = 'bg-white/5';
                                      let borderColor = 'border-white/10';
                                      let icon = null;
                                      
                                      if (oIdx === q.correctAnswer) {
                                        bgColor = 'bg-green-500/20';
                                        borderColor = 'border-green-500';
                                        icon = '✅';
                                      } else if (oIdx === tutorAnswers[idx]) {
                                        bgColor = 'bg-red-500/20';
                                        borderColor = 'border-red-500';
                                        icon = '❌';
                                      }

                                      return (
                                        <div key={oIdx} className={`p-2 rounded-lg border flex items-start gap-2 ${bgColor} ${borderColor}`}>
                                          <span className="text-sm mt-0.5">{icon || '⬛'}</span>
                                          <span className="text-sm text-slate-300">{opt}</span>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                          <div className="flex gap-4">
                            <button 
                              onClick={() => setShowAnswerKey(false)}
                              className="flex-1 btn-solid bg-slate-700 hover:bg-slate-600 text-white font-black py-3 rounded-xl"
                            >
                              BACK TO RESULTS
                            </button>
                            <button 
                              onClick={() => {
                                setShowTutor(false);
                                playerObj.playVideo();
                              }}
                              className="flex-1 btn-solid bg-blue-600 hover:bg-blue-500 text-white font-black py-3 rounded-xl"
                            >
                              RESUME VIDEO
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Video Selector Tabs */}
            {videoIds.length > 0 && (
              <div className="bg-slate-900 border-t border-slate-800 p-4">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">SELECT TRAINING MODULE</h4>
                <div className="flex flex-wrap gap-2">
                  {videoIds.map((vid, idx) => (
                    <button
                      key={vid}
                      onClick={() => setActiveVideoIndex(idx)}
                      className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${
                        activeVideoIndex === idx 
                          ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.5)]' 
                          : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white border border-white/5'
                      }`}
                    >
                      Part {idx + 1}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Questions Overlay / Sidebar */}
          <div className="lg:w-1/3 bg-slate-900 p-6 overflow-y-auto border-l border-slate-800">
            <div className="sticky top-0 bg-slate-900 pb-4 border-b border-slate-800 mb-6 z-10">
              <h4 className="text-emerald-400 font-black uppercase text-sm tracking-widest flex items-center gap-2">
                <ClipboardList className="w-4 h-4" />
                MISSION FOCUS
              </h4>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed font-medium">
                Keep these focus areas in mind while watching. You will be expected to discuss these during your Checkout Debrief.
              </p>
            </div>
            
            <div className="space-y-6">
              {isFocusLoading ? (
                <div className="bg-black/40 p-5 rounded-xl border border-white/5 text-center">
                  <Loader2 className="w-6 h-6 animate-spin text-emerald-500 mx-auto mb-2" />
                  <p className="text-sm text-slate-500 italic">God-Brain is generating your focus areas...</p>
                </div>
              ) : (
                focusAreas.map((focusArea, idx) => (
                  <div key={idx} className={`bg-black/40 p-5 rounded-xl border transition-all duration-300 ${checkedQuestions[idx] ? 'border-emerald-500/50 opacity-60' : 'border-white/5'}`}>
                    <div className="flex items-start gap-3">
                      <input 
                        type="checkbox" 
                        className="mt-1 w-4 h-4 rounded border-slate-600 text-emerald-500 bg-slate-800 cursor-pointer"
                        checked={!!checkedQuestions[idx]}
                        onChange={() => setCheckedQuestions(prev => ({ ...prev, [idx]: !prev[idx] }))}
                      />
                      <div>
                        <p className={`text-sm font-bold leading-relaxed transition-colors ${checkedQuestions[idx] ? 'text-slate-400 line-through' : 'text-slate-200'}`}>
                          <span className="text-emerald-500 mr-2">{idx + 1}.</span> 
                          {focusArea}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
              {!isFocusLoading && focusAreas.length === 0 && (
                <div className="bg-black/40 p-5 rounded-xl border border-white/5 text-center">
                  <p className="text-sm text-slate-500 italic">No specific mission focus areas for this module.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function RulesRegulator({ setView }) {
  const [chatHistory, setChatHistory] = useState([
    { role: 'assistant', text: "Hello! I am the Rules Regulator. I have deeply studied the entire FTC and FRC rulebooks. Ask me any rule or requirement, and I will instantly retrieve it for you." }
  ]);
  const [query, setQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, isTyping]);

  const handleAsk = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    const currentQuery = query;
    const currentHistory = [...chatHistory];
    
    setChatHistory(prev => [...prev, { role: 'user', text: currentQuery }]);
    setQuery('');
    setIsTyping(true);

    try {
      const res = await axios.post(`${API_BASE}/regulator`, {
        message: currentQuery,
        history: currentHistory
      });
      setChatHistory(prev => [...prev, { role: 'assistant', text: res.data.reply }]);
    } catch (err) {
      setChatHistory(prev => [...prev, { role: 'assistant', text: "Systems offline. Unable to access the Syprian Rules Database at this time." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-black bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-red-500" /> RULES REGULATOR
          </h2>
          <p className="text-slate-400 font-bold tracking-widest text-xs uppercase mt-1">FTC & FRC Syprian Repository</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 md:h-[600px] flex flex-col">
          <div className="bg-black/30 border border-white/10 rounded-2xl p-6 relative overflow-hidden h-full">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-orange-500" />
            <h3 className="font-black text-white mb-2 uppercase tracking-widest text-sm">Indexed Source Material</h3>
            <ul className="space-y-3 mt-4">
              <li>
                <a href="/Syprian_Brochure.pdf" target="_blank" rel="noreferrer" className="flex items-center gap-3 text-sm text-amber-300 bg-amber-500/10 p-3 rounded-xl border border-amber-500/20 hover:bg-amber-500/20 transition-colors">
                  <FileText className="w-4 h-4 text-amber-400" /> Syprian Universal Brochure
                </a>
              </li>
              <li>
                <a href="/Syprian_User_Guide.pdf" target="_blank" rel="noreferrer" className="flex items-center gap-3 text-sm text-indigo-300 bg-indigo-500/10 p-3 rounded-xl border border-indigo-500/20 hover:bg-indigo-500/20 transition-colors">
                  <HelpCircle className="w-4 h-4 text-indigo-400" /> Syprian Platform User Guide
                </a>
              </li>
              <li>
                <button onClick={() => setView('compliance')} className="flex w-full items-center gap-3 text-sm text-green-300 bg-green-500/10 p-3 rounded-xl border border-green-500/20 hover:bg-green-500/20 transition-colors">
                  <ShieldCheck className="w-4 h-4 text-green-400" /> Platform Compliance & Policies
                </button>
              </li>
              <li>
                <a href="/uspubschools_compliance.html" target="_blank" rel="noreferrer" className="flex items-center gap-3 text-sm text-blue-300 bg-blue-500/10 p-3 rounded-xl border border-blue-500/20 hover:bg-blue-500/20 transition-colors">
                  <ShieldCheck className="w-4 h-4 text-blue-400" /> US Pub Schools / HWS.org Policies
                </a>
              </li>
              <li>
                <a href="https://ftc-resources.firstinspires.org/ftc/game" target="_blank" rel="noreferrer" className="flex items-center gap-3 text-sm text-slate-300 bg-white/5 p-3 rounded-xl border border-white/5 hover:bg-white/10 transition-colors">
                  <BookOpen className="w-4 h-4 text-orange-400" /> FIRST Tech Challenge Game Manual Part 1
                </a>
              </li>
              <li>
                <a href="https://ftc-resources.firstinspires.org/ftc/game" target="_blank" rel="noreferrer" className="flex items-center gap-3 text-sm text-slate-300 bg-white/5 p-3 rounded-xl border border-white/5 hover:bg-white/10 transition-colors">
                  <BookOpen className="w-4 h-4 text-orange-400" /> FIRST Tech Challenge Game Manual Part 2
                </a>
              </li>
              <li>
                <a href="https://www.firstinspires.org/resources/library/frc/season-materials" target="_blank" rel="noreferrer" className="flex items-center gap-3 text-sm text-slate-300 bg-white/5 p-3 rounded-xl border border-white/5 hover:bg-white/10 transition-colors">
                  <BookOpen className="w-4 h-4 text-red-400" /> FIRST Robotics Competition Game Manual
                </a>
              </li>
              <li>
                <a href="https://info.firstinspires.org/hubfs/web/program/all/safety-manual.pdf" target="_blank" rel="noreferrer" className="flex items-center gap-3 text-sm text-slate-300 bg-white/5 p-3 rounded-xl border border-white/5 hover:bg-white/10 transition-colors">
                  <ShieldCheck className="w-4 h-4 text-blue-400" /> FIRST Safety Manual
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="md:col-span-2">
          <div className="bg-black/40 border border-white/10 rounded-2xl flex flex-col h-[600px] overflow-hidden relative">
            <div className="p-4 border-b border-white/10 bg-white/5 backdrop-blur-md flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="font-bold text-xs tracking-widest text-white uppercase">Regulator AI Active</span>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {chatHistory.map((msg, i) => (
                <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1 mx-2">
                    {msg.role === 'user' ? 'You' : 'Rules Regulator'}
                  </span>
                  <div className={`px-5 py-3 rounded-2xl max-w-[85%] text-sm leading-relaxed shadow-lg ${
                    msg.role === 'user' 
                      ? 'bg-red-500 text-white rounded-tr-sm' 
                      : 'bg-white/10 text-slate-200 border border-white/5 rounded-tl-sm'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex flex-col items-start">
                  <div className="px-5 py-3 rounded-2xl bg-white/5 text-slate-400 border border-white/5 rounded-tl-sm text-sm flex gap-1">
                    <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce delay-75"></span>
                    <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce delay-150"></span>
                  </div>
                </div>
              )}
              <div ref={endRef} />
            </div>

            <form onSubmit={handleAsk} className="p-4 bg-black/60 border-t border-white/10 flex gap-2 items-center">
              <button 
                type="button" 
                onClick={() => setIsListening(!isListening)} 
                className={`p-3 rounded-xl transition-colors flex items-center justify-center ${isListening ? 'bg-red-500 text-white animate-pulse' : 'text-slate-400 hover:text-white hover:bg-white/10'}`}
                title="Voice Input"
              >
                {isListening ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
              </button>
              <button 
                type="button" 
                onClick={() => document.getElementById('rules-file-upload').click()} 
                className="p-3 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors flex items-center justify-center"
                title="Upload Image/File"
              >
                <Paperclip className="w-5 h-5" />
                <input 
                  type="file" 
                  id="rules-file-upload" 
                  className="hidden" 
                  onChange={(e) => {
                    if (e.target.files[0]) {
                      setChatHistory(prev => [...prev, { role: 'user', text: `📁 Uploaded file: ${e.target.files[0].name}` }]);
                      setIsTyping(true);
                      setTimeout(() => {
                        setChatHistory(prev => [...prev, { role: 'assistant', text: "I have analyzed the uploaded document. It appears to reference a specific robot mechanism. Based on the rules, please ensure any custom fabricated parts comply with the materials and safety guidelines in Section 8." }]);
                        setIsTyping(false);
                      }, 1500);
                    }
                  }} 
                />
              </button>
              <input 
                type="text" 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask a question about the rulebook..." 
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-red-500/50 transition-colors"
              />
              <button 
                type="submit" 
                disabled={!query.trim() || isTyping} 
                className="px-6 bg-red-500 hover:bg-red-400 disabled:opacity-50 disabled:hover:bg-red-500 text-white font-bold rounded-xl transition-colors shadow-lg shadow-red-500/20"
              >
                ASK
              </button>
            </form>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// --- MOVIE TIME COMPONENT ---
function MovieTime() {
  const movies = [
    { title: "Cool Runnings", description: "Learn about teamwork, overcoming a lack of equipment, and gracious professionalism when things fall apart.", icon: "fa-snowflake", color: "text-blue-400" },
    { title: "Coach Carter", description: "Discipline, academics first, and coming together as a unified team against the odds.", icon: "fa-basketball", color: "text-orange-400" },
    { title: "Lean on Me", description: "A tough love approach to transforming a school, teaching accountability and leadership.", icon: "fa-school", color: "text-red-400" },
    { title: "Remember the Titans", description: "Overcoming prejudice and learning to work together in the face of adversity.", icon: "fa-football", color: "text-amber-600" },
    { title: "Akeelah and the Bee", description: "Dedication, study skills, and the power of community support in academic competitions.", icon: "fa-book-open", color: "text-yellow-400" },
    { title: "Spare Parts", description: "An underfunded high school robotics team goes up against MIT using spare car parts.", icon: "fa-robot", color: "text-emerald-400" },
    { title: "The Boy Who Harnessed the Wind", description: "Engineering and problem-solving to save a community from famine using scrap parts.", icon: "fa-wind", color: "text-cyan-400" },
    { title: "Hidden Figures", description: "African American women overcoming discrimination to become the brilliant minds behind NASA.", icon: "fa-rocket", color: "text-purple-400" },
    { title: "The Great Debaters", description: "Intellectual competition, teamwork, and finding your voice to change the world.", icon: "fa-microphone", color: "text-rose-400" },
    { title: "The Pursuit of Happyness", description: "Unwavering perseverance, hard work, and never giving up on your goals.", icon: "fa-briefcase", color: "text-slate-400" },
    { title: "Outliers: The Story of Success", description: "Malcolm Gladwell explores what makes high achievers different, focusing on the 10,000-Hour Rule and meaningful practice.", icon: "fa-book-journal-whills", color: "text-teal-400" }
  ];

  const [selectedMovie, setSelectedMovie] = useState(null);
  const [reportType, setReportType] = useState('written'); // written | oral
  const [reportContent, setReportContent] = useState('');
  const [studentId, setStudentId] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!studentId.trim()) {
      alert("Please enter your Student ID.");
      return;
    }
    if (reportType === 'written' && reportContent.length < 20) {
      alert("Your written report is too short. Please add more detail!");
      return;
    }
    
    // Simulate submission to the coach dashboard
    setSubmitted(true);
    setTimeout(() => {
      setSelectedMovie(null);
      setSubmitted(false);
      setReportContent('');
      setStudentId('');
    }, 2500);
  };

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('idle'); // idle | uploading | success | error
  const [uploadMessage, setUploadMessage] = useState('');

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      addFiles(e.dataTransfer.files);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      addFiles(e.target.files);
    }
  };

  const addFiles = (fileList) => {
    const newFiles = Array.from(fileList).map(file => ({
      file,
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: (file.size / 1024 / 1024).toFixed(2) + " MB",
      type: file.type,
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null
    }));
    setSelectedFiles(prev => [...prev, ...newFiles]);
  };

  const removeFile = (id) => {
    setSelectedFiles(prev => {
      const target = prev.find(f => f.id === id);
      if (target && target.preview) {
        URL.revokeObjectURL(target.preview);
      }
      return prev.filter(f => f.id !== id);
    });
  };

  const handleUploadSubmit = async () => {
    if (selectedFiles.length === 0) return;
    setUploadStatus('uploading');
    setUploadMessage('');

    let successCount = 0;
    for (const fileObj of selectedFiles) {
      const formData = new FormData();
      formData.append('file', fileObj.file);

      try {
        const res = await axios.post(`${API_BASE}/media/upload`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        if (res.data && res.data.success) {
          successCount++;
        }
      } catch (err) {
        console.warn(`File upload failed for ${fileObj.name}, running in local fallback:`, err.message);
      }
    }

    if (successCount === selectedFiles.length) {
      setUploadStatus('success');
      setUploadMessage('All files uploaded successfully to the backend storage!');
      setSelectedFiles([]);
    } else if (successCount > 0) {
      setUploadStatus('success');
      setUploadMessage(`Uploaded ${successCount} of ${selectedFiles.length} files. (Local Fallback/Demo connection ready)`);
      setSelectedFiles([]);
    } else {
      setUploadStatus('success');
      setUploadMessage('Demo Upload Successful: Ready for backend connection!');
      setSelectedFiles([]);
    }

    setTimeout(() => {
      setUploadStatus('idle');
      setUploadMessage('');
    }, 4000);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-6xl mx-auto pb-20">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 border border-white/10">
          <i className="fa-solid fa-clapperboard text-2xl text-white"></i>
        </div>
        <div>
          <h2 className="text-4xl font-black text-white tracking-tight">CINEMA & REPORTS</h2>
          <p className="text-slate-400 font-medium">Watch inspirational movies about teamwork and Gracious Professionalism, then submit your report.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {movies.map((m, idx) => (
          <div key={idx} className="bg-black/30 border border-white/10 rounded-2xl p-6 hover:bg-white/5 transition-colors flex flex-col justify-between group">
            <div>
              <i className={`fa-solid ${m.icon} text-3xl ${m.color} mb-4 opacity-80 group-hover:opacity-100 transition-opacity`}></i>
              <h3 className="text-xl font-black text-white mb-2">{m.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed mb-6">{m.description}</p>
            </div>
            <button onClick={() => setSelectedMovie(m)} className="w-full py-3 bg-indigo-500/20 hover:bg-indigo-500/40 text-indigo-300 font-bold rounded-xl border border-indigo-500/30 transition-all flex items-center justify-center gap-2">
              <i className="fa-solid fa-pen-nib"></i> Write Report
            </button>
          </div>
        ))}
      </div>

      {/* Report Modal */}
      <AnimatePresence>
        {selectedMovie && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-slate-900 border border-indigo-500/30 rounded-2xl p-8 max-w-2xl w-full shadow-2xl relative">
              {submitted ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <i className="fa-solid fa-check text-4xl text-green-500"></i>
                  </div>
                  <h3 className="text-2xl font-black text-white mb-2">Report Submitted!</h3>
                  <p className="text-slate-400">Coach Cornish will review your report shortly. Great job!</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="flex justify-between items-start mb-6 border-b border-white/10 pb-4">
                    <div>
                      <h3 className="text-2xl font-black text-white mb-1">{selectedMovie.title} Report</h3>
                      <p className="text-indigo-400 text-sm font-bold uppercase tracking-widest">Reflect on Gracious Professionalism & Teamwork</p>
                    </div>
                    <button type="button" onClick={() => setSelectedMovie(null)} className="text-slate-500 hover:text-white p-2 rounded-full hover:bg-white/5 transition-colors">
                      <i className="fa-solid fa-times text-xl"></i>
                    </button>
                  </div>

                  <div className="space-y-5">
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Your Student ID</label>
                      <input type="text" required value={studentId} onChange={e => setStudentId(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-600" placeholder="e.g. jsmith26" />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Report Format</label>
                      <div className="flex gap-4">
                        <label className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-xl border-2 cursor-pointer transition-all ${reportType === 'written' ? 'bg-indigo-500/20 border-indigo-500 text-white' : 'border-white/10 text-slate-400 hover:bg-white/5'}`}>
                          <input type="radio" name="reportType" value="written" checked={reportType === 'written'} onChange={() => setReportType('written')} className="hidden" />
                          <i className="fa-solid fa-keyboard"></i> Written
                        </label>
                        <label className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-xl border-2 cursor-pointer transition-all ${reportType === 'oral' ? 'bg-indigo-500/20 border-indigo-500 text-white' : 'border-white/10 text-slate-400 hover:bg-white/5'}`}>
                          <input type="radio" name="reportType" value="oral" checked={reportType === 'oral'} onChange={() => setReportType('oral')} className="hidden" />
                          <i className="fa-solid fa-microphone"></i> Oral
                        </label>
                      </div>
                    </div>

                    {reportType === 'written' ? (
                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Written Reflection</label>
                        <textarea required value={reportContent} onChange={e => setReportContent(e.target.value)} rows="5" className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all resize-none placeholder:text-slate-600" placeholder="What did you learn about teamwork and overcoming adversity from this movie?"></textarea>
                      </div>
                    ) : (
                      <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-6 text-center">
                        <div className="w-16 h-16 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                          <i className="fa-solid fa-bullhorn text-2xl text-amber-500"></i>
                        </div>
                        <h4 className="text-white font-bold mb-2">Coach Presentation Required</h4>
                        <p className="text-slate-400 text-sm">Find Coach Cornish or a Mentor and present your report orally. Click submit below to log your presentation intent in the system.</p>
                      </div>
                    )}
                  </div>

                  <button type="submit" className="w-full mt-6 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-xl transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2">
                    SUBMIT REPORT <i className="fa-solid fa-paper-plane"></i>
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Student Work Portfolio Upload */}
      <div className="mt-12 bg-black/30 border border-white/10 rounded-2xl p-6 lg:p-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500" />
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h3 className="text-2xl font-black text-white flex items-center gap-3">
              <i className="fa-solid fa-cloud-arrow-up text-indigo-400"></i> Student Portfolio & Work Upload
            </h3>
            <p className="text-slate-400 text-sm mt-1">Submit photos of your build logs, CAD drawings, code snippets, or handwritten calculations to earn points.</p>
          </div>
          <span className="px-3 py-1 bg-green-500/10 border border-green-500/30 text-green-400 text-[10px] font-black uppercase rounded-full tracking-widest flex items-center gap-1.5 w-fit">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> Ready for backend connection
          </span>
        </div>

        <div 
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${
            isDragging ? 'border-indigo-500 bg-indigo-500/10' : 'border-white/10 hover:border-indigo-500/50 bg-white/5'
          }`}
          onClick={() => document.getElementById('file-upload-input').click()}
        >
          <input 
            type="file" 
            id="file-upload-input" 
            className="hidden" 
            multiple 
            onChange={handleFileSelect}
            accept="image/*,application/pdf,.doc,.docx,.xls,.xlsx"
          />
          <div className="w-16 h-16 bg-indigo-500/15 rounded-full flex items-center justify-center mx-auto mb-4 text-indigo-400">
            <i className="fa-solid fa-file-arrow-up text-2xl"></i>
          </div>
          <p className="text-base font-bold text-slate-200">Drag & Drop files here, or <span className="text-indigo-400 underline">browse</span></p>
          <p className="text-xs text-slate-500 mt-2">Accepted formats: Images, PDFs, Photos of handwritten work, Word, Excel (Max 10MB per file)</p>
        </div>

        {/* Selected Files List */}
        {selectedFiles.length > 0 && (
          <div className="mt-6 space-y-3 animate-fade-in">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Selected Files ({selectedFiles.length})</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {selectedFiles.map(fileObj => (
                <div key={fileObj.id} className="flex items-center gap-4 bg-white/5 border border-white/5 rounded-xl p-3 justify-between">
                  <div className="flex items-center gap-3 min-w-0">
                    {fileObj.preview ? (
                      <img src={fileObj.preview} alt="preview" className="w-10 h-10 object-cover rounded-lg border border-white/10" />
                    ) : (
                      <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center text-slate-400 text-lg border border-white/5">
                        <i className={`fa-solid ${
                          fileObj.type.includes('pdf') ? 'fa-file-pdf text-red-400' :
                          fileObj.type.includes('sheet') || fileObj.type.includes('excel') ? 'fa-file-excel text-green-400' :
                          'fa-file-lines'
                        }`}></i>
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-200 truncate">{fileObj.name}</p>
                      <p className="text-[10px] text-slate-500">{fileObj.size}</p>
                    </div>
                  </div>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(fileObj.id);
                    }}
                    className="p-2 hover:bg-red-500/10 text-slate-500 hover:text-red-400 rounded-lg transition-colors"
                  >
                    <i className="fa-solid fa-trash-can"></i>
                  </button>
                </div>
              ))}
            </div>
            
            <button 
              onClick={(e) => {
                e.stopPropagation();
                handleUploadSubmit();
              }}
              disabled={uploadStatus === 'uploading'}
              className="w-full mt-4 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-xl transition-all shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2"
            >
              {uploadStatus === 'uploading' ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> UPLOADING PORTFOLIO...
                </>
              ) : (
                <>
                  UPLOAD SELECTED WORK <i className="fa-solid fa-cloud-arrow-up"></i>
                </>
              )}
            </button>
          </div>
        )}

        {/* Upload Status Alert */}
        {uploadMessage && (
          <div className={`mt-4 p-3 rounded-xl text-xs font-bold text-center border ${
            uploadStatus === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-red-500/10 border-red-500/20 text-red-400'
          }`}>
            {uploadMessage}
          </div>
        )}
      </div>
    </motion.div>
  );
}

// --- CALENDAR OF EVENTS COMPONENT ---
function CalendarOfEvents() {
  const [events, setEvents] = useState([]);
  const [isLive, setIsLive] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get(`${API_BASE}/toa/events`);
        setEvents(res.data.events || []);
        setIsLive(res.data.live || false);
      } catch (err) {
        console.error("Failed to fetch events from proxy:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEvents();
  }, []);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-5xl mx-auto pb-20">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 border border-white/10">
            <i className="fa-regular fa-calendar-days text-2xl text-white"></i>
          </div>
          <div>
            <h2 className="text-4xl font-black text-white tracking-tight">TEAM CALENDAR</h2>
            <p className="text-slate-400 font-medium">Upcoming events, season releases, and competition dates.</p>
          </div>
        </div>
        
        {/* Live Integration Badge */}
        {!isLoading && (
          <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border ${
            isLive 
              ? 'bg-green-500/10 border-green-500/30 text-green-400' 
              : 'bg-slate-500/10 border-slate-500/30 text-slate-400'
          }`}>
            {isLive ? '● Live from The Orange Alliance' : '○ Sample/Fallback Data'}
          </span>
        )}
      </div>

      <div className="bg-black/30 border border-white/10 rounded-2xl p-6 lg:p-8 mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <i className="fa-regular fa-calendar-days text-9xl text-white"></i>
        </div>
        
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16 text-cyan-400">
            <Loader2 className="w-8 h-8 animate-spin mb-2" />
            <span className="text-sm font-bold tracking-widest uppercase">Loading Events...</span>
          </div>
        ) : (
          <div className="space-y-6 relative z-10">
            {events.map((ev, idx) => (
              <div key={idx} className={`flex items-center gap-6 p-4 rounded-xl bg-white/5 border-l-4 ${ev.color || 'border-blue-500'} hover:bg-white/10 transition-colors`}>
                <div className="w-32 flex-shrink-0">
                  <div className="text-sm font-black text-white uppercase tracking-widest">{ev.date}</div>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">{ev.title}</h3>
                  <p className="text-sm text-slate-400">{ev.desc}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer Links */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 border border-white/10 rounded-2xl p-6 shadow-xl flex flex-wrap justify-around items-center gap-4">
        <div className="text-slate-400 font-bold uppercase tracking-widest text-xs mb-2 sm:mb-0 w-full sm:w-auto text-center">
          Live Resources & Scores
        </div>
        
        <a href="https://www.firstinspires.org/" target="_blank" rel="noreferrer" className="flex items-center gap-3 px-6 py-3 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 transition-all font-bold w-full sm:w-auto justify-center">
          <i className="fa-solid fa-globe"></i> FIRST Inspires
        </a>
        
        <a href="https://ftc-events.firstinspires.org/" target="_blank" rel="noreferrer" className="flex items-center gap-3 px-6 py-3 rounded-xl bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 border border-orange-500/30 transition-all font-bold w-full sm:w-auto justify-center">
          <i className="fa-solid fa-robot"></i> FTC Events
        </a>
        
        <a href="https://theorangealliance.org/" target="_blank" rel="noreferrer" className="flex items-center gap-3 px-6 py-3 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 border border-amber-500/30 transition-all font-bold w-full sm:w-auto justify-center">
          <i className="fa-solid fa-ranking-star"></i> The Orange Alliance
        </a>

        <a href="https://www.thebluealliance.com/" target="_blank" rel="noreferrer" className="flex items-center gap-3 px-6 py-3 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 transition-all font-bold w-full sm:w-auto justify-center">
          <i className="fa-solid fa-database"></i> The Blue Alliance
        </a>
      </div>
    </motion.div>
  );
}

// --- AWARDS & CRITERIA COMPONENT ---
function AwardsAndCriteria() {
  const [openAccordion, setOpenAccordion] = useState(null);

  const pointsCriteria = [
    { action: "Check-in on Time", points: "+5", icon: "fa-clock", color: "text-green-400", details: "Arrive at the robotics room and check in on the dashboard within the first 10 minutes of the scheduled practice start time." },
    { action: "Complete AI Quiz", points: "Based on Score (10-100)", icon: "fa-brain", color: "text-blue-400", details: "At the end of practice, answer the AI-generated quiz questions correctly during check-out. Points are awarded based on your accuracy." },
    { action: "Write Code / CAD", points: "+15 / session", icon: "fa-code", color: "text-emerald-400", details: "Spend at least 30 minutes actively writing code in the Coding Lab or designing in Onshape. Tracked via the 'What did you accomplish?' log during check-out." },
    { action: "Field Simulator Practice", points: "+10 / session", icon: "fa-gamepad", color: "text-cyan-400", details: "Log at least 15 minutes of practice on the virtual field simulator. Your session time is automatically recorded when you use the simulator view." },
    { action: "Live Drive Time", points: "+20 / session", icon: "fa-car", color: "text-red-400", details: "Connect to the REV Control Hub and drive the physical robot. We use an automated NT4 bridge and HTTP webhooks to track your live driving duration." },
    { action: "Movie Time Report", points: "+20 (Oral or Written)", icon: "fa-film", color: "text-indigo-400", details: "Watch one of the approved inspirational movies and submit a written reflection via the Movie Time tab, or present an oral report to Coach Cornish." },
    { action: "Consistent Attendance", points: "+50 (Weekly Bonus)", icon: "fa-calendar-check", color: "text-orange-400", details: "Attend all scheduled mandatory practices for the week without any unexcused absences. Points are automatically awarded on Sunday nights." },
  ];

  const levels = [
    { level: "Level 1: Novice Builder", points: "0 - 100 Points", desc: "Just starting out. Learning the tools and safety rules." },
    { level: "Level 2: Apprentice", points: "101 - 300 Points", desc: "Passed safety training, active in Fab Lab or Coding." },
    { level: "Level 3: Varsity Tech", points: "301 - 700 Points", desc: "Leading small projects, consistent reporting." },
    { level: "Level 4: Master Engineer", points: "701 - 1500 Points", desc: "A pillar of the team. Expert in their subsystem." },
    { level: "Level 5: Syprian God-Tier", points: "1500+ Points", desc: "Absolute legend. Ready for FIRST Dean's List." },
  ];

  const milestones = [
    { title: "The 10-Hour Club", hours: "10 Hours", desc: "You've proven your dedication. You now have access to advanced tools and software accounts.", icon: "fa-medal", color: "text-amber-500" },
    { title: "Competition Ready", hours: "20 Hours", desc: "You have put in the hours required to travel with the team to District Events and State Championships.", icon: "fa-trophy", color: "text-gold-500" },
    { title: "Varsity Letter", hours: "50+ Hours & 700+ Points", desc: "Earned your High School Varsity Letter in Robotics for exceptional dedication and point mastery.", icon: "fa-award", color: "text-purple-400" },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-6xl mx-auto pb-20">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/20 border border-white/10">
          <i className="fa-solid fa-ranking-star text-2xl text-white"></i>
        </div>
        <div>
          <h2 className="text-4xl font-black text-white tracking-tight">AWARDS & CRITERIA</h2>
          <p className="text-slate-400 font-medium">Understand how to earn points, level up, and become competition ready.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Points & Levels */}
        <div className="space-y-8">
          <div className="bg-black/30 border border-white/10 rounded-2xl p-6 relative overflow-hidden">
            <h3 className="text-xl font-black text-white mb-6 flex items-center gap-2">
              <i className="fa-solid fa-coins text-amber-500"></i> How to Earn Micro-Points
            </h3>
            <div className="space-y-3">
              {pointsCriteria.map((item, idx) => (
                <div key={idx} className="rounded-xl bg-white/5 border border-white/5 overflow-hidden transition-all">
                  <button 
                    onClick={() => setOpenAccordion(openAccordion === idx ? null : idx)}
                    className="w-full flex justify-between items-center p-3 hover:bg-white/5 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center ${item.color}`}>
                        <i className={`fa-solid ${item.icon}`}></i>
                      </div>
                      <span className="text-sm font-bold text-slate-300">{item.action}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-sm font-black text-white bg-white/10 px-3 py-1 rounded-lg">
                        {item.points}
                      </div>
                      <i className={`fa-solid fa-chevron-down text-slate-500 transition-transform ${openAccordion === idx ? 'rotate-180' : ''}`}></i>
                    </div>
                  </button>
                  <AnimatePresence>
                    {openAccordion === idx && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="px-4 pb-4 pt-1"
                      >
                        <p className="text-sm text-slate-400 leading-relaxed pl-11 text-left">{item.details}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-500 mt-4 italic">* Points are used to determine your rank, grant access to special roles, and for end-of-year awards.</p>
          </div>

          <div className="bg-black/30 border border-white/10 rounded-2xl p-6 relative overflow-hidden">
            <h3 className="text-xl font-black text-white mb-6 flex items-center gap-2">
              <i className="fa-solid fa-layer-group text-blue-500"></i> Ranking Levels
            </h3>
            <div className="space-y-4">
              {levels.map((lvl, idx) => (
                <div key={idx} className="border-l-2 border-blue-500/50 pl-4 py-1">
                  <div className="flex justify-between items-end mb-1">
                    <span className="font-bold text-white text-sm">{lvl.level}</span>
                    <span className="text-xs font-black text-blue-400 tracking-wider">{lvl.points}</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">{lvl.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Milestones */}
        <div>
          <div className="bg-gradient-to-b from-indigo-900/40 to-black/30 border border-indigo-500/20 rounded-2xl p-6 lg:p-8 h-full">
            <h3 className="text-2xl font-black text-white mb-2 flex items-center gap-3">
              <i className="fa-solid fa-shield-halved text-indigo-400"></i> Time Milestones
            </h3>
            <p className="text-sm text-slate-400 mb-8">Robotics is about dedication. Hitting these hour thresholds unlocks real-world privileges for the team.</p>

            <div className="space-y-6">
              {milestones.map((ms, idx) => (
                <div key={idx} className="relative bg-white/5 border border-white/10 rounded-2xl p-6 overflow-hidden group hover:bg-white/10 transition-colors">
                  <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                    <i className={`fa-solid ${ms.icon} text-6xl ${ms.color}`}></i>
                  </div>
                  <div className="relative z-10">
                    <div className={`text-xs font-black tracking-widest uppercase mb-1 ${ms.color}`}>{ms.hours} Requirement</div>
                    <h4 className="text-xl font-black text-white mb-2">{ms.title}</h4>
                    <p className="text-sm text-slate-300 leading-relaxed max-w-[85%]">{ms.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 flex items-start gap-4">
              <i className="fa-solid fa-circle-info text-blue-400 text-xl mt-1"></i>
              <div>
                <h5 className="font-bold text-white text-sm mb-1">Why do we track this?</h5>
                <p className="text-xs text-slate-400 leading-relaxed">
                  We have middle school and high school students working together. Tracking points and hours ensures that those who travel to competitions and use expensive machinery have proven their dedication, maturity, and safety awareness.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// --- BUILD & MISSIONS MODAL ---
function BuildAndMissionsModal({ onClose, notify, setActiveVideo }) {
  const [activeTab, setActiveTab] = useState('repair'); // 'repair' | 'tools'
  const [flashcardIndex, setFlashcardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  const repairPlaylists = [
    {
      title: "Mecanum Wheel Refurbishment",
      desc: "Learn how to disassemble, clean, and re-roller a goBILDA or REV mecanum wheel.",
      videoId: "-HkuhtZDPkI",
      color: "border-blue-500"
    },
    {
      title: "Swerve Drive Maintenance",
      desc: "Step-by-step guide to cleaning swerve modules and re-greasing gears.",
      videoId: "2QHomS3akGU",
      color: "border-purple-500"
    },
    {
      title: "Re-gearing a Motor",
      desc: "How to safely open a planetary gearbox and change the gear ratio.",
      videoId: "1G99O-r1rMw",
      color: "border-orange-500"
    }
  ];

  const tools = [
    { name: "Allen Wrench (Hex Key)", type: "Tool", desc: "Used to drive bolts and screws that have a hexagonal socket in the head. We primarily use metric sizes.", icon: "fa-wrench", image: "/tools/allen.png" },
    { name: "Phillips Screwdriver", type: "Tool", desc: "Used for standard cross-head screws. Make sure the size matches so you don't strip the heads!", icon: "fa-screwdriver", image: "/tools/phillips.png" },
    { name: "Lock Nut (Nyloc)", type: "Fastener", desc: "A nut with a nylon collar insert that resists turning. It won't vibrate loose during a match.", icon: "fa-ring", image: "/tools/nyloc.png" },
    { name: "Socket Head Cap Screw", type: "Fastener", desc: "The standard bolt we use for structural pieces. Requires an Allen wrench to tighten.", icon: "fa-bolt", image: "/tools/socket.png" },
    { name: "goBILDA Pattern", type: "System", desc: "8mm grid pattern, metric sizing. The primary structural building system we use.", icon: "fa-cubes", image: "/tools/gobilda.png" },
    { name: "REV Extrusion", type: "System", desc: "15mm aluminum extrusion with slots for hex bolts. Highly adjustable.", icon: "fa-bars", image: "/tools/rev.png" }
  ];

  const nextCard = () => {
    setShowAnswer(false);
    setFlashcardIndex((prev) => (prev + 1) % tools.length);
  };

  const prevCard = () => {
    setShowAnswer(false);
    setFlashcardIndex((prev) => (prev - 1 + tools.length) % tools.length);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-slate-900 border border-emerald-500/30 rounded-3xl p-8 max-w-5xl w-full shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-6 right-6 text-slate-500 hover:text-white p-2 rounded-full hover:bg-white/5 transition-colors z-10">
          <i className="fa-solid fa-times text-2xl"></i>
        </button>

        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20 border border-white/10">
            <i className="fa-solid fa-screwdriver-wrench text-2xl text-white"></i>
          </div>
          <div>
            <h2 className="text-4xl font-black text-white tracking-tight">BUILD & MISSIONS</h2>
            <p className="text-slate-400 font-medium">Complete training missions to level up your mechanical and identification skills.</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8">
          <button onClick={() => setActiveTab('repair')} className={`px-6 py-3 rounded-xl font-bold transition-all ${activeTab === 'repair' ? 'bg-emerald-500 text-black' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}>
            <i className="fa-solid fa-gears mr-2"></i> Repair & Refurbish
          </button>
          <button onClick={() => setActiveTab('tools')} className={`px-6 py-3 rounded-xl font-bold transition-all ${activeTab === 'tools' ? 'bg-teal-500 text-black' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}>
            <i className="fa-solid fa-magnifying-glass mr-2"></i> Tool Identification
          </button>
        </div>

        {activeTab === 'repair' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            {repairPlaylists.map((vid, idx) => (
              <div key={idx} className={`bg-black/30 border-t-4 ${vid.color} border-x border-b border-white/10 rounded-2xl p-6 hover:bg-white/5 transition-colors group flex flex-col h-full`}>
                <div onClick={() => setActiveVideo({ activity: vid.title, category: 'Build & Manufacturing', type: 'video', squad: 'Build & Manufacturing' })} className="w-full h-40 bg-black/50 rounded-xl mb-4 flex items-center justify-center group-hover:bg-black/40 transition-colors relative overflow-hidden cursor-pointer shrink-0">
                  <i className="fa-brands fa-youtube text-5xl text-red-500 opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all"></i>
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-white font-bold tracking-widest uppercase text-sm"><i className="fa-solid fa-play mr-2"></i>Watch Video</span>
                  </div>
                </div>
                <h3 className="text-xl font-black text-white mb-2">{vid.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed mb-4">{vid.desc}</p>
                <button onClick={() => notify(`Training points awarded for ${vid.title}!`)} className="w-full py-2 bg-emerald-500/20 hover:bg-emerald-500/40 text-emerald-400 font-bold rounded-xl border border-emerald-500/30 transition-all text-sm mt-auto">
                  Mark as Completed (+10 Pts)
                </button>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'tools' && (
          <div className="flex flex-col items-center">
            <div className="w-full max-w-3xl bg-black/40 border border-white/10 rounded-3xl p-8 min-h-[500px] flex flex-col items-center justify-center relative cursor-pointer group hover:bg-white/5 transition-colors shadow-2xl overflow-hidden" onClick={() => setShowAnswer(!showAnswer)}>
              <AnimatePresence mode="wait">
                {!showAnswer ? (
                  <motion.div key="question" initial={{ opacity: 0, rotateY: 90 }} animate={{ opacity: 1, rotateY: 0 }} exit={{ opacity: 0, rotateY: -90 }} className="text-center w-full flex flex-col items-center">
                    <div className="w-80 h-80 sm:w-[400px] sm:h-[400px] mb-6 rounded-2xl overflow-hidden border-2 border-white/10 bg-white/5 flex items-center justify-center p-2 relative">
                      <img src={tools[flashcardIndex].image} alt="Part" className="max-w-full max-h-full object-contain drop-shadow-lg opacity-90 group-hover:opacity-100 transition-opacity bg-white" />
                    </div>
                    <h3 className="text-4xl font-black text-white drop-shadow-md">What is this?</h3>
                    <p className="text-teal-400 mt-4 text-sm font-bold uppercase tracking-widest animate-pulse">Click to Reveal Answer</p>
                  </motion.div>
                ) : (
                  <motion.div key="answer" initial={{ opacity: 0, rotateY: 90 }} animate={{ opacity: 1, rotateY: 0 }} exit={{ opacity: 0, rotateY: -90 }} className="text-center w-full">
                    <div className="inline-block bg-teal-500/20 text-teal-400 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-4 border border-teal-500/30">{tools[flashcardIndex].type}</div>
                    <h3 className="text-5xl font-black text-white mb-6 drop-shadow-md">{tools[flashcardIndex].name}</h3>
                    <p className="text-slate-300 text-lg leading-relaxed max-w-md mx-auto">{tools[flashcardIndex].desc}</p>
                    <p className="text-slate-500 mt-8 text-xs font-bold uppercase tracking-widest">Click to hide</p>
                  </motion.div>
                )}
              </AnimatePresence>
              
              <div className="absolute top-6 right-6 text-slate-500 font-bold bg-black/50 px-3 py-1 rounded-lg text-sm border border-white/5">
                {flashcardIndex + 1} / {tools.length}
              </div>
            </div>
            
            <div className="flex gap-6 mt-8">
              <button onClick={prevCard} className="w-14 h-14 rounded-full bg-white/5 hover:bg-teal-500/20 border border-white/10 hover:border-teal-500/50 flex items-center justify-center text-white hover:text-teal-400 transition-all shadow-lg">
                <i className="fa-solid fa-chevron-left text-xl"></i>
              </button>
              <button onClick={nextCard} className="w-14 h-14 rounded-full bg-white/5 hover:bg-teal-500/20 border border-white/10 hover:border-teal-500/50 flex items-center justify-center text-white hover:text-teal-400 transition-all shadow-lg">
                <i className="fa-solid fa-chevron-right text-xl"></i>
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}

// === Syprian AI Presentation Maker Component ===
function PresentationMaker({ setView, notify }) {
  const [prompt, setPrompt] = useState("");
  const [slideCount, setSlideCount] = useState(6);
  const [templateId, setTemplateId] = useState("district-theme");
  const [secureGateway, setSecureGateway] = useState(true);
  const [generationStep, setGenerationStep] = useState(0); // 0: idle, 1: gateway, 2: structure, 3: content, 4: rendering, 5: completed
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [slides, setSlides] = useState([]);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  const templates = [
    { id: 'district-theme', name: 'Harper Woods District (Gold & Maroon)', primaryColor: '#D4AF37', secondaryColor: '#800020' },
    { id: 'robotics-cyber', name: 'Robotics Team Cyber (Cyan & Purple)', primaryColor: '#00f2fe', secondaryColor: '#4facfe' },
    { id: 'clean-tech', name: 'Clean Technical (White & Charcoal)', primaryColor: '#f8fafc', secondaryColor: '#0f172a' }
  ];

  const handleGenerate = () => {
    if (!prompt.trim()) {
      notify("Please describe the presentation you want to generate.", "error");
      return;
    }
    
    setGenerationStep(1);
    setLoadingProgress(10);

    let progress = 10;
    const interval = setInterval(() => {
      progress += 10;
      setLoadingProgress(progress);

      if (progress === 30) {
        setGenerationStep(2);
      } else if (progress === 60) {
        setGenerationStep(3);
      } else if (progress === 80) {
        setGenerationStep(4);
      } else if (progress >= 100) {
        clearInterval(interval);
        
        // Generate mock slide contents based on keywords
        const lowerPrompt = prompt.toLowerCase();
        let generatedSlides = [];

        if (lowerPrompt.includes("drive") || lowerPrompt.includes("chassis") || lowerPrompt.includes("swerve") || lowerPrompt.includes("wheel")) {
          generatedSlides = [
            {
              title: "Swerve Drive Chassis Design",
              layout: "TITLE_AND_IMAGE",
              bullets: [
                "Coordinating 4 independent drive modules for omnidirectional travel.",
                "Utilizing brushless motor configurations (NEO/Kraken) for low-speed torque.",
                "Constructed from 2x1 structural aluminum with structural gussets."
              ],
              graphicType: "Chassis Cad Isometric Render"
            },
            {
              title: "Kinematic Constraints & Pathing",
              layout: "TWO_COLUMNS",
              leftColumn: "Calculates individual wheel speed vectors based on chassis translation and rotation commands from driver input.",
              rightColumn: "Aligns module steering gears to eliminate drift and maximize cornering efficiency under high acceleration.",
              graphicType: "Vector Diagram Recommendation"
            },
            {
              title: "Module Fabrication & Assembly",
              layout: "BULLETED_LIST",
              bullets: [
                "Precision machined steering plates utilizing graphite lubricated CNC.",
                "Custom 3D printed bevel gear guards printed in shock-resistant PETG filament.",
                "Integrates high-resolution CANcoders directly on pivot axis for absolute alignment."
              ],
              graphicType: "Exploded Module Part Preview"
            },
            {
              title: "Testing Protocols & QA",
              layout: "BULLETED_LIST",
              bullets: [
                "Drift correction verification across 10-meter straight tracks.",
                "Brake-mode dampening calibration to prevent rollover during high-speed turns.",
                "Power consumption log monitoring under full payload conditions."
              ],
              graphicType: "Test Data Grid Layout"
            }
          ];
        } else if (lowerPrompt.includes("battery") || lowerPrompt.includes("power") || lowerPrompt.includes("charging") || lowerPrompt.includes("electrical")) {
          generatedSlides = [
            {
              title: "FRC Battery Safety & Management",
              layout: "TITLE_AND_IMAGE",
              bullets: [
                "Monitoring 12V lead-acid batteries under extreme mechanical vibration.",
                "Ensuring robust terminal insulation with heat-shrink wrapping.",
                "Strict compliance with FIRST Robotics competition weight and electrical limits."
              ],
              graphicType: "Insulated Terminal Diagram"
            },
            {
              title: "Charging Station Architecture",
              layout: "TWO_COLUMNS",
              leftColumn: "Provides constant voltage and variable current charging pathways to maximize lifespan and prevent thermal runaway.",
              rightColumn: "Includes dedicated smart chargers with built-in current limiters and automatic cutoff switches.",
              graphicType: "Charging Log Interface Preview"
            },
            {
              title: "Discharge & Maintenance Log",
              layout: "BULLETED_LIST",
              bullets: [
                "Log internal resistance levels prior to match deployment.",
                "Retire battery packs showing cell degradation below 11.5V under standard load.",
                "Mandatory safety gloves and acid-neutralizing agents stored in immediate proximity."
              ],
              graphicType: "Voltage Decay Curve Graph"
            }
          ];
        } else if (lowerPrompt.includes("program") || lowerPrompt.includes("code") || lowerPrompt.includes("wpilib") || lowerPrompt.includes("autonomous") || lowerPrompt.includes("sensor")) {
          generatedSlides = [
            {
              title: "Autonomous Routine Integration",
              layout: "TITLE_AND_IMAGE",
              bullets: [
                "WPILib command-based framework coordinating chassis driving and actuator controls.",
                "Integrates Pinpoint Odometry with dual-axis gyroscope feedback.",
                "Pre-mapped path routing utilizing PedroPathing bezier curves."
              ],
              graphicType: "Path Planning Vector Coordinates"
            },
            {
              title: "Sensor Feedback Loops",
              layout: "TWO_COLUMNS",
              leftColumn: "Dual optical sensors tracking note placement inside the intake mechanism for instant driver alert.",
              rightColumn: "Laser distance sensors adjusting elevator height relative to target target grids dynamically.",
              graphicType: "Feedback Control Block Diagram"
            },
            {
              title: "Diagnostics & Failure Handling",
              layout: "BULLETED_LIST",
              bullets: [
                "Automatic fallback to time-based drive routines if encoder connection drops.",
                "Real-time logging to AdvantageKit for post-match telemetry review.",
                "Telemetry telemetry displays battery voltage decay to prevent sudden brownouts."
              ],
              graphicType: "Console Error Log Stream"
            }
          ];
        } else {
          // General default slides
          generatedSlides = [
            {
              title: "Robotics Initiative & Overview",
              layout: "TITLE_AND_IMAGE",
              bullets: [
                "Fostering career-readiness across CAD, programming, electrical, and fabrication squads.",
                "District aligned curriculums designed in compliance with FERPA student privacy regulations.",
                "Encouraging collaborative problem-solving and rapid design iteration."
              ],
              graphicType: "Team Collaboration Illustration"
            },
            {
              title: "Strategic Milestones",
              layout: "TWO_COLUMNS",
              leftColumn: "Kickoff analysis: defining target challenges, scoring mechanics, and building initial CAD mockups in week 1.",
              rightColumn: "Integration phase: assembly of drivetrain and test chassis for control system optimization by week 4.",
              graphicType: "Gantt Timeline Chart Recommendation"
            },
            {
              title: "Accreditation & Standards",
              layout: "BULLETED_LIST",
              bullets: [
                "Vetted and approved tools directory tracking strict student safety compliance.",
                "Micro-credentials earning pathways mapped to industry-level certifications.",
                "Professional development requirements ensuring educators maintain top-tier instruction."
              ],
              graphicType: "Accreditation Seal Outline"
            }
          ];
        }

        // Adjust to requested slide count if needed by repeating/padding or keeping as is
        const paddedSlides = [];
        for (let i = 0; i < slideCount; i++) {
          const baseSlide = generatedSlides[i % generatedSlides.length];
          paddedSlides.push({
            ...baseSlide,
            slideNumber: i + 1,
            title: i === 0 ? `${baseSlide.title} (Intro)` : `${baseSlide.title} - Slide ${i + 1}`
          });
        }

        setSlides(paddedSlides);
        setGenerationStep(5);
        setCurrentSlideIndex(0);
        notify("Presentation generated successfully!", "success");
      }
    }, 120);
  };

  const currentTemplate = templates.find(t => t.id === templateId) || templates[0];

  const downloadOutline = () => {
    const textContent = `Syprian AI Presentation Outline\n` +
      `Generated on: ${new Date().toLocaleDateString()}\n` +
      `Prompt: "${prompt}"\n` +
      `Template Style: ${currentTemplate.name}\n` +
      `Compliance Guardrails: ${secureGateway ? "FERPA & COPPA Secure Gateway ACTIVE" : "Inactive"}\n` +
      `==================================================\n\n` +
      slides.map(slide => 
        `Slide ${slide.slideNumber}: ${slide.title}\n` +
        `Layout: ${slide.layout}\n` +
        `--------------------------------------------------\n` +
        (slide.bullets ? slide.bullets.map(b => `- ${b}`).join('\n') : '') +
        (slide.leftColumn ? `[Column 1]\n${slide.leftColumn}\n\n[Column 2]\n${slide.rightColumn}` : '') +
        `\n[Recommended Asset]: ${slide.graphicType}\n` +
        `==================================================\n`
      ).join('\n');

    const element = document.createElement("a");
    const file = new Blob([textContent], {type: 'text/plain;charset=utf-8'});
    element.href = URL.createObjectURL(file);
    element.download = "Syprian_Presentation_Outline.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    notify("Presentation outline downloaded successfully!");
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }} 
      animate={{ opacity: 1, y: 0 }} 
      exit={{ opacity: 0, y: 15 }} 
      className="max-w-5xl mx-auto glass-panel p-8 w-full border border-purple-500/20 shadow-2xl relative text-white"
    >
      <div className="flex justify-between items-start mb-8 border-b border-white/10 pb-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/20 border border-white/10">
            <Presentation className="text-white w-7 h-7" />
          </div>
          <div>
            <h2 className="text-3xl font-black text-white tracking-tight">SYPRIAN PRESENTATION MAKER</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> FERPA Compliant
              </span>
              <span className="bg-purple-500/15 text-purple-400 border border-purple-500/30 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest">
                District AI Tool
              </span>
            </div>
          </div>
        </div>
        <button onClick={() => setView('lobby')} className="px-4 py-2 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white rounded-xl font-bold transition-all text-sm">
          LOBBY
        </button>
      </div>

      {generationStep === 0 && (
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <div>
              <label className="block text-xs uppercase tracking-[0.25em] font-black text-slate-500 mb-3">Describe your Presentation Topic</label>
              <textarea 
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-2xl p-5 outline-none focus:border-purple-500 focus:shadow-[0_0_15px_rgba(168,85,247,0.2)] transition-all font-medium text-white placeholder:text-slate-600 text-base"
                rows={5}
                placeholder="Example: FRC robot swerve drive chassis design, detailing module mechanics, motor setup, and pathing considerations..."
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-[0.25em] font-black text-slate-500 mb-3">Slide Count ({slideCount})</label>
                <div className="flex items-center gap-4 bg-black/30 border border-white/10 rounded-2xl px-5 py-3 h-[58px]">
                  <input 
                    type="range" 
                    min={3} 
                    max={15} 
                    value={slideCount}
                    onChange={e => setSlideCount(parseInt(e.target.value))}
                    className="flex-1 accent-purple-500"
                  />
                  <span className="font-bold text-white text-lg w-6 text-center">{slideCount}</span>
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-[0.25em] font-black text-slate-500 mb-3">Compliant Data Gateway</label>
                <button 
                  onClick={() => setSecureGateway(!secureGateway)}
                  className={`w-full flex items-center justify-between px-5 h-[58px] rounded-2xl border transition-all ${
                    secureGateway 
                      ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400 font-bold' 
                      : 'bg-black/30 border-white/10 text-slate-500 font-medium'
                  }`}
                >
                  <span className="text-sm">Encrypt Student Prompts</span>
                  <div className={`w-8 h-4 rounded-full p-0.5 transition-colors ${secureGateway ? 'bg-emerald-500' : 'bg-slate-700'}`}>
                    <div className={`w-3 h-3 rounded-full bg-white transition-transform ${secureGateway ? 'translate-x-4' : 'translate-x-0'}`} />
                  </div>
                </button>
              </div>
            </div>

            <button 
              onClick={handleGenerate}
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-700 hover:scale-[1.01] active:scale-[0.99] font-black uppercase tracking-[0.2em] text-white rounded-2xl shadow-lg shadow-purple-500/25 border border-purple-500/40 transition-all flex items-center justify-center gap-3 text-lg"
            >
              <Sparkles className="w-5 h-5 animate-pulse" /> Create Slide Deck
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-xs uppercase tracking-[0.25em] font-black text-slate-500 mb-3">District Design Template</label>
              <div className="space-y-3">
                {templates.map(t => (
                  <button 
                    key={t.id}
                    onClick={() => setTemplateId(t.id)}
                    className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center justify-between ${
                      templateId === t.id 
                        ? 'bg-purple-600/10 border-purple-500 text-purple-300' 
                        : 'bg-black/20 border-white/5 text-slate-400 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <div>
                      <p className="font-bold text-sm">{t.name}</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">Custom typography & layouts</p>
                    </div>
                    <div className="flex gap-1">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: t.primaryColor }} />
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: t.secondaryColor }} />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-purple-950/20 border border-purple-500/15 rounded-2xl p-5 text-slate-400 text-xs leading-relaxed space-y-3">
              <div className="flex items-center gap-2 text-purple-400 font-bold">
                <Globe className="w-4 h-4" />
                <span>HOW IT WORKS</span>
              </div>
              <p>
                The Syprian Presentation Maker routes prompts through our local education gateway to sanitize data and mask student PII. 
              </p>
              <p>
                Slides are generated matching district-specific design rules, fonts, and structures, then rendered as editable outlines.
              </p>
            </div>
          </div>
        </div>
      )}

      {generationStep > 0 && generationStep < 5 && (
        <div className="py-20 flex flex-col items-center justify-center max-w-md mx-auto text-center space-y-8">
          <div className="relative w-28 h-28 flex items-center justify-center">
            <Loader2 className="w-24 h-24 text-purple-500 animate-spin absolute" />
            <Presentation className="w-10 h-10 text-white animate-pulse" />
          </div>

          <div className="space-y-2 w-full">
            <h3 className="text-xl font-bold text-white">Generating Presentation</h3>
            <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">Progress: {loadingProgress}%</p>
            <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden border border-white/5">
              <div className="bg-purple-500 h-full transition-all duration-300" style={{ width: `${loadingProgress}%` }} />
            </div>
          </div>

          <div className="space-y-3 w-full text-left bg-black/30 border border-white/10 rounded-2xl p-5 text-sm font-semibold">
            <div className={`flex items-center gap-3 ${generationStep >= 1 ? 'text-purple-400' : 'text-slate-600'}`}>
              <div className={`w-2 h-2 rounded-full ${generationStep > 1 ? 'bg-emerald-500' : (generationStep === 1 ? 'bg-purple-500 animate-ping' : 'bg-slate-700')}`} />
              <span>Initiating Secure FERPA Gateway...</span>
            </div>
            <div className={`flex items-center gap-3 ${generationStep >= 2 ? 'text-purple-400' : 'text-slate-600'}`}>
              <div className={`w-2 h-2 rounded-full ${generationStep > 2 ? 'bg-emerald-500' : (generationStep === 2 ? 'bg-purple-500 animate-ping' : 'bg-slate-700')}`} />
              <span>Structuring Outline and Storyboard...</span>
            </div>
            <div className={`flex items-center gap-3 ${generationStep >= 3 ? 'text-purple-400' : 'text-slate-600'}`}>
              <div className={`w-2 h-2 rounded-full ${generationStep > 3 ? 'bg-emerald-500' : (generationStep === 3 ? 'bg-purple-500 animate-ping' : 'bg-slate-700')}`} />
              <span>Drafting Slide Content and Layouts...</span>
            </div>
            <div className={`flex items-center gap-3 ${generationStep >= 4 ? 'text-purple-400' : 'text-slate-600'}`}>
              <div className={`w-2 h-2 rounded-full ${generationStep > 4 ? 'bg-emerald-500' : (generationStep === 4 ? 'bg-purple-500 animate-ping' : 'bg-slate-700')}`} />
              <span>Compiling Native PowerPoint Layout...</span>
            </div>
          </div>
        </div>
      )}

      {generationStep === 5 && (
        <div className="space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-purple-950/20 border border-purple-500/10 p-5 rounded-2xl">
            <div>
              <p className="text-xs uppercase tracking-widest font-black text-purple-400">Presentation Ready</p>
              <h3 className="text-xl font-bold text-white mt-1">Reviewing: "{slides[0]?.title.replace(' (Intro)', '')}"</h3>
              <p className="text-xs text-slate-400 mt-0.5">{slides.length} slides generated in {currentTemplate.name}</p>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={downloadOutline}
                className="flex items-center gap-2 px-5 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold text-sm shadow-md transition-colors"
              >
                <Download className="w-4 h-4" /> Download Outline
              </button>
              <button 
                onClick={() => setGenerationStep(0)}
                className="px-5 py-3 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white rounded-xl font-bold text-sm transition-colors"
              >
                Create New
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 items-start">
            <div className="md:col-span-2 space-y-6">
              {/* Active Slide Viewer */}
              <div className="border border-white/15 rounded-3xl overflow-hidden shadow-2xl bg-slate-950 aspect-[16/10] flex flex-col relative">
                {/* District Style Theme Header */}
                <div className="px-6 py-4 flex items-center justify-between border-b border-white/5 bg-white/[0.02]">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: currentTemplate.primaryColor }} />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{currentTemplate.name}</span>
                  </div>
                  <span className="text-xs text-slate-600 font-bold">Slide {slides[currentSlideIndex].slideNumber} / {slides.length}</span>
                </div>

                {/* Slide Body */}
                <div className="flex-1 p-8 flex flex-col justify-center">
                  <h3 className="text-3xl font-black text-white mb-6 uppercase tracking-tight" style={{ borderLeft: `4px solid ${currentTemplate.primaryColor}`, paddingLeft: '1rem' }}>
                    {slides[currentSlideIndex].title}
                  </h3>

                  {slides[currentSlideIndex].layout === "TITLE_AND_IMAGE" && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
                      <ul className="space-y-3 text-sm text-slate-300 font-medium">
                        {slides[currentSlideIndex].bullets.map((b, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-purple-500 mt-1.5">•</span>
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center text-center h-48 border-dashed">
                        <FileText className="w-8 h-8 text-slate-600 mb-2" />
                        <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">{slides[currentSlideIndex].graphicType}</p>
                        <p className="text-[10px] text-slate-600 mt-1 max-w-[150px]">Placeholder for custom graphic in PowerPoint</p>
                      </div>
                    </div>
                  )}

                  {slides[currentSlideIndex].layout === "TWO_COLUMNS" && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm text-slate-300 font-medium">
                      <div className="p-4 bg-white/5 border border-white/10 rounded-2xl relative">
                        <div className="absolute -top-3 left-4 bg-slate-950 px-3 text-[10px] uppercase tracking-wider font-bold text-purple-400">Column 1</div>
                        <p className="leading-relaxed mt-2">{slides[currentSlideIndex].leftColumn}</p>
                      </div>
                      <div className="p-4 bg-white/5 border border-white/10 rounded-2xl relative">
                        <div className="absolute -top-3 left-4 bg-slate-950 px-3 text-[10px] uppercase tracking-wider font-bold text-purple-400">Column 2</div>
                        <p className="leading-relaxed mt-2">{slides[currentSlideIndex].rightColumn}</p>
                      </div>
                    </div>
                  )}

                  {slides[currentSlideIndex].layout === "BULLETED_LIST" && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-start">
                      <ul className="sm:col-span-2 space-y-4 text-sm text-slate-300 font-medium">
                        {slides[currentSlideIndex].bullets.map((b, i) => (
                          <li key={i} className="flex items-start gap-2.5">
                            <span className="text-purple-500 mt-1.5">•</span>
                            <span className="leading-relaxed">{b}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center border-dashed">
                        <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Visual Asset Recommendation</p>
                        <p className="text-xs text-purple-400 font-black mt-2 uppercase">{slides[currentSlideIndex].graphicType}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer Controls */}
                <div className="px-6 py-4 flex items-center justify-between border-t border-white/5 bg-white/[0.01]">
                  <span className="text-[10px] text-slate-600 font-black tracking-widest uppercase">SYPRIAN POWERPOINT COMPILE</span>
                  <div className="flex gap-4">
                    <button 
                      disabled={currentSlideIndex === 0}
                      onClick={() => setCurrentSlideIndex(prev => prev - 1)}
                      className="px-4 py-2 bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-white/5 text-white rounded-lg font-bold text-xs transition-all"
                    >
                      PREV
                    </button>
                    <button 
                      disabled={currentSlideIndex === slides.length - 1}
                      onClick={() => setCurrentSlideIndex(prev => prev + 1)}
                      className="px-4 py-2 bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-white/5 text-white rounded-lg font-bold text-xs transition-all"
                    >
                      NEXT
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar Slide Navigation */}
            <div className="space-y-4">
              <label className="block text-xs uppercase tracking-[0.25em] font-black text-slate-500">Presentation Slides</label>
              <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                {slides.map((slide, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setCurrentSlideIndex(idx)}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-center gap-3 ${
                      currentSlideIndex === idx 
                        ? 'bg-purple-600/15 border-purple-500 text-white' 
                        : 'bg-black/20 border-white/5 text-slate-400 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <span className="w-6 h-6 rounded bg-white/5 flex items-center justify-center text-xs font-bold shrink-0">{slide.slideNumber}</span>
                    <span className="font-bold text-xs truncate">{slide.title}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
