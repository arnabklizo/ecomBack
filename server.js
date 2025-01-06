const cors = require("cors");
const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const categoryRoutes = require("./routes/category");

const errorHandler = require("./middlewares/errorHandler");
const isProduction = process.env.NODE_ENV === "production";



const adminRoutes = require("./routes/adminRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");


dotenv.config();
connectDB();

const app = express();

// Update CORS to allow multiple origins
const corsOptions = {
    origin: ["http://localhost:5173", "http://localhost:3000"],
    credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);


app.use("/api/admin", adminRoutes);
app.use("/api/admin/categories", categoryRoutes);


app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);


app.use((req, res, next) => {
    res.locals.cookieOptions = {
        httpOnly: true,
        secure: isProduction,
        sameSite: "strict",
    };
    next();
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
// console.log(`Running on port: ${process.env.PORT}`);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
