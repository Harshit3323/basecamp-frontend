import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { AppShell } from "../components/layout/AppShell";
import { ProjectTabs } from "../components/layout/ProjectTabs";
import { useProjectTasks } from "../hooks/queries/useTasks";
import { useProjectRole } from "../hooks/useProjectRole";
import { canManageTasks } from "../utils/roleGuards";
import { TaskList } from "../components/tasks/TaskList";
import { TaskBoard } from "../components/tasks/TaskBoard";
import { TaskFormModal } from "../components/tasks/TaskFormModal";
import { TaskDetailModal } from "../components/tasks/TaskDetailModal";
import { LoadingSpinner } from "../components/common/LoadingSpinner";
import { EmptyState } from "../components/common/EmptyState";
import { Plus, List, LayoutGrid, CheckSquare } from "lucide-react";

export const ProjectTasksPage = () => {
  const { projectId } = useParams();
  const { data: tasks = [], isLoading, isError, error } = useProjectTasks(projectId);
  const { role } = useProjectRole(projectId);

  const [viewMode, setViewMode] = useState("list"); // "list" | "board"
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [selectedTaskForForm, setSelectedTaskForForm] = useState(null);
  const [selectedTaskIdForDetail, setSelectedTaskIdForDetail] = useState(null);

  const canManage = canManageTasks(role);

  const handleOpenCreateModal = () => {
    setSelectedTaskForForm(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (task) => {
    setSelectedTaskForForm(task);
    setIsFormModalOpen(true);
  };

  return (
    <AppShell>
      <ProjectTabs activeTab="Tasks" />

      {/* Header controls: View mode + New Task button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 p-1 rounded-xl w-fit">
          <button
            onClick={() => setViewMode("list")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              viewMode === "list"
                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <List className="w-4 h-4" />
            <span>List View</span>
          </button>
          <button
            onClick={() => setViewMode("board")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              viewMode === "board"
                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            <span>Board View</span>
          </button>
        </div>

        {canManage && (
          <button
            onClick={handleOpenCreateModal}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Task</span>
          </button>
        )}
      </div>

      {/* Tasks View */}
      {isLoading ? (
        <LoadingSpinner message="Loading tasks..." />
      ) : isError ? (
        <div className="p-6 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-center">
          <p className="font-semibold">Error loading tasks</p>
          <p className="text-xs mt-1">{error?.message || "Something went wrong"}</p>
        </div>
      ) : tasks.length === 0 ? (
        <EmptyState
          icon={CheckSquare}
          title="No tasks in this project"
          description="Create tasks to organize work, track progress, and assign subtasks."
          actionButton={
            canManage && (
              <button
                onClick={handleOpenCreateModal}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Create Task</span>
              </button>
            )
          }
        />
      ) : viewMode === "list" ? (
        <TaskList
          tasks={tasks}
          onSelectTask={(taskId) => setSelectedTaskIdForDetail(taskId)}
        />
      ) : (
        <TaskBoard
          projectId={projectId}
          tasks={tasks}
          onSelectTask={(taskId) => setSelectedTaskIdForDetail(taskId)}
        />
      )}

      {/* Task Form Modal */}
      <TaskFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        projectId={projectId}
        initialData={selectedTaskForForm}
      />

      {/* Task Detail Modal */}
      <TaskDetailModal
        isOpen={Boolean(selectedTaskIdForDetail)}
        onClose={() => setSelectedTaskIdForDetail(null)}
        projectId={projectId}
        taskId={selectedTaskIdForDetail}
        onEditTask={handleOpenEditModal}
      />
    </AppShell>
  );
};
