import crypto from 'crypto';
import { User } from '../models/User.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendPasswordResetEmail } from '../utils/email.js';
import { signToken } from '../utils/token.js';
import { isEmail } from '../utils/validators.js';

const avatarColors = ['#2563eb', '#0891b2', '#16a34a', '#ea580c', '#7c3aed', '#db2777'];

const authPayload = (user) => ({
  user,
  token: signToken(user._id)
});

export const signup = asyncHandler(async (req, res) => {
  const { name, email, password, role = 'Member' } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Name, email, and password are required');
  }
  if (!isEmail(email)) {
    res.status(400);
    throw new Error('Enter a valid email address');
  }
  if (password.length < 6) {
    res.status(400);
    throw new Error('Password must be at least 6 characters');
  }
  if (!['Admin', 'Member'].includes(role)) {
    res.status(400);
    throw new Error('Invalid role');
  }

  const exists = await User.findOne({ email });
  if (exists) {
    res.status(409);
    throw new Error('Email is already registered');
  }

  const user = await User.create({
    name,
    email,
    password,
    role,
    avatarColor: avatarColors[Math.floor(Math.random() * avatarColors.length)]
  });

  res.status(201).json(authPayload(user));
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error('Email and password are required');
  }

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  res.json(authPayload(user));
});

export const me = asyncHandler(async (req, res) => {
  res.json({ user: req.user });
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email || !isEmail(email)) {
    res.status(400);
    throw new Error('Enter a valid email address');
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.json({ message: 'If that email exists, a reset link has been sent' });
  }

  const token = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  const clientUrl = (process.env.CLIENT_URL || 'http://localhost:5173').split(',')[0];
  const resetUrl = `${clientUrl}/reset-password/${token}`;
  await sendPasswordResetEmail({ to: user.email, resetUrl });

  return res.json({
    message: 'If that email exists, a reset link has been sent',
    resetUrl: process.env.NODE_ENV !== 'production' ? resetUrl : undefined
  });
});

export const resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  if (!password || password.length < 6) {
    res.status(400);
    throw new Error('Password must be at least 6 characters');
  }

  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() }
  }).select('+passwordResetToken +passwordResetExpires');

  if (!user) {
    res.status(400);
    throw new Error('Reset link is invalid or expired');
  }

  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  return res.json(authPayload(user));
});
