import { Activity } from '../models/Activity.js';
import { Project } from '../models/Project.js';
import { Task } from '../models/Task.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getDashboard = asyncHandler(async (req, res) => {
  const taskFilter = req.user.role === 'Admin' ? {} : { assignedTo: req.user._id };
  const projectFilter = req.user.role === 'Admin' ? {} : { members: req.user._id };
  const now = new Date();

  const [totalProjects, totalTasks, completedTasks, overdueTasks, tasksByStatus, recentActivity] = await Promise.all([
    Project.countDocuments(projectFilter),
    Task.countDocuments(taskFilter),
    Task.countDocuments({ ...taskFilter, status: 'Completed' }),
    Task.countDocuments({ ...taskFilter, status: { $ne: 'Completed' }, dueDate: { $lt: now } }),
    Task.aggregate([
      { $match: taskFilter },
      { $group: { _id: '$status', count: { $sum: 1 } } },
      { $project: { _id: 0, status: '$_id', count: 1 } }
    ]),
    Activity.find()
      .populate('actor', 'name avatarColor')
      .populate('project', 'name')
      .populate('task', 'title')
      .sort({ createdAt: -1 })
      .limit(8)
  ]);

  res.json({
    totalProjects,
    totalTasks,
    completedTasks,
    pendingTasks: totalTasks - completedTasks,
    overdueTasks,
    tasksByStatus,
    recentActivity
  });
});
