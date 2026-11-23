const Project = require('../models/Project');
const Task = require('../models/Task');
const path = require('path');
const fs = require('fs');

// @route   GET /api/projects
// @desc    Get all user projects with calculated progress
const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ userId: req.user._id }).sort({ createdAt: -1 });

    // Calculate dynamic progress based on tasks for each project
    const projectsWithProgress = await Promise.all(
      projects.map(async (project) => {
        const totalTasks = await Task.countDocuments({
          userId: req.user._id,
          projectId: project._id,
        });

        if (totalTasks === 0) {
          return {
            ...project.toObject(),
            progress: project.progress || 0,
            totalTasks: 0,
            completedTasks: 0,
          };
        }

        const completedTasks = await Task.countDocuments({
          userId: req.user._id,
          projectId: project._id,
          status: 'Completed',
        });

        const progress = Math.round((completedTasks / totalTasks) * 100);

        // Update stored progress if changed
        if (project.progress !== progress) {
          project.progress = progress;
          await project.save();
        }

        return {
          ...project.toObject(),
          progress,
          totalTasks,
          completedTasks,
        };
      })
    );

    return res.status(200).json({
      success: true,
      count: projectsWithProgress.length,
      projects: projectsWithProgress,
    });
  } catch (error) {
    console.error('getProjects error:', error);
    return res.status(500).json({ success: false, message: 'Server error retrieving projects.' });
  }
};

// @route   POST /api/projects
// @desc    Create a new project (supports image upload)
const createProject = async (req, res) => {
  try {
    const { title, category, description } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ success: false, message: 'Project title is required.' });
    }

    let coverImage = '';
    if (req.file) {
      coverImage = `/uploads/${req.file.filename}`;
    }

    const project = await Project.create({
      userId: req.user._id,
      title: title.trim(),
      category: category ? category.trim() : 'Mystery',
      description: description ? description.trim() : '',
      coverImage,
      progress: 0,
    });

    return res.status(201).json({
      success: true,
      message: 'Project created successfully.',
      project,
    });
  } catch (error) {
    console.error('createProject error:', error);
    return res.status(500).json({ success: false, message: 'Server error creating project.' });
  }
};

// @route   PUT /api/projects/:id
// @desc    Update project
const updateProject = async (req, res) => {
  try {
    const project = await Project.findOne({ _id: req.params.id, userId: req.user._id });
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found.' });
    }

    const { title, category, description, progress } = req.body;

    if (title) project.title = title.trim();
    if (category) project.category = category.trim();
    if (description !== undefined) project.description = description.trim();
    if (progress !== undefined) project.progress = Number(progress);

    if (req.file) {
      // Remove old image if stored locally
      if (project.coverImage && project.coverImage.startsWith('/uploads/')) {
        const oldPath = path.join(__dirname, '..', project.coverImage);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      project.coverImage = `/uploads/${req.file.filename}`;
    }

    await project.save();

    return res.status(200).json({
      success: true,
      message: 'Project updated successfully.',
      project,
    });
  } catch (error) {
    console.error('updateProject error:', error);
    return res.status(500).json({ success: false, message: 'Server error updating project.' });
  }
};

// @route   DELETE /api/projects/:id
// @desc    Delete project and unlink tasks
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findOne({ _id: req.params.id, userId: req.user._id });
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found.' });
    }

    // Remove cover image file if exists
    if (project.coverImage && project.coverImage.startsWith('/uploads/')) {
      const imgPath = path.join(__dirname, '..', project.coverImage);
      if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
    }

    // Unassign tasks from this project rather than deleting them
    await Task.updateMany({ projectId: project._id }, { $set: { projectId: null } });

    await project.deleteOne();

    return res.status(200).json({
      success: true,
      message: 'Project deleted successfully.',
    });
  } catch (error) {
    console.error('deleteProject error:', error);
    return res.status(500).json({ success: false, message: 'Server error deleting project.' });
  }
};

module.exports = { getProjects, createProject, updateProject, deleteProject };
