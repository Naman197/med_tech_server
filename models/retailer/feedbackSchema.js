const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  feedbackCategory: {
    type: String,
    required: true
  },
  sentiment: {
    type: String,
    enum: ['Positive', 'Neutral', 'Negative'],
    required: true
  },
  feedbackText: {
    type: String,
    required: true
  },
  feedbackDate: {
    type: Date,
    default: Date.now
  }
});

const Feedback = mongoose.model('Feedback', feedbackSchema);

module.exports = Feedback;
