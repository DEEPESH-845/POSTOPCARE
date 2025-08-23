const mongoose = require("mongoose");

const notificationPreferenceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  emailNotifications: {
    type: Boolean,
    default: true
  },
  pushNotifications: {
    type: Boolean,
    default: true
  },
  smsNotifications: {
    type: Boolean,
    default: false
  },
  medicationReminders: {
    type: Boolean,
    default: true
  },
  appointmentReminders: {
    type: Boolean,
    default: true
  },
  recoveryUpdates: {
    type: Boolean,
    default: true
  },
  educationalContent: {
    type: Boolean,
    default: true
  },
  communityUpdates: {
    type: Boolean,
    default: false
  },
  marketingUpdates: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
notificationPreferenceSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Ensure only one notification preference document per user
notificationPreferenceSchema.index({ userId: 1 }, { unique: true });

module.exports = mongoose.model('NotificationPreference', notificationPreferenceSchema);
