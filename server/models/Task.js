const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      default: null,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    priority: {
      type: String,
      enum: ['High', 'Medium', 'Low'],
      default: 'Medium',
    },
    status: {
      type: String,
      enum: ['Pending', 'In Progress', 'Editing', 'Completed'],
      default: 'Pending',
    },
    dueDate: {
      type: Date,
    },
    coverImage: {
      type: String,
      default: '',
    },
    completed: {
      type: Boolean,
      default: false,
    },
    category: {
      type: String,
      default: 'Manuscript',
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Keep completed boolean synced with status
taskSchema.pre('save', function (next) {
  if (this.isModified('status')) {
    this.completed = this.status === 'Completed';
  } else if (this.isModified('completed')) {
    this.status = this.completed ? 'Completed' : 'Pending';
  }
  next();
});

module.exports = mongoose.model('Task', taskSchema);
