const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const axios = require('axios');
const StudyPlan = require('../models/StudyPlan');
const User = require('../models/User');

// Middleware to verify JWT token
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const user = await User.findOne({ _id: decoded.userId });

    if (!user) {
      throw new Error();
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Please authenticate' });
  }
};

// Create study plan
router.post('/', auth, async (req, res) => {
  try {
    const { topics, daysUntilExam, dailyStudyHours } = req.body;

    // Calculate study sessions
    const totalHours = topics.reduce((sum, topic) => sum + topic.estimatedHours, 0);
    const totalDays = daysUntilExam;
    const hoursPerDay = totalHours / totalDays;

    // Generate study sessions
    const sessions = [];
    let currentDate = new Date();
    let remainingHours = totalHours;

    for (const topic of topics) {
      const topicHours = topic.estimatedHours;
      const daysForTopic = Math.ceil(topicHours / dailyStudyHours);
      
      for (let i = 0; i < daysForTopic; i++) {
        const sessionHours = Math.min(dailyStudyHours, topicHours - (i * dailyStudyHours));
        if (sessionHours <= 0) break;

        // Search for relevant YouTube videos
        const videoResponse = await axios.get(
          `https://www.googleapis.com/youtube/v3/search`,
          {
            params: {
              part: 'snippet',
              q: `${topic.name} tutorial`,
              type: 'video',
              maxResults: 3,
              key: process.env.YOUTUBE_API_KEY,
            },
          }
        );

        const videos = videoResponse.data.items.map(item => ({
          title: item.snippet.title,
          url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
          thumbnail: item.snippet.thumbnails.medium.url,
        }));

        sessions.push({
          topic: topic.name,
          duration: sessionHours,
          date: new Date(currentDate),
          videos,
        });

        currentDate.setDate(currentDate.getDate() + 1);
        remainingHours -= sessionHours;
      }
    }

    // Create study plan
    const studyPlan = new StudyPlan({
      user: req.user._id,
      topics,
      daysUntilExam,
      dailyStudyHours,
      sessions,
    });

    await studyPlan.save();

    // Add study plan to user's study plans
    req.user.studyPlans.push(studyPlan._id);
    await req.user.save();

    res.status(201).json(studyPlan);
  } catch (error) {
    console.error('Error creating study plan:', error);
    res.status(500).json({ message: 'Error creating study plan' });
  }
});

// Get user's study plans
router.get('/', auth, async (req, res) => {
  try {
    const studyPlans = await StudyPlan.find({ user: req.user._id });
    res.json(studyPlans);
  } catch (error) {
    console.error('Error fetching study plans:', error);
    res.status(500).json({ message: 'Error fetching study plans' });
  }
});

// Get specific study plan
router.get('/:id', auth, async (req, res) => {
  try {
    const studyPlan = await StudyPlan.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!studyPlan) {
      return res.status(404).json({ message: 'Study plan not found' });
    }

    res.json(studyPlan);
  } catch (error) {
    console.error('Error fetching study plan:', error);
    res.status(500).json({ message: 'Error fetching study plan' });
  }
});

module.exports = router; 