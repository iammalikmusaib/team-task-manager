import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext.jsx';
import { api, getErrorMessage } from '../services/api.js';
import TaskCard from './TaskCard.jsx';

const columns = ['Todo', 'In Progress', 'Completed'];

export default function KanbanBoard({ tasks, setTasks, onEdit, onDelete, canDelete }) {
  const { user, isAdmin } = useAuth();

  const saveTaskUpdate = async (taskId, payload) => {
    const previous = tasks;
    setTasks(tasks.map((task) => (task._id === taskId ? { ...task, ...payload } : task)));
    try {
      const { data } = await api.put(`/tasks/${taskId}`, payload);
      setTasks((current) => current.map((task) => (task._id === taskId ? data : task)));
    } catch (error) {
      setTasks(previous);
      toast.error(getErrorMessage(error));
    }
  };

  const changeStatus = (taskId, status) => {
    saveTaskUpdate(taskId, { status, progress: status === 'Completed' ? 100 : undefined });
  };

  const changeProgress = (task, progress) => {
    const status = progress === 100 ? 'Completed' : progress > 0 && task.status === 'Todo' ? 'In Progress' : task.status;
    saveTaskUpdate(task._id, { progress, status });
  };

  const canUpdateProgress = (task) => isAdmin || String(task.assignedTo?._id) === String(user?._id);

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {columns.map((status) => (
        <div
          key={status}
          onDragOver={(event) => event.preventDefault()}
          onDrop={(event) => changeStatus(event.dataTransfer.getData('taskId'), status)}
          className="min-h-80 rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950"
        >
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">{status}</h3>
            <span className="rounded-full bg-white px-2 py-1 text-xs font-semibold text-slate-500 dark:bg-slate-900">
              {tasks.filter((task) => task.status === status).length}
            </span>
          </div>
          <div className="space-y-3">
            {tasks
              .filter((task) => task.status === status)
              .map((task) => (
                <div key={task._id} draggable onDragStart={(event) => event.dataTransfer.setData('taskId', task._id)}>
                  <TaskCard
                    task={task}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    canDelete={canDelete}
                    canUpdateProgress={canUpdateProgress(task)}
                    onProgressChange={changeProgress}
                  />
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}
