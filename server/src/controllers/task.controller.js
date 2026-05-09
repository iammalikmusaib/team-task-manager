import { Activity } from '../models/Activity.js';
import { Project } from '../models/Project.js';
import { Task } from '../models/Task.js';
import { User } from '../models/User.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { assertObjectId } from '../utils/validators.js';

const populateTask = (query) =>
  query
    .populate('assignedTo', 'name email role avatarColor')
    .populate('createdBy', 'name email role avatarColor')
    .populate('project', 'name description members');

const visibleTaskFilter = (req) => {
  if (req.user.role === 'Admin') return {};
  return { assignedTo: req.user._id };
};

const ensureProjectAndAssignee = async (projectId, assigneeId) => {
  assertObjectId(projectId, 'project id');
  assertObjectId(assigneeId, 'assignee id');

  const [project, assignee] = await Promise.all([Project.findById(projectId), User.findById(assigneeId)]);
  if (!project) {
    const error = new Error('Project not found');
    error.statusCode = 404;
    throw error;
  }
  if (!assignee) {
    const error = new Error('Assigned user not found');
    error.statusCode = 400;
    throw error;
  }
  if (!project.members.map(String).includes(String(assigneeId))) {
    project.members.push(assigneeId);
    await project.save();
  }
  return project;
};

export const createTask = asyncHandler(async (req, res) => {
  const { title, description = '', status = 'Todo', progress = 0, priority = 'Medium', dueDate, assignedTo, project } = req.body;
  if (!title || !dueDate || !assignedTo || !project) {
    res.status(400);
    throw new Error('Title, due date, assignee, and project are required');
  }

  await ensureProjectAndAssignee(project, assignedTo);
  const task = await Task.create({
    title,
    description,
    status,
    progress: status === 'Completed' ? 100 : progress,
    priority,
    dueDate,
    assignedTo,
    project,
    createdBy: req.user._id
  });

  await Activity.create({
    actor: req.user._id,
    type: 'task_created',
    message: `created task "${task.title}"`,
    project,
    task: task._id
  });

  res.status(201).json(await populateTask(Task.findById(task._id)));
});

export const listTasks = asyncHandler(async (req, res) => {
  const { status, priority, project, assignedTo, search, overdue, pending } = req.query;
  const filter = visibleTaskFilter(req);

  if (status) filter.status = status;
  if (pending === 'true') filter.status = { $ne: 'Completed' };
  if (overdue === 'true') {
    filter.status = { $ne: 'Completed' };
    filter.dueDate = { $lt: new Date() };
  }
  if (priority) filter.priority = priority;
  if (project) {
    assertObjectId(project, 'project id');
    filter.project = project;
  }
  if (assignedTo && req.user.role === 'Admin') {
    assertObjectId(assignedTo, 'assignee id');
    filter.assignedTo = assignedTo;
  }
  if (search) {
    filter.$or = [{ title: new RegExp(search, 'i') }, { description: new RegExp(search, 'i') }];
  }

  const tasks = await populateTask(Task.find(filter).sort({ dueDate: 1, createdAt: -1 }));
  res.json(tasks);
});

export const getTask = asyncHandler(async (req, res) => {
  assertObjectId(req.params.id, 'task id');
  const task = await populateTask(Task.findOne({ _id: req.params.id, ...visibleTaskFilter(req) }));
  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }
  res.json(task);
});

export const updateTask = asyncHandler(async (req, res) => {
  assertObjectId(req.params.id, 'task id');
  const task = await Task.findById(req.params.id);
  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  const isAssignedMember = req.user.role === 'Member' && String(task.assignedTo) === String(req.user._id);
  if (req.user.role !== 'Admin' && !isAssignedMember) {
    res.status(403);
    throw new Error('You can only update your assigned tasks');
  }

  const previousStatus = task.status;

  if (req.user.role === 'Admin') {
    const { title, description, status, progress, priority, dueDate, assignedTo, project } = req.body;
    if (project || assignedTo) await ensureProjectAndAssignee(project || task.project, assignedTo || task.assignedTo);
    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (status !== undefined) task.status = status;
    if (progress !== undefined) task.progress = progress;
    if (priority !== undefined) task.priority = priority;
    if (dueDate !== undefined) task.dueDate = dueDate;
    if (assignedTo !== undefined) task.assignedTo = assignedTo;
    if (project !== undefined) task.project = project;
  } else {
    if (req.body.status === undefined && req.body.progress === undefined) {
      res.status(400);
      throw new Error('Members can only update task status or progress');
    }
    if (req.body.status !== undefined) task.status = req.body.status;
    if (req.body.progress !== undefined) task.progress = req.body.progress;
  }

  if (task.status === 'Completed') task.progress = 100;
  if (task.status === 'Todo' && task.progress > 0) task.status = 'In Progress';

  await task.save();
  await Activity.create({
    actor: req.user._id,
    type: previousStatus !== task.status ? 'status_changed' : 'task_updated',
    message: previousStatus !== task.status ? `moved "${task.title}" to ${task.status}` : `updated task "${task.title}"`,
    project: task.project,
    task: task._id
  });

  res.json(await populateTask(Task.findById(task._id)));
});

export const deleteTask = asyncHandler(async (req, res) => {
  assertObjectId(req.params.id, 'task id');
  const task = await Task.findById(req.params.id);
  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  await Activity.create({
    actor: req.user._id,
    type: 'task_deleted',
    message: `deleted task "${task.title}"`,
    project: task.project
  });
  await task.deleteOne();

  res.json({ message: 'Task deleted' });
});
