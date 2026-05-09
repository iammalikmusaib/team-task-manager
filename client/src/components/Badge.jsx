const styles = {
  Todo: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200',
  'In Progress': 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-200',
  Completed: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-200',
  Low: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-200',
  Medium: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200',
  High: 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-200',
  Overdue: 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-200'
};

export default function Badge({ children }) {
  return <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${styles[children] || styles.Todo}`}>{children}</span>;
}
