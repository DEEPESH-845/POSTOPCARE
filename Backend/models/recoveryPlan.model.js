const mongoose = require("mongoose");

const recoveryDaySchema = new mongoose.Schema({
  dayNumber: {
    type: Number,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  activities: [{
    type: String,
    required: true
  }],
  status: {
    type: String,
    enum: ['completed', 'current', 'upcoming'],
    default: 'upcoming'
  },
  completedAt: {
    type: Date,
    default: null
  }
});

const recoveryPlanSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  surgeryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SurgeryOnboarding',
    required: true
  },
  surgeryType: {
    type: String,
    required: true
  },
  totalDays: {
    type: Number,
    required: true
  },
  currentDay: {
    type: Number,
    default: 1
  },
  daysCompleted: {
    type: Number,
    default: 0
  },
  overallProgress: {
    type: Number,
    default: 0
  },
  timeline: [recoveryDaySchema],
  startDate: {
    type: Date,
    required: true
  },
  estimatedEndDate: {
    type: Date,
    required: true
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
recoveryPlanSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Calculate progress before saving
recoveryPlanSchema.pre('save', function(next) {
  if (this.totalDays > 0) {
    this.overallProgress = Math.round((this.daysCompleted / this.totalDays) * 100);
  }
  next();
});

module.exports = mongoose.model('RecoveryPlan', recoveryPlanSchema);
