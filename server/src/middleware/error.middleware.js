import { env } from '../config/env.js';

export const notFound = (req, _res, next) => {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

export const errorHandler = (err, _req, res, _next) => {
  const statusCode = err.statusCode || (res.statusCode === 200 ? 500 : res.statusCode);

  if (err.name === 'CastError') {
    return res.status(400).json({ message: 'Invalid resource id' });
  }

  if (err.code === 11000) {
    return res.status(409).json({ message: 'A record with that value already exists' });
  }

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      message: Object.values(err.errors)
        .map((item) => item.message)
        .join(', ')
    });
  }

  return res.status(statusCode).json({
    message: err.message || 'Server error',
    stack: env.NODE_ENV === 'production' ? undefined : err.stack
  });
};
