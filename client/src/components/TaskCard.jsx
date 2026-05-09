import { Calendar, Trash2, UserRound } from 'lucide-react';
import Badge from './Badge.jsx';
import Avatar from './Avatar.jsx';
import { formatDate, isOverdue } from '../utils/formatters.js';

export default function TaskCard({ task, onEdit, onDelete, canDelete, canUpdateProgress = false, onProgressChange }) {
  const progress = task.progress ?? (task.status === 'Completed' ? 100 : 0);

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-start justify-between gap-3">
        <div>
          <button onClick={() => onEdit(task)} className="text-left text-sm font-semibold text-slate-950 hover:text-blue-600 dark:text-white">
            {task.title}
          </button>
          <p className="mt-1 line-clamp-2 text-sm text-slate-500 dark:text-slate-400">{task.description || 'No description'}</p>
        </div>
        {canDelete ? (
          <button onClick={() => onDelete(task)} className="rounded-md p-2 text-slate-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950" aria-label="Delete task">
            <Trash2 className="h-4 w-4" />
          </button>
        ) : null}
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <Badge>{task.status}</Badge>
        <Badge>{task.priority}</Badge>
        {isOverdue(task) ? <Badge>Overdue</Badge> : null}
      </div>
      <div className="mt-4">
        <div className="mb-1 flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
          <span>Progress</span>
          <span>{progress}%</span>
        </div>
        <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800">
          <div className="h-2 rounded-full bg-blue-600 transition-all" style={{ width: `${progress}%` }} />
        </div>
        {canUpdateProgress ? (
          <input
            type="range"
            min="0"
            max="100"
            step="5"
            value={progress}
            className="mt-3 w-full accent-blue-600"
            onClick={(event) => event.stopPropagation()}
            onMouseDown={(event) => event.stopPropagation()}
            onChange={(event) => onProgressChange?.(task, Number(event.target.value))}
            aria-label={`Update progress for ${task.title}`}
          />
        ) : null}
      </div>
      <div className="mt-4 flex items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
        <span className="flex items-center gap-1.5">
          <Calendar className="h-4 w-4" />
          {formatDate(task.dueDate)}
        </span>
        <span className="flex items-center gap-2">
          <UserRound className="h-4 w-4" />
          <Avatar user={task.assignedTo} size="h-7 w-7" />
        </span>
      </div>
    </div>
  );
}
