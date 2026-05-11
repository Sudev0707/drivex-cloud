
const express = require('express');
const passport = require('../middleware/passport');
const { registerUser, loginUser, getUserProfile, updateUserProfile,googleCallback, getCurrentUser } = require('../controllers/authController');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);

// Google OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', { session: false, failureRedirect: '/login' }), googleCallback);

// protected
router.get('/profile', authMiddleware, getUserProfile);
router.put('/profile', authMiddleware, updateUserProfile);
router.get('/me', authMiddleware, getCurrentUser);
module.exports = router;