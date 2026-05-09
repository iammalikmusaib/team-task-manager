import { User } from '../models/User.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const listUsers = asyncHandler(async (_req, res) => {
  const users = await User.find().sort({ name: 1 });
  res.json(users);
});

export const updateProfile = asyncHandler(async (req, res) => {
  const { name, avatarColor } = req.body;
  if (name) req.user.name = name;
  if (avatarColor) req.user.avatarColor = avatarColor;
  await req.user.save();
  res.json(req.user);
});
