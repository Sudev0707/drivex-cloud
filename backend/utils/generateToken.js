
const jwt = require('jsonwebtoken');

const generateToken = (user) => {
    const id = user?._id ?? user;
    const payload =
        typeof user === "object" && user.email
            ? { id, email: user.email, role: user.role }
            : { id };
    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: '1h',
    });
};

module.exports = generateToken;