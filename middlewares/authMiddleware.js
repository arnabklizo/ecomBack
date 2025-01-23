const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const verifyToken = (req, res, next) => {
    const token = req.cookies.user;
    if (!token) {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
};

module.exports = verifyToken;

// that uou are loged in
// // Example usage
// app.get("/protected-route", verifyToken, (req, res) => {
//     res.status(200).json({ message: "You are authorized", user: req.user });
// });


