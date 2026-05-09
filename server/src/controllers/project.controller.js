import { Activity } from '../models/Activity.js';
import { Project } from '../models/Project.js';
import { Task } from '../models/Task.js';
import { User } from '../models/User.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { assertObjectId } from '../utils/validators.js';

const populateProject = (query) =>
  query.populate('createdBy', 'name email role avatarColor').populate('members', 'name email role avatarColor');

const ensureMembersExist = async (memberIds = []) => {
  const uniqueIds = [...new Set(memberIds.map(String))];
  uniqueIds.forEach((id) => assertObjectId(id, 'member id'));
  const count = await User.countDocuments({ _id: { $in: uniqueIds } });
  if (count !== uniqueIds.length) {
    const error = new Error('One or more members do not exist');
    error.statusCode = 400;
    throw error;
  }
  return uniqueIds;
};

export const createProject = asyncHandler(async (req, res) => {
  const { name, description = '', members = [] } = req.body;
  if (!name) {
    res.status(400);
    throw new Error('Project name is required');
  }

  const memberIds = await ensureMembersExist([...members, req.user._id]);
  const project = await Project.create({ name, description, members: memberIds, createdBy: req.user._id });

  await Activity.create({
    actor: req.user._id,
    type: 'project_created',
    message: `created project "${project.name}"`,
    project: project._id
  });

  res.status(201).json(await populateProject(Project.findById(project._id)));
});

export const listProjects = asyncHandler(async (req, res) => {
  const filter = req.user.role === 'Admin' ? {} : { members: req.user._id };
  const projects = await populateProject(Project.find(filter).sort({ updatedAt: -1 }));
  res.json(projects);
});

export const getProject = asyncHandler(async (req, res) => {
  assertObjectId(req.params.id, 'project id');
  const filter = req.user.role === 'Admin' ? { _id: req.params.id } : { _id: req.params.id, members: req.user._id };
  const project = await populateProject(Project.findOne(filter));
  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }
  res.json(project);
});

export const updateProject = asyncHandler(async (req, res) => {
  assertObjectId(req.params.id, 'project id');
  const project = await Project.findById(req.params.id);
  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

  const { name, description, members } = req.body;
  if (name !== undefined) project.name = name;
  if (description !== undefined) project.description = description;
  if (members !== undefined) project.members = await ensureMembersExist([...members, project.createdBy]);

  await project.save();
  await Activity.create({
    actor: req.user._id,
    type: 'project_updated',
    message: `updated project "${project.name}"`,
    project: project._id
  });

  res.json(await populateProject(Project.findById(project._id)));
});

export const deleteProject = asyncHandler(async (req, res) => {
  assertObjectId(req.params.id, 'project id');
  const project = await Project.findById(req.params.id);
  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

  await Task.deleteMany({ project: project._id });
  await Activity.create({
    actor: req.user._id,
    type: 'project_deleted',
    message: `deleted project "${project.name}"`
  });
  await project.deleteOne();

  res.json({ message: 'Project deleted' });
});
