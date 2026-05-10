import nodemailer from 'nodemailer';
import { env } from '../config/env.js';

export const sendPasswordResetEmail = async ({ to, resetUrl }) => {
  if (!env.SMTP_HOST || !env.SMTP_USER || !env.SMTP_PASS) {
    if (env.NODE_ENV !== 'production') {
      console.log(`Password reset link for ${to}: ${resetUrl}`);
      return { skipped: true };
    }

    const error = new Error('Email service is not configured');
    error.statusCode = 500;
    throw error;
  }

  const transporter = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_PORT === 465,
    auth: { user: env.SMTP_USER, pass: env.SMTP_PASS }
  });

  await transporter.sendMail({
    from: env.SMTP_FROM,
    to,
    subject: 'Reset your Team Task Manager password',
    html: `
      <p>You requested a password reset for Team Task Manager.</p>
      <p>This link expires in 15 minutes.</p>
      <p><a href="${resetUrl}">Reset your password</a></p>
    `
  });

  return { skipped: false };
};
