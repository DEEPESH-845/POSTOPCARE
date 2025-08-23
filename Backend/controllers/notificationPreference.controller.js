const NotificationPreference = require("../models/notificationPreference.model");

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
};
