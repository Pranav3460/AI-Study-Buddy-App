const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  thumbnail: {
    type: String,
    required: true,
  },
});

const studySessionSchema = new mongoose.Schema({
  topic: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  videos: [videoSchema],
});

const studyPlanSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  topics: [{
    name: {
      type: String,
      required: true,
    },
    estimatedHours: {
      type: Number,
      required: true,
    },
  }],
  daysUntilExam: {
    type: Number,
    required: true,
  },
  dailyStudyHours: {
    type: Number,
    required: true,
  },
  sessions: [studySessionSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const StudyPlan = mongoose.model('StudyPlan', studyPlanSchema);

module.exports = StudyPlan; 