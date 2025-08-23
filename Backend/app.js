const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const logger = require("morgan");
const app = express();
const cookieParser = require("cookie-parser");
const connectDB = require("./db/db");
connectDB();
const cors = require("cors");
const userRoutes = require("./routes/user.routes.js");
const surgeryRoutes = require("./routes/surgery.routes.js");
const recoveryRoutes = require("./routes/recovery.routes.js");
const authRoutes = require("./routes/auth.routes.js");

// app.use((req, res, next) => {
//     res.header('Access-Control-Expose-Headers', 'Content-Disposition');
//     next();
// });

// app.use(cors({
//   origin: "http://localhost:5173",
//   credentials: true,
// }));

app.use(express.json());
app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/user", userRoutes);
app.use("/surgery", surgeryRoutes);
app.use("/recovery", recoveryRoutes);
// ...existing code...

// ...existing code...

// Routes
app.use("/api/users", userRoutes);
app.use("/api/surgery", surgeryRoutes);
app.use("/api/recovery", recoveryRoutes);
app.use("/api/auth", authRoutes); // Add this line

// ...existing code...

module.exports = app;
