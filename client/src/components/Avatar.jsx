import { initials } from '../utils/formatters.js';

export default function Avatar({ user, size = 'h-9 w-9' }) {
  return (
    <div
      className={`${size} flex shrink-0 items-center justify-center rounded-full text-xs font-bold text-white`}
      style={{ backgroundColor: user?.avatarColor || '#2563eb' }}
      title={user?.name}
    >
      {initials(user?.name)}
    </div>
  );
}
