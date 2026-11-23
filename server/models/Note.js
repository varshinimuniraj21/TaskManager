const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      default: 'Story Idea',
      trim: true,
    },
    content: {
      type: String,
      default: '',
      trim: true,
    },
    image: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Note', noteSchema);
