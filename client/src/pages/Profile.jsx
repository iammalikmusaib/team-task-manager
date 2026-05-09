import { Save } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import Avatar from '../components/Avatar.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { api, getErrorMessage } from '../services/api.js';

const colors = ['#2563eb', '#0891b2', '#16a34a', '#ea580c', '#7c3aed', '#db2777'];

export default function Profile() {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({ name: user?.name || '', avatarColor: user?.avatarColor || colors[0] });
  const [saving, setSaving] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      const { data } = await api.put('/users/profile', form);
      setUser(data);
      localStorage.setItem('ttm_user', JSON.stringify(data));
      toast.success('Profile updated');
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-950 dark:text-white">Profile</h1>
        <p className="text-sm text-slate-500">Manage your display name and avatar color.</p>
      </div>
      <form onSubmit={submit} className="panel space-y-5 p-6">
        <div className="flex items-center gap-4">
          <Avatar user={{ ...user, ...form }} size="h-16 w-16" />
          <div>
            <p className="font-bold text-slate-950 dark:text-white">{user.email}</p>
            <p className="text-sm text-slate-500">{user.role}</p>
          </div>
        </div>
        <div>
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">Name</label>
          <input className="input mt-1" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Avatar color</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {colors.map((color) => (
              <button
                type="button"
                key={color}
                onClick={() => setForm({ ...form, avatarColor: color })}
                className={`h-9 w-9 rounded-full border-4 ${form.avatarColor === color ? 'border-slate-900 dark:border-white' : 'border-transparent'}`}
                style={{ backgroundColor: color }}
                aria-label={`Use ${color}`}
              />
            ))}
          </div>
        </div>
        <button className="btn-primary" disabled={saving}>
          <Save className="h-4 w-4" />
          {saving ? 'Saving...' : 'Save changes'}
        </button>
      </form>
    </div>
  );
}
