import { Edit2, FolderKanban, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import EmptyState from '../components/EmptyState.jsx';
import Modal from '../components/Modal.jsx';
import ProjectForm from '../components/ProjectForm.jsx';
import Spinner from '../components/Spinner.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useFetch } from '../hooks/useFetch.js';
import { api, getErrorMessage } from '../services/api.js';

export default function Projects() {
  const { isAdmin } = useAuth();
  const { data: projects = [], setData: setProjects, loading, refetch } = useFetch('/projects', { initialData: [] });
  const { data: users = [] } = useFetch('/users', { initialData: [] });
  const [editing, setEditing] = useState(null);
  const [open, setOpen] = useState(false);

  const remove = async (project) => {
    if (!confirm(`Delete "${project.name}" and its tasks?`)) return;
    try {
      await api.delete(`/projects/${project._id}`);
      setProjects(projects.filter((item) => item._id !== project._id));
      toast.success('Project deleted');
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-950 dark:text-white">Projects</h1>
          <p className="text-sm text-slate-500">Create spaces for team delivery and add the right people.</p>
        </div>
        {isAdmin ? <button className="btn-primary" onClick={() => { setEditing(null); setOpen(true); }}><Plus className="h-4 w-4" /> New project</button> : null}
      </div>
      {projects.length ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project) => (
            <article key={project._id} className="panel p-5">
              <div className="flex items-start justify-between gap-3">
                <Link to={`/projects/${project._id}`} className="flex items-center gap-3">
                  <span className="rounded-lg bg-blue-50 p-3 text-blue-700 dark:bg-blue-950 dark:text-blue-200"><FolderKanban className="h-5 w-5" /></span>
                  <span>
                    <span className="block font-bold text-slate-950 dark:text-white">{project.name}</span>
                    <span className="text-xs text-slate-500">{project.members?.length || 0} members</span>
                  </span>
                </Link>
                {isAdmin ? (
                  <div className="flex gap-1">
                    <button className="rounded-md p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800" onClick={() => { setEditing(project); setOpen(true); }} aria-label="Edit project"><Edit2 className="h-4 w-4" /></button>
                    <button className="rounded-md p-2 text-slate-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950" onClick={() => remove(project)} aria-label="Delete project"><Trash2 className="h-4 w-4" /></button>
                  </div>
                ) : null}
              </div>
              <p className="mt-4 line-clamp-3 text-sm text-slate-500 dark:text-slate-400">{project.description || 'No description yet.'}</p>
            </article>
          ))}
        </div>
      ) : (
        <EmptyState title="No projects yet" description="Create a project to start grouping work by team, initiative, or client." />
      )}
      <Modal open={open} title={editing ? 'Edit project' : 'New project'} onClose={() => setOpen(false)}>
        <ProjectForm project={editing} users={users} onSaved={() => { setOpen(false); refetch(); }} />
      </Modal>
    </div>
  );
}
