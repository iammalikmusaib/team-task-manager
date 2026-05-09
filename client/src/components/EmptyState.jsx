import { ClipboardList } from 'lucide-react';

export default function EmptyState({ title, description, action }) {
  return (
    <div className="panel flex flex-col items-center justify-center px-6 py-12 text-center">
      <ClipboardList className="h-10 w-10 text-slate-400" />
      <h3 className="mt-4 text-base font-semibold text-slate-900 dark:text-white">{title}</h3>
      <p className="mt-1 max-w-md text-sm text-slate-500 dark:text-slate-400">{description}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
