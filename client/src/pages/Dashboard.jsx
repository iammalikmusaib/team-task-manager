import { AlertTriangle, CheckCircle2, Clock, FolderKanban, ListChecks } from 'lucide-react';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import Spinner from '../components/Spinner.jsx';
import StatCard from '../components/StatCard.jsx';
import { useFetch } from '../hooks/useFetch.js';
import { formatDate } from '../utils/formatters.js';

const colors = ['#64748b', '#2563eb', '#10b981'];

export default function Dashboard() {
  const { data, loading, error } = useFetch('/dashboard');
  if (loading) return <Spinner />;
  if (error) return <p className="text-sm text-red-600">{error}</p>;

  const chartData = ['Todo', 'In Progress', 'Completed'].map((status) => ({
    status,
    count: data.tasksByStatus.find((item) => item.status === status)?.count || 0
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-950 dark:text-white">Dashboard</h1>
        <p className="text-sm text-slate-500">A live read on project load, task progress, and recent movement.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <StatCard title="Projects" value={data.totalProjects} icon={FolderKanban} to="/projects" />
        <StatCard title="Tasks" value={data.totalTasks} icon={ListChecks} to="/tasks" />
        <StatCard title="Completed" value={data.completedTasks} icon={CheckCircle2} tone="green" to="/tasks?status=Completed" />
        <StatCard title="Pending" value={data.pendingTasks} icon={Clock} tone="amber" to="/tasks?pending=true" />
        <StatCard title="Overdue" value={data.overdueTasks} icon={AlertTriangle} tone="red" to="/tasks?overdue=true" />
      </div>
      <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
        <section className="panel p-5">
          <h2 className="text-base font-bold text-slate-950 dark:text-white">Tasks by status</h2>
          <div className="mt-4 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={chartData} dataKey="count" nameKey="status" innerRadius={70} outerRadius={110} paddingAngle={4}>
                  {chartData.map((entry, index) => <Cell key={entry.status} fill={colors[index]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </section>
        <section className="panel p-5">
          <h2 className="text-base font-bold text-slate-950 dark:text-white">Recent activity</h2>
          <div className="mt-4 space-y-4">
            {data.recentActivity.length ? data.recentActivity.map((activity) => (
              <div key={activity._id} className="border-b border-slate-100 pb-3 last:border-0 dark:border-slate-800">
                <p className="text-sm font-medium text-slate-800 dark:text-slate-100">
                  {activity.actor?.name || 'Someone'} {activity.message}
                </p>
                <p className="mt-1 text-xs text-slate-500">{formatDate(activity.createdAt)}</p>
              </div>
            )) : <p className="text-sm text-slate-500">No activity yet.</p>}
          </div>
        </section>
      </div>
    </div>
  );
}
