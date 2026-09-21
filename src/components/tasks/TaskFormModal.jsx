import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X, CheckSquare, AlertCircle } from "lucide-react";
import { useCreateTask, useUpdateTask } from "../../hooks/queries/useTasks";

const taskSchema = z.object({
  title: z.string().min(2, "Task title must be at least 2 characters").max(100, "Title too long"),
  description: z.string().max(500, "Description too long").optional(),
  status: z.enum(["todo", "in_progress", "done"]).default("todo"),
});

export const TaskFormModal = ({ isOpen, onClose, projectId, initialData = null }) => {
  const isEditing = Boolean(initialData);
  const createTaskMutation = useCreateTask();
  const updateTaskMutation = useUpdateTask();
  const [apiError, setApiError] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      status: initialData?.status || "todo",
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        title: initialData.title || "",
        description: initialData.description || "",
        status: initialData.status || "todo",
      });
    } else {
      reset({ title: "", description: "", status: "todo" });
    }
  }, [initialData, reset]);

  if (!isOpen) return null;

  const onSubmit = async (data) => {
    setApiError("");
    try {
      if (isEditing) {
        await updateTaskMutation.mutateAsync({
          projectId,
          taskId: initialData._id,
          data,
        });
      } else {
        await createTaskMutation.mutateAsync({ projectId, data });
      }
      onClose();
      reset();
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to save task. Please try again.";
      setApiError(msg);
    }
  };

  const isPending = createTaskMutation.isPending || updateTaskMutation.isPending;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2 text-white font-bold text-lg">
            <CheckSquare className="w-5 h-5 text-emerald-400" />
            <span>{isEditing ? "Edit Task" : "Create New Task"}</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          {apiError && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center gap-2 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{apiError}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Task Title *
            </label>
            <input
              {...register("title")}
              type="text"
              placeholder="e.g. Implement OAuth Login Flow"
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700/70 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 text-sm transition-all"
            />
            {errors.title && (
              <p className="mt-1 text-xs text-rose-400">{errors.title.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Description
            </label>
            <textarea
              {...register("description")}
              rows={3}
              placeholder="Provide requirements or details for this task..."
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700/70 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 text-sm transition-all resize-none"
            />
            {errors.description && (
              <p className="mt-1 text-xs text-rose-400">{errors.description.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Status
            </label>
            <select
              {...register("status")}
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700/70 rounded-xl text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 text-sm transition-all cursor-pointer"
            >
              <option value="todo">To Do</option>
              <option value="in_progress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 active:bg-emerald-500 disabled:opacity-50 transition-all shadow-md shadow-emerald-500/20"
            >
              {isPending ? "Saving..." : isEditing ? "Update Task" : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
