const Admin = require("../models/Admin");
const jwt = require("jsonwebtoken");

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
        // console.log('Entered password:', password);
        // console.log('Stored hashed password:', admin.password);  // Log the stored hash
        // console.log('Password match result:', isMatch);  // Log if password matched or not
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid password" });
        }

        // Generate JWT token
        const token = jwt.sign({ id: admin._id, role: "admin" }, process.env.JWT_SECRET, { expiresIn: "1d" });

        res.status(200).json({ message: "Login successful", token });
    } catch (error) {
        console.error("Admin login error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

exports.logoutAdmin = (req, res) => {
    try {
        res.cookie("adminToken", "", {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Make sure this is set to true if you're using HTTPS in production
            sameSite: 'None', // For cross-origin cookies
            expires: new Date(0), // Expire the cookie immediately
        });
        res.status(200).json({ message: "Logged out successfully by Admin" });
    } catch (error) {
        res.status(500).json({ message: "Failed to log out." });
    }
};

