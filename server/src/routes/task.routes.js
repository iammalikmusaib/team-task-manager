import { Router } from 'express';
import { createTask, deleteTask, getTask, listTasks, updateTask } from '../controllers/task.controller.js';
import { authorize, protect } from '../middleware/auth.middleware.js';

const router = Router();

router.use(protect);
router.route('/').get(listTasks).post(authorize('Admin'), createTask);
router.route('/:id').get(getTask).put(updateTask).delete(authorize('Admin'), deleteTask);

export default router;
