import mongoose from 'mongoose';

export const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

export const assertObjectId = (id, label = 'id') => {
  if (!isValidObjectId(id)) {
    const error = new Error(`Invalid ${label}`);
    error.statusCode = 400;
    throw error;
  }
};

export const isEmail = (email) => /^\S+@\S+\.\S+$/.test(email);
