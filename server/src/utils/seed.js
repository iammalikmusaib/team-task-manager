import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { connectDB } from '../config/db.js';
import { Project } from '../models/Project.js';
import { Task } from '../models/Task.js';
import { User } from '../models/User.js';

dotenv.config();

const run = async () => {
  await connectDB();
  await Promise.all([Task.deleteMany(), Project.deleteMany(), User.deleteMany()]);

  const password = await bcrypt.hash('password123', 10);
  const [admin, member] = await User.create([
    { name: 'Admin User', email: 'admin@example.com', password, role: 'Admin', avatarColor: '#2563eb' },
    { name: 'Member User', email: 'member@example.com', password, role: 'Member', avatarColor: '#16a34a' }
  ]);

  const project = await Project.create({
    name: 'Website Launch',
    description: 'Coordinate the launch checklist, content, and QA tasks.',
    createdBy: admin._id,
    members: [admin._id, member._id]
  });

  await Task.create([
    {
      title: 'Prepare launch checklist',
      description: 'Confirm content, tracking, QA, and rollback owners.',
      status: 'In Progress',
      progress: 45,
      priority: 'High',
      dueDate: new Date(Date.now() + 86400000 * 3),
      assignedTo: member._id,
      project: project._id,
      createdBy: admin._id
    },
    {
      title: 'Finalize homepage QA',
      description: 'Check responsive breakpoints and production links.',
      status: 'Todo',
      progress: 0,
      priority: 'Medium',
      dueDate: new Date(Date.now() + 86400000 * 5),
      assignedTo: admin._id,
      project: project._id,
      createdBy: admin._id
    }
  ]);

  console.log('Seed complete: admin@example.com / password123 and member@example.com / password123');
  process.exit(0);
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
