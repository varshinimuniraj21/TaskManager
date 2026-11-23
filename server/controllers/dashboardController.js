const Task = require('../models/Task');
const Project = require('../models/Project');

// @route   GET /api/dashboard/stats
// @desc    Get aggregated productivity stats from MongoDB
const getStats = async (req, res) => {
  try {
    const userId = req.user._id;

    // Total counts
    const totalTasks = await Task.countDocuments({ userId });
    const completedTasks = await Task.countDocuments({ userId, status: 'Completed' });
    const inProgressTasks = await Task.countDocuments({ userId, status: 'In Progress' });
    const editingTasks = await Task.countDocuments({ userId, status: 'Editing' });
    const pendingTasks = await Task.countDocuments({
      userId,
      status: { $in: ['Pending', 'Outline'] },
    });

    // Overdue tasks (due date in past and not completed)
    const now = new Date();
    const overdueTasks = await Task.countDocuments({
      userId,
      status: { $ne: 'Completed' },
      dueDate: { $lt: now },
    });

    // Today's completion
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const completedToday = await Task.countDocuments({
      userId,
      status: 'Completed',
      updatedAt: { $gte: startOfToday },
    });

    // Calculate dynamic radial metrics matching blueprint
    // Daily Word Count metric: base 100 + 50 per completed task
    const dailyTarget = 100;
    const dailyCompleted = completedToday > 0 ? completedToday * 50 : 100;

    // Weekly Miles metric: base 250 + active task milestones
    const weeklyTarget = 300;
    const weeklyMiles = completedTasks > 0 ? Math.min(300, 150 + completedTasks * 25) : 250;

    // Project completion average
    const projects = await Project.find({ userId });
    let avgProjectProgress = 0;
    if (projects.length > 0) {
      const sum = projects.reduce((acc, p) => acc + (p.progress || 0), 0);
      avgProjectProgress = Math.round(sum / projects.length);
    }

    return res.status(200).json({
      success: true,
      stats: {
        totalTasks,
        completedTasks,
        inProgressTasks,
        editingTasks,
        pendingTasks,
        overdueTasks,
        dailyTarget,
        dailyCompleted,
        weeklyTarget,
        weeklyMiles,
        avgProjectProgress,
        totalProjects: projects.length,
      },
    });
  } catch (error) {
    console.error('getStats error:', error);
    return res.status(500).json({ success: false, message: 'Server error retrieving stats.' });
  }
};

module.exports = { getStats };
