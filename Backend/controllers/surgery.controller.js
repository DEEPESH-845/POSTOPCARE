const SurgeryOnboarding = require("../models/surgeryOnboarding.model");
const { validationResult } = require("express-validator");

module.exports.createOnboarding = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const userId = req.user._id;
        const { preferredLanguage, privacyPermission, surgery } = req.body;

        // Validate surgery object structure
        if (!surgery || !surgery.category || !surgery.specificProcedure || !surgery.surgeryDate) {
            return res.status(400).json({
                message: "Surgery object must contain category, specificProcedure, and surgeryDate"
            });
        }

        // Validate surgery date
        const surgeryDate = new Date(surgery.surgeryDate);
        if (isNaN(surgeryDate.getTime())) {
            return res.status(400).json({
                message: "Invalid surgery date format"
            });
        }

        // Create new surgery onboarding
        const newOnboarding = new SurgeryOnboarding({
            userId,
            preferredLanguage,
            privacyPermission,
            surgery: {
                category: surgery.category,
                specificProcedure: surgery.specificProcedure,
                surgeryDate: new Date(surgery.surgeryDate),
                additionalDetails: surgery.additionalDetails || ""
            }
        });

        await newOnboarding.save();

        res.status(201).json({
            message: "Surgery onboarding completed successfully",
            data: newOnboarding
        });
    } catch (error) {
        console.error("Error creating surgery onboarding:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports.getOnboardingData = async (req, res) => {
    try {
        const userId = req.user._id;

        // Find all surgery onboarding data for the user
        const onboardingData = await SurgeryOnboarding.find({ userId }).populate('userId', 'fullname email');

        if (!onboardingData || onboardingData.length === 0) {
            return res.status(404).json({
                message: "No surgery onboarding data found for this user"
            });
        }

        res.status(200).json({
            message: "Surgery onboarding data retrieved successfully",
            data: onboardingData,
            count: onboardingData.length
        });
    } catch (error) {
        console.error("Error getting surgery onboarding data:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports.updateOnboarding = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const userId = req.user._id;
        const { surgeryId } = req.params; // Get surgery ID from URL parameters
        const updateData = req.body;

        // Remove sensitive fields from update data
        delete updateData.userId;
        delete updateData._id;
        delete updateData.createdAt;

        // Validate surgery object if provided
        if (updateData.surgery) {
            if (!updateData.surgery.category || !updateData.surgery.specificProcedure) {
                return res.status(400).json({
                    message: "Surgery object must contain category and specificProcedure"
                });
            }
            
            // Validate surgery date if provided
            if (updateData.surgery.surgeryDate) {
                const surgeryDate = new Date(updateData.surgery.surgeryDate);
                if (isNaN(surgeryDate.getTime())) {
                    return res.status(400).json({
                        message: "Invalid surgery date format"
                    });
                }
                updateData.surgery.surgeryDate = surgeryDate;
            }
        }

        // Find and update specific surgery onboarding record
        const updatedOnboarding = await SurgeryOnboarding.findOneAndUpdate(
            { _id: surgeryId, userId }, // Match both ID and userId for security
            { ...updateData, updatedAt: Date.now() },
            { 
                new: true, 
                runValidators: true 
            }
        );

        if (!updatedOnboarding) {
            return res.status(404).json({
                message: "No surgery onboarding record found with this ID for this user"
            });
        }

        res.status(200).json({
            message: "Surgery onboarding updated successfully",
            data: updatedOnboarding
        });
    } catch (error) {
        console.error("Error updating surgery onboarding:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports.deleteOnboarding = async (req, res) => {
    try {
        const userId = req.user._id;
        const { surgeryId } = req.params;

        // Find and delete specific surgery onboarding record
        const deletedOnboarding = await SurgeryOnboarding.findOneAndDelete(
            { _id: surgeryId, userId } // Match both ID and userId for security
        );

        if (!deletedOnboarding) {
            return res.status(404).json({
                message: "No surgery onboarding record found with this ID for this user"
            });
        }

        res.status(200).json({
            message: "Surgery onboarding record deleted successfully",
            data: deletedOnboarding
        });
    } catch (error) {
        console.error("Error deleting surgery onboarding:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
