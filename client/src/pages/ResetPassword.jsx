import { KeyRound } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { api, getErrorMessage } from '../services/api.js';

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [form, setForm] = useState({ password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
    if (form.password !== form.confirmPassword) return toast.error('Passwords do not match');

    setLoading(true);
    try {
      const { data } = await api.post(`/auth/reset-password/${token}`, { password: form.password });
      localStorage.setItem('ttm_token', data.token);
      localStorage.setItem('ttm_user', JSON.stringify(data.user));
      setUser(data.user);
      toast.success('Password updated');
      navigate('/dashboard', { replace: true });
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-8 shadow-soft dark:border-slate-800 dark:bg-slate-900">
      <h1 className="text-2xl font-bold text-slate-950 dark:text-white">Choose new password</h1>
      <p className="mt-2 text-sm text-slate-500">Reset links expire after 15 minutes.</p>
      <form onSubmit={submit} className="mt-6 space-y-4">
        <input
          className="input"
          type="password"
          placeholder="New password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />
        <input
          className="input"
          type="password"
          placeholder="Confirm password"
          value={form.confirmPassword}
          onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
          required
        />
        <button className="btn-primary w-full" disabled={loading}>
          <KeyRound className="h-4 w-4" />
          {loading ? 'Updating...' : 'Update password'}
        </button>
      </form>
      <p className="mt-5 text-center text-sm text-slate-500">
        Need a new link? <Link className="font-semibold text-blue-600" to="/forgot-password">Request reset</Link>
      </p>
    </div>
  );
}
