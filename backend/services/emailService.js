// backend/services/emailService.js
// axios directly to call Brevo's API is actually better for Render deployment because it uses HTTPS (port 443) and avoids SMTP port blocks.
const axios = require('axios');

const sendOTPEmail = async (email, otp, userName = 'User') => {
  try {
    const response = await axios({
      method: 'POST',
      url: 'https://api.brevo.com/v3/smtp/email',
      headers: {
        'accept': 'application/json',
        'api-key': process.env.BREVO_API_KEY,
        'content-type': 'application/json'
      },
      data: {
        sender: {
          name: process.env.SENDER_NAME || 'DriveX App',
          email: process.env.SENDER_EMAIL
        },
        to: [
          {
            email: email,
            name: userName
          }
        ],
        subject: "🔐 Your DriveX Login OTP Code",
        htmlContent: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="UTF-8">
            <title>DriveX OTP Verification</title>
          </head>
          <body>
            <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto;">
              <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                <h1>🔐 DriveX Workspace</h1>
              </div>
              <div style="padding: 30px; border: 1px solid #e0e0e0; border-radius: 0 0 10px 10px;">
                <h2>Hello ${userName}!</h2>
                <p>Your login verification code is:</p>
                <div style="background: white; font-size: 36px; font-weight: bold; letter-spacing: 8px; text-align: center; padding: 20px; margin: 20px 0; border-radius: 8px; border: 2px dashed #667eea; color: #667eea; font-family: monospace;">
                  ${otp}
                </div>
                <p><strong>⏰ This code will expire in 10 minutes.</strong></p>
                <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 10px; margin: 20px 0;">
                  ⚠️ <strong>Security Alert:</strong> Never share this code with anyone.
                </div>
                <p>If you didn't request this code, you can safely ignore this email.</p>
                <hr />
                <p style="font-size: 12px; color: #666;">© 2025 DriveX App. All rights reserved.</p>
              </div>
            </div>
          </body>
          </html>
        `
      }
    });
    
    console.log(`✅ OTP sent successfully to ${email}`);
    return { success: true, messageId: response.data.messageId };
    
  } catch (error) {
    console.error('❌ Error sending email:', error.response?.data || error.message);
    return { 
      success: false, 
      error: error.response?.data?.message || error.message 
    };
  }
};

const testEmailService = async () => {
  try {
    console.log('🧪 Testing Brevo email service via API...');
    console.log('API Key exists:', !!process.env.BREVO_API_KEY);
    console.log('Sender Email:', process.env.SENDER_EMAIL);
    
    const testResult = await sendOTPEmail(
      process.env.SENDER_EMAIL,
      '123456',
      'Test User'
    );
    
    if (testResult.success) {
      console.log('✅ Email service configured correctly!');
    } else {
      console.error('❌ Test failed:', testResult.error);
    }
  } catch (error) {
    console.error('❌ Configuration error:', error);
  }
};

module.exports = { sendOTPEmail, testEmailService };