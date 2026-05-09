import { ArrowLeft, Plus } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useParams } from 'react-router-dom';
import Avatar from '../components/Avatar.jsx';
import EmptyState from '../components/EmptyState.jsx';
import KanbanBoard from '../components/KanbanBoard.jsx';
import Modal from '../components/Modal.jsx';
import Spinner from '../components/Spinner.jsx';
import TaskForm from '../components/TaskForm.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useFetch } from '../hooks/useFetch.js';
import { api, getErrorMessage } from '../services/api.js';

export default function ProjectDetail() {
  const { id } = useParams();
  const { isAdmin } = useAuth();
  const { data: project, loading } = useFetch(`/projects/${id}`);
  const { data: tasks = [], setData: setTasks, refetch } = useFetch('/tasks', { initialData: [], params: { project: id } });
  const { data: users = [] } = useFetch('/users', { initialData: [] });
  const [editing, setEditing] = useState(null);
  const [open, setOpen] = useState(false);

  const removeTask = async (task) => {
    if (!confirm(`Delete "${task.title}"?`)) return;
    try {
      await api.delete(`/tasks/${task._id}`);
      setTasks(tasks.filter((item) => item._id !== task._id));
      toast.success('Task deleted');
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  if (loading || !project) return <Spinner />;

  return (
    <div className="space-y-6">
      <Link to="/projects" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-blue-600">
        <ArrowLeft className="h-4 w-4" /> Back to projects
      </Link>
      <section className="panel p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-950 dark:text-white">{project.name}</h1>
            <p className="mt-2 max-w-3xl text-sm text-slate-500 dark:text-slate-400">{project.description || 'No description yet.'}</p>
          </div>
          {isAdmin ? <button className="btn-primary" onClick={() => { setEditing(null); setOpen(true); }}><Plus className="h-4 w-4" /> New task</button> : null}
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          {project.members?.map((member) => (
            <div key={member._id} className="flex items-center gap-2 rounded-full border border-slate-200 py-1 pl-1 pr-3 text-sm dark:border-slate-800">
              <Avatar user={member} size="h-7 w-7" />
              {member.name}
            </div>
          ))}
        </div>
      </section>
      {tasks.length ? (
        <KanbanBoard tasks={tasks} setTasks={setTasks} onEdit={(task) => { setEditing(task); setOpen(true); }} onDelete={removeTask} canDelete={isAdmin} />
      ) : (
        <EmptyState title="No tasks in this project" description="Add the first task and assign it to a teammate." />
      )}
      <Modal open={open} title={editing ? 'Edit task' : 'New task'} onClose={() => setOpen(false)}>
        <TaskForm task={editing} projects={[project]} users={users} defaultProject={id} onSaved={() => { setOpen(false); refetch(); }} />
      </Modal>
    </div>
  );
}
