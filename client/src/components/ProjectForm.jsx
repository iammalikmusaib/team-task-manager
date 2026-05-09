import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { api, getErrorMessage } from '../services/api.js';

export default function ProjectForm({ project, users, onSaved }) {
  const [form, setForm] = useState({ name: '', description: '', members: [] });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (project) {
      setForm({
        name: project.name,
        description: project.description || '',
        members: project.members?.map((member) => member._id) || []
      });
    }
  }, [project]);

  const toggleMember = (id) => {
    setForm((current) => ({
      ...current,
      members: current.members.includes(id) ? current.members.filter((memberId) => memberId !== id) : [...current.members, id]
    }));
  };

  const submit = async (event) => {
    event.preventDefault();
    if (!form.name.trim()) return toast.error('Project name is required');
    setSaving(true);
    try {
      const response = project ? await api.put(`/projects/${project._id}`, form) : await api.post('/projects', form);
      toast.success(project ? 'Project updated' : 'Project created');
      onSaved(response.data);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">Name</label>
        <input className="input mt-1" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
      </div>
      <div>
        <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">Description</label>
        <textarea className="input mt-1 min-h-28" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
      </div>
      <div>
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Members</p>
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          {users.map((user) => (
            <label key={user._id} className="flex items-center gap-2 rounded-md border border-slate-200 p-3 text-sm dark:border-slate-700">
              <input type="checkbox" checked={form.members.includes(user._id)} onChange={() => toggleMember(user._id)} />
              <span className="font-medium text-slate-800 dark:text-slate-100">{user.name}</span>
              <span className="text-slate-500">{user.role}</span>
            </label>
          ))}
        </div>
      </div>
      <button disabled={saving} className="btn-primary w-full">{saving ? 'Saving...' : 'Save project'}</button>
    </form>
  );
}
