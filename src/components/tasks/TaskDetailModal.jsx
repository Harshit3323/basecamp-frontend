import React, { useState } from "react";
import { X, CheckSquare, Plus, Trash2, Edit3, CheckCircle2, Circle, AlertCircle } from "lucide-react";
import {
  useTask,
  useUpdateTask,
  useDeleteTask,
  useCreateSubTask,
  useUpdateSubTask,
  useDeleteSubTask,
} from "../../hooks/queries/useTasks";
import { useProjectRole } from "../../hooks/useProjectRole";
import { canManageTasks, canUpdateSubtaskStatus } from "../../utils/roleGuards";
import { LoadingSpinner } from "../common/LoadingSpinner";

export const TaskDetailModal = ({ isOpen, onClose, projectId, taskId, onEditTask }) => {
  const { data: task, isLoading, isError } = useTask(projectId, taskId);
  const { role } = useProjectRole(projectId);

  const updateTaskMutation = useUpdateTask();
  const deleteTaskMutation = useDeleteTask();
  const createSubtaskMutation = useCreateSubTask();
  const updateSubtaskMutation = useUpdateSubTask();
  const deleteSubtaskMutation = useDeleteSubTask();

  const [newSubtaskContent, setNewSubtaskContent] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  if (!isOpen || !taskId) return null;

  const canManage = canManageTasks(role);
  const canToggleSubtask = canUpdateSubtaskStatus(role);

  const handleStatusChange = async (newStatus) => {
    try {
      await updateTaskMutation.mutateAsync({
        projectId,
        taskId,
        data: { status: newStatus },
      });
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Failed to update status");
    }
  };

  const handleAddSubtask = async (e) => {
    e.preventDefault();
    if (!newSubtaskContent.trim()) return;
    setErrorMsg("");
    try {
      await createSubtaskMutation.mutateAsync({
        projectId,
        taskId,
        data: { content: newSubtaskContent.trim() },
      });
      setNewSubtaskContent("");
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Failed to add subtask");
    }
  };

  const handleToggleSubtask = async (subtask) => {
    if (!subtask._id) {
      setErrorMsg("Subtask ID missing from response");
      return;
    }
    try {
      await updateSubtaskMutation.mutateAsync({
        projectId,
        subTaskId: subtask._id,
        taskId,
        data: { isCompleted: !subtask.isCompleted },
      });
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Failed to update subtask");
    }
  };

  const handleDeleteSubtask = async (subTaskId) => {
    try {
      await deleteSubtaskMutation.mutateAsync({
        projectId,
        subTaskId,
        taskId,
      });
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Failed to delete subtask");
    }
  };

  const handleDeleteTask = async () => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await deleteTaskMutation.mutateAsync({ projectId, taskId });
        onClose();
      } catch (err) {
        setErrorMsg(err.response?.data?.message || "Failed to delete task");
      }
    }
  };

  const statusBadges = {
    todo: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    in_progress: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
    done: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-emerald-400" />
            <span className="text-white font-bold text-lg">Task Details</span>
          </div>
          <div className="flex items-center gap-2">
            {canManage && task && (
              <>
                <button
                  onClick={() => {
                    onClose();
                    onEditTask(task);
                  }}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  title="Edit Task"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={handleDeleteTask}
                  className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10 transition-colors"
                  title="Delete Task"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </>
            )}
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {isLoading ? (
            <LoadingSpinner message="Loading task details..." />
          ) : isError || !task ? (
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm">
              Failed to load task details.
            </div>
          ) : (
            <>
              {errorMsg && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center gap-2 text-xs">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Title & Status */}
              <div>
                <div className="flex items-start justify-between gap-4 mb-2">
                  <h2 className="text-xl font-bold text-white">{task.title}</h2>
                  <select
                    value={task.status}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    disabled={!canManage}
                    className={`px-3 py-1 rounded-full text-xs font-semibold border cursor-pointer focus:outline-none ${
                      statusBadges[task.status] || statusBadges.todo
                    }`}
                  >
                    <option value="todo" className="bg-slate-900 text-amber-400">To Do</option>
                    <option value="in_progress" className="bg-slate-900 text-cyan-400">In Progress</option>
                    <option value="done" className="bg-slate-900 text-emerald-400">Done</option>
                  </select>
                </div>
                <p className="text-sm text-slate-300 whitespace-pre-line leading-relaxed">
                  {task.description || "No description provided."}
                </p>
              </div>

              {/* Subtasks Section */}
              <div className="pt-4 border-t border-slate-800">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    Subtasks ({task.subtasks?.length || 0})
                  </h3>
                </div>

                {/* Create Subtask input */}
                {canManage && (
                  <form onSubmit={handleAddSubtask} className="flex gap-2 mb-4">
                    <input
                      type="text"
                      value={newSubtaskContent}
                      onChange={(e) => setNewSubtaskContent(e.target.value)}
                      placeholder="Add a new subtask..."
                      className="flex-1 px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                    <button
                      type="submit"
                      disabled={createSubtaskMutation.isPending || !newSubtaskContent.trim()}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 disabled:opacity-50 transition-all cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add</span>
                    </button>
                  </form>
                )}

                {/* Subtask list */}
                {(!task.subtasks || task.subtasks.length === 0) ? (
                  <p className="text-xs text-slate-500 italic py-2">No subtasks created for this task yet.</p>
                ) : (
                  <div className="space-y-2">
                    {task.subtasks.map((st, idx) => (
                      <div
                        key={st._id || idx}
                        className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition-all"
                      >
                        <button
                          type="button"
                          onClick={() => handleToggleSubtask(st)}
                          disabled={!canToggleSubtask}
                          className="flex items-center gap-3 text-left flex-1 cursor-pointer"
                        >
                          {st.isCompleted ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          ) : (
                            <Circle className="w-4 h-4 text-slate-500 shrink-0" />
                          )}
                          <span
                            className={`text-xs ${
                              st.isCompleted
                                ? "line-through text-slate-500"
                                : "text-slate-200"
                            }`}
                          >
                            {st.title || st.content}
                          </span>
                        </button>

                        {canManage && st._id && (
                          <button
                            onClick={() => handleDeleteSubtask(st._id)}
                            className="p-1 rounded text-slate-500 hover:text-rose-400 transition-colors"
                            title="Delete Subtask"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
