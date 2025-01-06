const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { signToken } = require("../utils/jwtUtils");
const dotenv = require("dotenv");

dotenv.config();
// Register User
exports.registerUser = async (req, res) => {
    // try {
    //     const { email, phone, password } = req.body;

    //     // Check if user already exists
    //     const userExists = await User.findOne({ email });
    //     if (userExists) {
    //         return res.status(400).json({ message: "Email already exists" });
    //     }

    //     const newUser = new User({
    //         email,
    //         phone,
    //         password, // Pass plain text password
    //     });
    //     await newUser.save();

    //     console.log("Stored password hash:", newUser.password); // Log hashed password
    //     res.status(201).json({ message: "User registered successfully" });
    // } catch (error) {
    //     console.error("Registration error:", error);
    //     res.status(500).json({ message: "Internal Server Error" });
    // }




    try {
        const { email, phone, password } = req.body;

        console.log("Registration attempt:", { email, phone, password });

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
        const token = signToken({ id: newUser._id, email: newUser.email });
        // const token = jwt.sign({ id: newUser._id, email: newUser.email }, process.env.JWT_SECRET, { expiresIn: "1d" });

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

        // Validate password before generating the JWT
        const isMatch = await user.matchPassword(password);
        // console.log('Entered password:', password);
        // console.log('Stored hashed password:', user.password);  // Log the stored hash
        // console.log('Password match result:', isMatch);  // Log if password matched or not


        if (!isMatch) {
            return res.status(401).json({ message: "Invalid password" });
        }

        const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "1d" });
        res.json({ token });  // Send token in the response
    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ message: "An error occurred during login" });
    }
};



// Logout User
exports.logoutUser = (req, res) => {
    res.cookie("token", "", {
        httpOnly: true,
        secure: false, // Should be set to true if using HTTPS in production
        sameSite: "lax",
        expires: new Date(0), // Expire the cookie
    });
    res.status(200).json({ message: "Logged out successfully" });
};
