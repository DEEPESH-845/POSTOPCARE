const userModel = require("../models/user.model")
const NotificationPreference = require("../models/notificationPreference.model");
const RecoveryPlan = require("../models/recoveryPlan.model");
const SurgeryOnboarding = require("../models/surgeryOnboarding.model");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path"); // To ensure correct file path handling
const crypto = require("crypto");
const notificationPreferenceModel = require("../models/notificationPreference.model");

module.exports.registerUser = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { fullname, email, password, language } = req.body;

        // Check if user already exists
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Create new user
        const newUser = new userModel({
            fullname,
            email,
            password: await userModel.hashPassword(password),
            language
        });
        const notificationPreference = new notificationPreferenceModel({
           userId : newUser._id
        })

        await newUser.save();
        await notificationPreference.save();

        // Generate JWT token
        const token = jwt.sign(
            { userId: newUser._id, email: newUser.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(201).json({ message: "User registered successfully", token });
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}


module.exports.loginUser = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;

        // Check if user exists
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({ message: "User logged in successfully", token });
    } catch (error) {
        console.error("Error logging in user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

module.exports.getNotificationPreferences = async (req, res) => {
    try {
        // Get user ID from authenticated user
        const userId = req.user._id;

        // Find notification preferences for the user
        let preferences = await NotificationPreference.findOne({ userId });

        // If no preferences exist, create default ones
        if (!preferences) {
            preferences = new NotificationPreference({ userId });
            await preferences.save();
        }

        res.status(200).json({
            message: "Notification preferences retrieved successfully",
            data: preferences
        });
    } catch (error) {
        console.error("Error getting notification preferences:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports.updateNotificationPreferences = async (req, res) => {
    try {
        const userId = req.user._id;
        const updateData = req.body;

        // Remove userId from update data to prevent manipulation
        delete updateData.userId;
        delete updateData._id;
        delete updateData.createdAt;

        // Find and update preferences, or create if doesn't exist
        const preferences = await NotificationPreference.findOneAndUpdate(
            { userId },
            { ...updateData, userId, updatedAt: Date.now() },
            { 
                new: true, 
                upsert: true, // Create if doesn't exist
                runValidators: true 
            }
        );

        res.status(200).json({
            message: "Notification preferences updated successfully",
            data: preferences
        });
    } catch (error) {
        console.error("Error updating notification preferences:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

module.exports.getUserRecoveryPlans = async (req, res) => {
    try {
        const userId = req.user._id;

        // Find all recovery plans for the user with populated surgery details
        const recoveryPlans = await RecoveryPlan.find({ userId })
            .populate({
                path: 'surgeryId',
                select: 'surgery createdAt',
                model: 'SurgeryOnboarding'
            })
            .sort({ createdAt: -1 });

        // Format the response data
        const formattedPlans = recoveryPlans.map(plan => ({
            _id: plan._id,
            surgeryType: plan.surgeryType,
            specificProcedure: plan.surgeryId?.surgery?.specificProcedure || 'Unknown',
            category: plan.surgeryId?.surgery?.category || 'Unknown',
            surgeryDate: plan.surgeryId?.surgery?.surgeryDate,
            progress: {
                overallProgress: plan.overallProgress,
                currentDay: plan.currentDay,
                totalDays: plan.totalDays,
                daysCompleted: plan.daysCompleted,
                daysRemaining: plan.totalDays - plan.currentDay + 1
            },
            startDate: plan.startDate,
            estimatedEndDate: plan.estimatedEndDate,
            isActive: plan.currentDay <= plan.totalDays,
            createdAt: plan.createdAt
        }));

        res.status(200).json({
            message: "Recovery plans retrieved successfully",
            data: formattedPlans,
            count: formattedPlans.length
        });
    } catch (error) {
        console.error("Error getting user recovery plans:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

module.exports.getUserProfile = async (req, res) => {
    try {
        const userId = req.user._id;

        // Get user basic info
        const user = await userModel.findById(userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Get recovery plans count
        const recoveryPlansCount = await RecoveryPlan.countDocuments({ userId });
        
        // Get current active recovery plan
        const activeRecoveryPlan = await RecoveryPlan.findOne({ 
            userId,
            $expr: { $lte: ["$currentDay", "$totalDays"] }
        })
        .populate({
            path: 'surgeryId',
            select: 'surgery',
            model: 'SurgeryOnboarding'
        })
        .sort({ createdAt: -1 });

        // Calculate next check-in time (assuming daily check-ins)
        let nextCheckIn = null;
        if (activeRecoveryPlan) {
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            tomorrow.setHours(20, 0, 0, 0); // 8:00 PM next day
            nextCheckIn = tomorrow;
        }

        const profileData = {
            user: {
                _id: user._id,
                fullname: user.fullname,
                email: user.email,
                language: user.language,
                createdAt: user.createdAt
            },
            recovery: {
                hasActivePlans: recoveryPlansCount > 0,
                totalPlans: recoveryPlansCount,
                currentPlan: activeRecoveryPlan ? {
                    surgeryType: activeRecoveryPlan.surgeryType,
                    currentDay: activeRecoveryPlan.currentDay,
                    totalDays: activeRecoveryPlan.totalDays,
                    progress: activeRecoveryPlan.overallProgress
                } : null,
                nextCheckIn: nextCheckIn
            }
        };

        res.status(200).json({
            message: "Profile retrieved successfully",
            data: profileData
        });
    } catch (error) {
        console.error("Error getting user profile:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}