export default function Spinner({ label = 'Loading' }) {
  return (
    <div className="flex items-center gap-3 text-sm font-medium text-slate-500 dark:text-slate-400">
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-blue-600" />
      {label}
    </div>
  );
}
