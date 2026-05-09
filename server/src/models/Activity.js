import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema(
  {
    actor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: {
      type: String,
      enum: ['project_created', 'project_updated', 'project_deleted', 'task_created', 'task_updated', 'task_deleted', 'status_changed'],
      required: true
    },
    message: { type: String, required: true },
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
    task: { type: mongoose.Schema.Types.ObjectId, ref: 'Task' }
  },
  { timestamps: true }
);

export const Activity = mongoose.model('Activity', activitySchema);
