require('dotenv').config();
const { sendOTPEmail } = require('./services/emailService');

async function test() {
  console.log('Testing email service...');
  console.log('API Key exists:', !!process.env.BREVO_API_KEY);
  console.log('Sender Email:', process.env.SENDER_EMAIL);
  
  const result = await sendOTPEmail(
    process.env.SENDER_EMAIL, // Send to yourself for testing
    '123456',
    'Test User'
  );
  
  console.log('Result:', result);
}

test();