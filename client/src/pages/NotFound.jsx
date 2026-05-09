import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 p-6 dark:bg-slate-950">
      <div className="text-center">
        <p className="text-sm font-bold uppercase tracking-wide text-blue-600">404</p>
        <h1 className="mt-3 text-3xl font-bold text-slate-950 dark:text-white">Page not found</h1>
        <p className="mt-2 text-slate-500">The page you are looking for does not exist.</p>
        <Link className="btn-primary mt-6" to="/dashboard">Go to dashboard</Link>
      </div>
    </main>
  );
}
