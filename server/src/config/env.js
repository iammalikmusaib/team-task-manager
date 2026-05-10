import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const requireEnv = (key) => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`${key} is required. Add it to server/.env locally or Railway variables in production.`);
  }
  return value;
};

const optionalEnv = (key, fallback = '') => process.env[key] || fallback;

export const env = {
  NODE_ENV: optionalEnv('NODE_ENV', 'development'),
  PORT: Number(optionalEnv('PORT', '5000')),
  MONGO_URI: requireEnv('MONGO_URI'),
  JWT_SECRET: requireEnv('JWT_SECRET'),
  JWT_EXPIRES_IN: optionalEnv('JWT_EXPIRES_IN', '7d'),
  CLIENT_URL: optionalEnv('CLIENT_URL'),
  PUBLIC_APP_URL: optionalEnv('PUBLIC_APP_URL', optionalEnv('CLIENT_URL')),
  SMTP_HOST: optionalEnv('SMTP_HOST'),
  SMTP_PORT: Number(optionalEnv('SMTP_PORT', '587')),
  SMTP_USER: optionalEnv('SMTP_USER'),
  SMTP_PASS: optionalEnv('SMTP_PASS'),
  SMTP_FROM: optionalEnv('SMTP_FROM', 'Team Task Manager <no-reply@example.com>')
};
