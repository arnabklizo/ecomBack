const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const Admin = require("./models/Admin"); // Assuming you have an Admin model

dotenv.config();

const connectDB = require("./config/db");
connectDB();

const createAdmin = async () => {
    try {
        const email = "admin@email.com"; // Set the admin's email
        const password = "admin@123"; // Set the admin's password

        // Check if admin already exists
        const adminExists = await Admin.findOne({ email });
        if (adminExists) {
            console.log("Admin already exists.");
            return;
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        // console.log('hasshed seed password:', hashedPassword)
        // Create new admin
        const newAdmin = new Admin({
            email,
            password: hashedPassword,
        });

        await newAdmin.save();
        console.log("Admin created successfully!");
    } catch (error) {
        console.error("Error creating admin:", error);
    } finally {
        mongoose.connection.close();
    }
};

createAdmin();
