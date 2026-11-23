const Task = require('../models/Task');
const Project = require('../models/Project');
const path = require('path');
const fs = require('fs');

// Helper to recalculate project progress
const recalculateProjectProgress = async (projectId, userId) => {
  if (!projectId) return;
  try {
    const total = await Task.countDocuments({ projectId, userId });
    if (total === 0) {
      await Project.findByIdAndUpdate(projectId, { progress: 0 });
      return;
    }
    const completed = await Task.countDocuments({ projectId, userId, status: 'Completed' });
    const progress = Math.round((completed / total) * 100);
    await Project.findByIdAndUpdate(projectId, { progress });
  } catch (err) {
    console.warn('Error updating project progress:', err.message);
  }
};

// @route   GET /api/tasks
// @desc    Get all tasks for current user with filtering, search & sorting
const getTasks = async (req, res) => {
  try {
    const { status, priority, category, projectId, search, sort } = req.query;

    const query = { userId: req.user._id };

    if (status && status !== 'all') {
      query.status = status;
    }
    if (priority && priority !== 'all') {
      query.priority = priority;
    }
    if (category && category !== 'all') {
      query.category = { $regex: category, $options: 'i' };
    }
    if (projectId && projectId !== 'all') {
      query.projectId = projectId;
    }
    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [{ title: searchRegex }, { description: searchRegex }];
    }

    let sortQuery = { createdAt: -1 };
    if (sort === 'dueDate') {
      sortQuery = { dueDate: 1 };
    } else if (sort === 'priority') {
      sortQuery = { priority: 1 };
    }

    const tasks = await Task.find(query).populate('projectId', 'title category').sort(sortQuery);

    return res.status(200).json({
      success: true,
      count: tasks.length,
      tasks,
    });
  } catch (error) {
    console.error('getTasks error:', error);
    return res.status(500).json({ success: false, message: 'Server error retrieving tasks.' });
  }
};

// @route   POST /api/tasks
// @desc    Create a new task (with optional Multer image upload)
const createTask = async (req, res) => {
  try {
    const { title, description, priority, status, dueDate, projectId, category } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ success: false, message: 'Task title is required.' });
    }

    let coverImage = '';
    if (req.file) {
      coverImage = `/uploads/${req.file.filename}`;
    }

    const task = await Task.create({
      userId: req.user._id,
      projectId: projectId || null,
      title: title.trim(),
      description: description ? description.trim() : '',
      priority: priority || 'Medium',
      status: status || 'Pending',
      dueDate: dueDate ? new Date(dueDate) : null,
      coverImage,
      category: category ? category.trim() : 'Manuscript',
    });

    if (task.projectId) {
      await recalculateProjectProgress(task.projectId, req.user._id);
    }

    return res.status(201).json({
      success: true,
      message: 'Task created successfully.',
      task,
    });
  } catch (error) {
    console.error('createTask error:', error);
    return res.status(500).json({ success: false, message: 'Server error creating task.' });
  }
};

// @route   PUT /api/tasks/:id
// @desc    Update task details or status
const updateTask = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.user._id });
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found.' });
    }

    const oldProjectId = task.projectId;
    const { title, description, priority, status, dueDate, projectId, category, completed } = req.body;

    if (title) task.title = title.trim();
    if (description !== undefined) task.description = description.trim();
    if (priority) task.priority = priority;
    if (status) task.status = status;
    if (completed !== undefined) task.completed = Boolean(completed);
    if (dueDate !== undefined) task.dueDate = dueDate ? new Date(dueDate) : null;
    if (projectId !== undefined) task.projectId = projectId || null;
    if (category) task.category = category.trim();

    if (req.file) {
      if (task.coverImage && task.coverImage.startsWith('/uploads/')) {
        const oldImg = path.join(__dirname, '..', task.coverImage);
        if (fs.existsSync(oldImg)) fs.unlinkSync(oldImg);
      }
      task.coverImage = `/uploads/${req.file.filename}`;
    }

    await task.save();

    // Recalculate progress for old and new projects
    if (oldProjectId && String(oldProjectId) !== String(task.projectId)) {
      await recalculateProjectProgress(oldProjectId, req.user._id);
    }
    if (task.projectId) {
      await recalculateProjectProgress(task.projectId, req.user._id);
    }

    return res.status(200).json({
      success: true,
      message: 'Task updated successfully.',
      task,
    });
  } catch (error) {
    console.error('updateTask error:', error);
    return res.status(500).json({ success: false, message: 'Server error updating task.' });
  }
};

// @route   DELETE /api/tasks/:id
// @desc    Delete task
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.user._id });
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found.' });
    }

    const projectId = task.projectId;

    if (task.coverImage && task.coverImage.startsWith('/uploads/')) {
      const imgPath = path.join(__dirname, '..', task.coverImage);
      if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
    }

    await task.deleteOne();

    if (projectId) {
      await recalculateProjectProgress(projectId, req.user._id);
    }

    return res.status(200).json({
      success: true,
      message: 'Task deleted successfully.',
    });
  } catch (error) {
    console.error('deleteTask error:', error);
    return res.status(500).json({ success: false, message: 'Server error deleting task.' });
  }
};

module.exports = { getTasks, createTask, updateTask, deleteTask };
