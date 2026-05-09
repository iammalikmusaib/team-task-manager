import { ListFilter, Plus, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { useSearchParams } from 'react-router-dom';
import EmptyState from '../components/EmptyState.jsx';
import KanbanBoard from '../components/KanbanBoard.jsx';
import Modal from '../components/Modal.jsx';
import Spinner from '../components/Spinner.jsx';
import TaskForm from '../components/TaskForm.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useFetch } from '../hooks/useFetch.js';
import { api, getErrorMessage } from '../services/api.js';

export default function Tasks() {
  const { isAdmin } = useAuth();
  const [searchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    status: searchParams.get('status') || '',
    priority: searchParams.get('priority') || '',
    overdue: searchParams.get('overdue') || '',
    pending: searchParams.get('pending') || ''
  });
  const [editing, setEditing] = useState(null);
  const [open, setOpen] = useState(false);
  const params = useMemo(() => Object.fromEntries(Object.entries(filters).filter(([, value]) => value)), [filters]);
  const { data: tasks = [], setData: setTasks, loading, refetch } = useFetch('/tasks', { initialData: [], params });
  const { data: projects = [] } = useFetch('/projects', { initialData: [] });
  const { data: users = [] } = useFetch('/users', { initialData: [] });

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

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-950 dark:text-white">Tasks</h1>
        <p className="text-sm text-slate-500">Search, filter, assign, and move work across the board.</p>
        {filters.overdue || filters.pending ? (
          <button className="mt-2 text-sm font-semibold text-blue-600" onClick={() => setFilters({ ...filters, overdue: '', pending: '' })}>
            Clear dashboard filter
          </button>
        ) : null}
        </div>
        {isAdmin ? <button className="btn-primary" onClick={() => { setEditing(null); setOpen(true); }}><Plus className="h-4 w-4" /> New task</button> : null}
      </div>
      <section className="panel grid gap-3 p-4 md:grid-cols-[1fr_180px_180px]">
        <label className="relative">
          <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input className="input pl-9" placeholder="Search tasks" value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value })} />
        </label>
        <label className="relative">
          <ListFilter className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <select className="input pl-9" value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
            <option value="">All statuses</option>
            <option>Todo</option>
            <option>In Progress</option>
            <option>Completed</option>
          </select>
        </label>
        <select className="input" value={filters.priority} onChange={(e) => setFilters({ ...filters, priority: e.target.value })}>
          <option value="">All priorities</option>
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>
      </section>
      {loading ? <Spinner /> : tasks.length ? (
        <KanbanBoard tasks={tasks} setTasks={setTasks} onEdit={(task) => { setEditing(task); setOpen(true); }} onDelete={removeTask} canDelete={isAdmin} />
      ) : (
        <EmptyState title="No tasks match" description="Adjust your filters or create a new task." />
      )}
      <Modal open={open} title={editing ? 'Edit task' : 'New task'} onClose={() => setOpen(false)}>
        <TaskForm task={editing} projects={projects} users={users} onSaved={() => { setOpen(false); refetch(); }} />
      </Modal>
    </div>
  );
}
