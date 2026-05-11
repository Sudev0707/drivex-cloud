const dotenv = require('dotenv');
dotenv.config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/connection");
const {testEmailService} = require("./services/emailService");
const session = require('express-session');
const passport = require("./middleware/passport");
const authRoutes = require("./routes/authRoutes");
const otpRoutes = require("./routes/otpRoutes");

// load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// enable CORS
app.use(cors({
    origin: 'http://localhost:3000', // Adjust this to your frontend URL
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
})

app.use(session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie:{
        secure: process.env.NODE_ENV === 'production', // set to true in production
        httpOnly: true,
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    }
}))
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/otp", otpRoutes);

// error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Server Error' });
});

app.use((req, res)=>{
    res.status(404).json({ message: 'Route Not Found' });
})

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});