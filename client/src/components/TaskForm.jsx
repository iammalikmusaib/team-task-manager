import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext.jsx';
import { api, getErrorMessage } from '../services/api.js';

const today = new Date().toISOString().slice(0, 10);

export default function TaskForm({ task, projects, users, defaultProject, onSaved }) {
  const { isAdmin } = useAuth();
  const [form, setForm] = useState({
    title: '',
    description: '',
    status: 'Todo',
    progress: 0,
    priority: 'Medium',
    dueDate: today,
    assignedTo: '',
    project: defaultProject || ''
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (task) {
      setForm({
        title: task.title,
        description: task.description || '',
        status: task.status,
        progress: task.progress ?? (task.status === 'Completed' ? 100 : 0),
        priority: task.priority,
        dueDate: task.dueDate?.slice(0, 10),
        assignedTo: task.assignedTo?._id,
        project: task.project?._id
      });
    }
  }, [task]);

  const submit = async (event) => {
    event.preventDefault();
    if (isAdmin && (!form.title.trim() || !form.assignedTo || !form.project)) return toast.error('Title, project, and assignee are required');
    setSaving(true);
    try {
      const payload = isAdmin ? form : { status: form.status, progress: Number(form.progress) };
      const response = task ? await api.put(`/tasks/${task._id}`, payload) : await api.post('/tasks', form);
      toast.success(task ? 'Task updated' : 'Task created');
      onSaved(response.data);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
      {isAdmin ? <div className="sm:col-span-2">
        <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">Title</label>
        <input className="input mt-1" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
      </div> : null}
      {isAdmin ? <div className="sm:col-span-2">
        <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">Description</label>
        <textarea className="input mt-1 min-h-24" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
      </div> : null}
      {isAdmin ? <Select label="Project" value={form.project} onChange={(project) => setForm({ ...form, project })}>
        <option value="">Select project</option>
        {projects.map((project) => <option key={project._id} value={project._id}>{project.name}</option>)}
      </Select> : null}
      {isAdmin ? <Select label="Assignee" value={form.assignedTo} onChange={(assignedTo) => setForm({ ...form, assignedTo })}>
        <option value="">Select member</option>
        {users.map((user) => <option key={user._id} value={user._id}>{user.name}</option>)}
      </Select> : null}
      <Select label="Status" value={form.status} onChange={(status) => setForm({ ...form, status, progress: status === 'Completed' ? 100 : form.progress })}>
        {['Todo', 'In Progress', 'Completed'].map((item) => <option key={item}>{item}</option>)}
      </Select>
      {isAdmin ? <Select label="Priority" value={form.priority} onChange={(priority) => setForm({ ...form, priority })}>
        {['Low', 'Medium', 'High'].map((item) => <option key={item}>{item}</option>)}
      </Select> : null}
      <div className={isAdmin ? '' : 'sm:col-span-2'}>
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">Progress</label>
          <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{form.progress}%</span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          step="5"
          className="mt-3 w-full accent-blue-600"
          value={form.progress}
          onChange={(e) => setForm({ ...form, progress: Number(e.target.value), status: Number(e.target.value) === 100 ? 'Completed' : form.status === 'Completed' ? 'In Progress' : form.status })}
        />
      </div>
      {isAdmin ? <div>
        <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">Due date</label>
        <input type="date" className="input mt-1" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} />
      </div> : null}
      <div className="flex items-end">
        <button disabled={saving} className="btn-primary w-full">{saving ? 'Saving...' : 'Save task'}</button>
      </div>
    </form>
  );
}

function Select({ label, value, onChange, children }) {
  return (
    <div>
      <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">{label}</label>
      <select className="input mt-1" value={value} onChange={(e) => onChange(e.target.value)}>
        {children}
      </select>
    </div>
  );
}
