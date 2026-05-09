import { LogIn } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { getErrorMessage } from '../services/api.js';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      await login(form);
      toast.success('Welcome back');
      navigate(location.state?.from?.pathname || '/dashboard', { replace: true });
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-8 shadow-soft dark:border-slate-800 dark:bg-slate-900">
      <h1 className="text-2xl font-bold text-slate-950 dark:text-white">Log in</h1>
      <p className="mt-2 text-sm text-slate-500">Use your team credentials to continue.</p>
      <form onSubmit={submit} className="mt-6 space-y-4">
        <input className="input" type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        <input className="input" type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
        <div className="text-right">
          <Link className="text-sm font-semibold text-blue-600" to="/forgot-password">Forgot password?</Link>
        </div>
        <button className="btn-primary w-full" disabled={loading}>
          <LogIn className="h-4 w-4" />
          {loading ? 'Logging in...' : 'Log in'}
        </button>
      </form>
      <p className="mt-5 text-center text-sm text-slate-500">
        New here? <Link className="font-semibold text-blue-600" to="/signup">Create an account</Link>
      </p>
    </div>
  );
}
