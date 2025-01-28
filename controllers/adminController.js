const Admin = require("../models/Admin");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

// admin login 
exports.loginAdmin = async (req, res) => {
    const { email, password } = req.body;
    // console.log('emntered email:', { email })
    // console.log('emntered password:', { password })


    try {
        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Check password
        const isMatch = await admin.matchPassword(password);

        if (!isMatch) {
            return res.status(401).json({ message: "Invalid password" });
        }

        // Generate JWT token
        const token = jwt.sign({ id: admin._id, role: "admin" }, process.env.JWT_SECRET, { expiresIn: "1d" });
        res.cookie("admin", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 24 * 60 * 60 * 1000, // 1 day
        });

        res.status(200).json({ message: "Admin login successful.!" });
    } catch (error) {
        console.error("Admin login error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// admin logout 
exports.logoutAdmin = (req, res) => {
    try {
        res.cookie("admin", "", {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Make sure this is set to true if you're using HTTPS in production
            sameSite: 'None', // For cross-origin cookies
            expires: new Date(0), // Expire the cookie immediately
        });
        res.status(200).json({ message: "Admin logged out successfully !!" });
    } catch (error) {
        res.status(500).json({ message: "Failed to log out." });
    }
};


exports.isAuthenticated = (req, res) => {
    const token = req.cookies.admin; // Access the cookie
    if (!token) {
        return res.status(200).json({ isAuthenticated: false });
    }
    try {
        jwt.verify(token, process.env.JWT_SECRET); // Verify the token
        res.status(200).json({ isAuthenticated: true });
    } catch (err) {
        res.status(401).json({ isAuthenticated: false });
    }
};