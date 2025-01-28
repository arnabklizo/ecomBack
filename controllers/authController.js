const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { signToken } = require("../utils/jwtUtils");
const dotenv = require("dotenv");

dotenv.config();
// Register User
exports.registerUser = async (req, res) => {
    try {
        const { email, phone, password } = req.body;

        // console.log("Registration attempt:", { email, phone, password });

        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "Email already exists" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new User({
            email,
            phone,
            password: hashedPassword,
        });
        await newUser.save();

        // Generate JWT
        const token = jwt.sign({ id: newUser._id, email: newUser.email }, process.env.JWT_SECRET, { expiresIn: "1d" });
        res.cookie("user", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 24 * 60 * 60 * 1000, // 1 day
        });

        res.status(201).json({
            message: "User registered successfully",
            token
        });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// Login User
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid email" });
        }

        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid password" });
        }

        const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "1d" });

        res.cookie("user", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 24 * 60 * 60 * 1000, // 1 day
        });
        res.status(200).json({ userId: user._id, message: "Login successful !!" });

        // res.json({ token });  // Send token in the response
    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ message: "An error occurred during login" });
    }
};

// Logout User
exports.logoutUser = (req, res) => {
    res.cookie("user", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        expires: new Date(0),
    });
    res.status(200).json({ message: "Logged out successfully .!" });
};

// login checker 
exports.isAuthenticated = (req, res) => {
    const token = req.cookies.user; // Access the cookie
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
