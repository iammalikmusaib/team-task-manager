import nodemailer from 'nodemailer';

export const sendPasswordResetEmail = async ({ to, resetUrl }) => {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM } = process.env;

  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    if (process.env.NODE_ENV !== 'production') {
      console.log(`Password reset link for ${to}: ${resetUrl}`);
      return { skipped: true };
    }

    const error = new Error('Email service is not configured');
    error.statusCode = 500;
    throw error;
  }

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT || 587),
    secure: Number(SMTP_PORT) === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS }
  });

  await transporter.sendMail({
    from: SMTP_FROM || 'Team Task Manager <no-reply@example.com>',
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
