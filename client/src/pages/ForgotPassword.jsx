import { Mail } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { api, getErrorMessage } from '../services/api.js';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetUrl, setResetUrl] = useState('');

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setResetUrl('');
    try {
      const { data } = await api.post('/auth/forgot-password', { email });
      toast.success(data.message);
      if (data.resetUrl) setResetUrl(data.resetUrl);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-8 shadow-soft dark:border-slate-800 dark:bg-slate-900">
      <h1 className="text-2xl font-bold text-slate-950 dark:text-white">Reset password</h1>
      <p className="mt-2 text-sm text-slate-500">Enter your account email and we will send a reset link.</p>
      <form onSubmit={submit} className="mt-6 space-y-4">
        <input className="input" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <button className="btn-primary w-full" disabled={loading}>
          <Mail className="h-4 w-4" />
          {loading ? 'Sending...' : 'Send reset link'}
        </button>
      </form>
      {resetUrl ? (
        <div className="mt-5 rounded-md border border-blue-200 bg-blue-50 p-3 text-sm text-blue-800 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-100">
          <p className="font-semibold">Development reset link</p>
          <Link className="mt-2 block break-all underline" to={new URL(resetUrl).pathname}>
            {resetUrl}
          </Link>
        </div>
      ) : null}
      <p className="mt-5 text-center text-sm text-slate-500">
        Remembered it? <Link className="font-semibold text-blue-600" to="/login">Log in</Link>
      </p>
    </div>
  );
}
