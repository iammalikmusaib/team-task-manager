import dotenv from 'dotenv';
import { app } from './app.js';
import { connectDB } from './config/db.js';

dotenv.config();

const DEFAULT_PORT = Number(process.env.PORT || 5000);
const MAX_PORT_ATTEMPTS = process.env.NODE_ENV === 'production' ? 1 : 10;

const listen = (port, attemptsLeft = MAX_PORT_ATTEMPTS) => {
  const server = app.listen(port, () => {
    console.log(`App running at http://localhost:${port}`);
    console.log(`API health: http://localhost:${port}/api/health`);
  });

  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE' && attemptsLeft > 1) {
      const nextPort = port + 1;
      console.warn(`Port ${port} is busy. Trying ${nextPort}...`);
      listen(nextPort, attemptsLeft - 1);
      return;
    }

    console.error(`Failed to start server on port ${port}:`, error.message);
    process.exit(1);
  });
};

connectDB()
  .then(() => {
    listen(DEFAULT_PORT);
  })
  .catch((error) => {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  });
