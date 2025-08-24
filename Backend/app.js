const express = require("express");
const cors = require("cors");
const connectDB = require("./db/db");
const authRoutes = require("./routes/auth.routes");

const app = express();

// Connect to database
connectDB();

// Middleware
app.use(
	cors({
		origin: ["http://localhost:8080", "http://localhost:3000"],
		credentials: true,
	})
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);

// Health check
app.get("/api/health", (req, res) => {
	res.json({ status: "OK", message: "Server is running" });
});

module.exports = app;
