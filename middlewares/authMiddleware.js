const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    const token = req.cookies.user; // Get token from cookies

    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the JWT
        req.user = decoded; // Attach user info to the request object
        next(); // Proceed to the next middleware/route handler
    } catch (err) {
        return res.status(401).json({ message: 'Not authoried, Invalid token' });
    }
};

module.exports = protect;

