const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();


const protectAdmin = (req, res, next) => {
    const token = req.header("Authorization");

    if (!token) {
        return res.status(401).json({ message: "No token, authorization denied" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Check if the role is 'admin'
        if (decoded.role !== "admin") {
            return res.status(403).json({ message: "Not authorized" });
        }

        req.admin = decoded;  // Store admin info in request object
        next();
    } catch (err) {
        res.status(401).json({ message: "Token is not valid" });
    }
};

module.exports = protectAdmin;
