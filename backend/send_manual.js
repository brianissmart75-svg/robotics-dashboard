const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.hostinger.com',
  port: 465,
  secure: true,
  auth: {
    user: 'coach@hwsroboteam.org',
    pass: 'HWS!R0b0team2026#'
  }
});

const send = async () => {
  const firstName = 'Ronald';
  const requestedPrefix = 'ronald.cornish';
  const correctedEmail = 'ronald.cornish@hwschools.org';

  try {
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
      `
    });
    console.log('Mail sent successfully!');
  } catch (err) {
    console.error(err);
  }
};

send();
