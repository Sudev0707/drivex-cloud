const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `DriveX App <${process.env.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    html: options.html,
  };

  await transporter.sendMail(mailOptions);
};

const sendOTPEmail = async (email, otp) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">DriveX Login Verification</h2>
      <p>Your OTP for login is:</p>
      <h1 style="color: #4285F4; font-size: 32px; letter-spacing: 5px;">${otp}</h1>
      <p>This OTP is valid for 10 minutes.</p>
      <p>If you didn't request this, please ignore this email.</p>
      <hr />
      <p style="color: #666; font-size: 12px;">DriveX App - Secure Workspace</p>
    </div>
  `;

  await sendEmail({
    email: email,
    subject: 'DriveX Login OTP',
    html: html,
  });
};

module.exports = { sendEmail, sendOTPEmail };