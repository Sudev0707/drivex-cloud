const express = require('express');
const { requestOTP, verifyOTP } = require('../controllers/otpController');

const router = express.Router();

router.post('/request', requestOTP);
router.post('/verify', verifyOTP);

module.exports = router;