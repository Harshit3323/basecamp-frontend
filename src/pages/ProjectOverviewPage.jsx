import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppShell } from "../components/layout/AppShell";
import { ProjectTabs } from "../components/layout/ProjectTabs";
import { useProject, useDeleteProject } from "../hooks/queries/useProjects";
import { useProjectRole } from "../hooks/useProjectRole";
import { canManageProject } from "../utils/roleGuards";
import { ProjectFormModal } from "../components/projects/ProjectFormModal";
import { LoadingSpinner } from "../components/common/LoadingSpinner";
import { CheckSquare, Clock, CheckCircle2, Trash2, Edit3, Shield, Info } from "lucide-react";

export const ProjectOverviewPage = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { data: project, isLoading, isError, error } = useProject(projectId);
  const { role } = useProjectRole(projectId);
  const deleteMutation = useDeleteProject();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const isAdmin = canManageProject(role);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this project? All associated tasks, subtasks, notes, and member assignments will be permanently removed.")) {
      setIsDeleting(true);
      try {
        await deleteMutation.mutateAsync(projectId);
        navigate("/projects");
      } catch (err) {
        alert(err.response?.data?.message || "Failed to delete project");
      } finally {
        setIsDeleting(false);
      }
    }
  };

  if (isLoading) {
    return (
      <AppShell>
        <LoadingSpinner message="Loading workspace details..." />
      </AppShell>
    );
  }

  if (isError || !project) {
    return (
      <AppShell>
        <div className="p-6 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-center">
          <p className="font-semibold">Error loading project details</p>
          <p className="text-xs mt-1">{error?.message || "Project not found or accessible"}</p>
        </div>
      </AppShell>
    );
  }

  const tasks = project.tasks || [];
  const totalTasks = tasks.length;
  const todoTasks = tasks.filter((t) => t.status === "todo").length;
  const inProgressTasks = tasks.filter((t) => t.status === "in_progress").length;
  const doneTasks = tasks.filter((t) => t.status === "done").length;

  return (
    <AppShell>
      <ProjectTabs activeTab="Overview" />

      {/* Admin Quick Actions */}
      {isAdmin && (
        <div className="flex items-center justify-end gap-3 mb-6">
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer"
          >
            <Edit3 className="w-4 h-4 text-emerald-400" />
            <span>Edit Workspace</span>
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:text-rose-300 bg-rose-500/10 border border-rose-500/20 hover:border-rose-500/40 transition-all cursor-pointer disabled:opacity-50"
          >
            <Trash2 className="w-4 h-4" />
            <span>{isDeleting ? "Deleting..." : "Delete Workspace"}</span>
          </button>
        </div>
      )}

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold uppercase text-slate-400">Total Tasks</span>
            <CheckSquare className="w-5 h-5 text-emerald-400" />
          </div>
          <p className="text-3xl font-extrabold text-white">{totalTasks}</p>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold uppercase text-slate-400">To Do</span>
            <Clock className="w-5 h-5 text-amber-400" />
          </div>
          <p className="text-3xl font-extrabold text-white">{todoTasks}</p>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold uppercase text-slate-400">In Progress</span>
            <Clock className="w-5 h-5 text-cyan-400" />
          </div>
          <p className="text-3xl font-extrabold text-white">{inProgressTasks}</p>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold uppercase text-slate-400">Completed</span>
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          </div>
          <p className="text-3xl font-extrabold text-white">{doneTasks}</p>
        </div>
      </div>

      {/* Description & Details panel */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 mb-8">
        <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
          <Info className="w-5 h-5 text-emerald-400" />
          <span>About this Project</span>
        </h3>
        <p className="text-sm text-slate-300 leading-relaxed">
          {project.description || "No description provided for this project yet."}
        </p>
        <div className="mt-6 pt-4 border-t border-slate-800/80 text-xs text-slate-400 flex flex-wrap gap-6">
          <div>
            <span className="text-slate-500">Created:</span>{" "}
            {new Date(project.createdAt).toLocaleDateString()}
          </div>
          <div>
            <span className="text-slate-500">Last Updated:</span>{" "}
            {new Date(project.updatedAt).toLocaleDateString()}
          </div>
        </div>
      </div>

      {/* Edit modal */}
      <ProjectFormModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        initialData={project}
      />
    </AppShell>
  );
};
