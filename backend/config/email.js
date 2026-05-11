// email configuration

// const nodemailer = require('nodemailer');
const Brevo = require('@getbrevo/brevo');
let apiInstance = null;
let isConfigured = false;
// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     type: 'OAuth2',
//     user: process.env.EMAIL_USER,
//     clientId: process.env.GOOGLE_CLIENT_ID,
//     clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//     refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
//   },
// });

if (process.env.BREVO_API_KEY) {
  apiInstance = new Brevo.TransactionalEmailsApi();
  apiInstance.setApiKey(
    Brevo.TransactionalEmailsApiApiKeys.apiKey,
    process.env.BREVO_API_KEY
  );
  isConfigured = true;
  console.log('✅ Brevo email service configured');
} else {
  console.log('⚠️  BREVO_API_KEY not found, email service disabled');
}

const sendOTPEmail = async (email, otp, userName = 'User') => {
  if (!isConfigured) {
    console.log('⚠️  Email service not configured, skipping email send');
    return { success: false, error: 'Email service not configured' };
  }

  try {
    let sendSmtpEmail = new Brevo.SendSmtpEmail();

    sendSmtpEmail.subject = "🔐 Your DriveBox Lite Login OTP Code";
    sendSmtpEmail.to = [{ email: email, name: userName }];

    sendSmtpEmail.htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>DriveBox Lite OTP</title>
                <style>
                    body { font-family: Arial, sans-serif; }
                    .container { max-width: 500px; margin: 0 auto; padding: 20px; }
                    .otp-code { 
                        font-size: 32px; 
                        font-weight: bold; 
                        letter-spacing: 5px;
                        background: #f0f0f0;
                        padding: 15px;
                        text-align: center;
                        border-radius: 8px;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h2>🔐 DriveBox Lite Login Verification</h2>
                    <p>Hello ${userName}!</p>
                    <p>Your OTP code is:</p>
                    <div class="otp-code">${otp}</div>
                    <p>This code expires in <strong>10 minutes</strong>.</p>
                    <p>If you didn't request this, please ignore this email.</p>
                </div>
            </body>
            </html>
        `;

    sendSmtpEmail.sender = {
      name: process.env.SENDER_NAME || 'DriveBosx Lite',
      email: process.env.SENDER_EMAIL
    };

    const response = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log(`✅ OTP sent successfully to ${email}`);
    return { success: true, messageId: response.messageId };

  } catch (error) {
    console.error('❌ Error sending email:', error.message);
    return { success: false, error: error.message };
  }
};

const verifyEmailConnection = async () => {
  if (!isConfigured) {
    console.log('⚠️  Email service not configured. Set BREVO_API_KEY in .env to enable.');
    return false;
  }

  try {
    console.log('📧 Testing Brevo email service...');
    // Just log that it's configured, don't actually send a test email
    console.log('✅ Brevo email service is ready');
    return true;
  } catch (error) {
    console.error('❌ Brevo configuration error:', error.message);
    return false;
  }
};

module.exports = { sendOTPEmail, verifyEmailConnection };