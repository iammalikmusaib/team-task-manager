import { CheckCircle2 } from 'lucide-react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function AuthLayout() {
  const { user } = useAuth();
  if (user) return <Navigate to="/dashboard" replace />;

  return (
    <main className="grid min-h-screen bg-slate-50 dark:bg-slate-950 lg:grid-cols-[1fr_1.1fr]">
      <section className="hidden bg-slate-950 p-10 text-white lg:flex lg:flex-col lg:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-md bg-white/10 px-3 py-2 text-sm font-semibold">
            <CheckCircle2 className="h-5 w-5 text-emerald-300" />
            Team Task Manager
          </div>
          <h1 className="mt-12 max-w-xl text-5xl font-bold leading-tight">Plan, assign, and ship team work from one calm workspace.</h1>
        </div>
        <div className="grid gap-4 text-sm text-slate-300">
          <p>Role-based project controls, task ownership, live dashboard metrics, and a responsive SaaS interface.</p>
          <p>Demo users can be created with the seed command after connecting MongoDB.</p>
        </div>
      </section>
      <section className="flex items-center justify-center p-6">
        <Outlet />
      </section>
    </main>
  );
}
