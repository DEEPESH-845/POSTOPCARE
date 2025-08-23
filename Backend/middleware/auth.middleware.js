const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");

const authenticateToken = async (req, res, next) => {
    try {
        // Get token from header
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

        if (!token) {
            return res.status(401).json({ message: "Access denied. No token provided." });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Get user from database
        const user = await userModel.findById(decoded.userId).select('-password');
        
        if (!user) {
            return res.status(401).json({ message: "Invalid token. User not found." });
        }

        // Add user to request object
        req.user = user;
        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: "Invalid token." });
        } else if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: "Token expired." });
        } else {
            console.error("Authentication error:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }
};

module.exports = { authenticateToken };
