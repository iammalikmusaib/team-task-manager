import { Link } from 'react-router-dom';

export default function StatCard({ title, value, icon: Icon, tone = 'blue', to }) {
  const tones = {
    blue: 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-200',
    green: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-200',
    amber: 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-200',
    red: 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-200'
  };

  const content = (
    <>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
          <p className="mt-2 text-3xl font-bold text-slate-950 dark:text-white">{value}</p>
        </div>
        <div className={`rounded-lg p-3 ${tones[tone]}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
      {to ? <p className="mt-4 text-xs font-semibold text-blue-600 dark:text-blue-300">Open {title.toLowerCase()}</p> : null}
    </>
  );

  if (to) {
    return (
      <Link to={to} className="panel block p-5 transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:hover:border-blue-700">
        {content}
      </Link>
    );
  }

  return (
    <div className="panel p-5">
      {content}
    </div>
  );
}
