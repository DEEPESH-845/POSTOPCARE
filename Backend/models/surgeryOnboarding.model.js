const mongoose = require("mongoose");

const surgeryOnboardingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  preferredLanguage: {
    type: String,
    required: true
  },
  privacyPermission: {
    type: Boolean,
    required: true,
    default: false
  },
  surgery: {
    type: {
      category: {
        type: String,
        required: true
        // No enum validation as requested - can be orthopedics, cardiac, abdominal, etc.
      },
      specificProcedure: {
        type: String,
        required: true
        // No enum validation as requested - can be knee replacement, bypass, etc.
      },
      additionalDetails: {
        type: String,
        default: ""
      },
      surgeryDate: {
        type: Date,
        required: true
      }
    },
    required: true
  },
  recoveryPlan: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'RecoveryPlan',
    default: null
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
surgeryOnboardingSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('SurgeryOnboarding', surgeryOnboardingSchema);
