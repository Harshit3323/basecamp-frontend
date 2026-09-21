import React from "react";
import { CheckSquare, Clock, CheckCircle2, MoveRight, MoveLeft } from "lucide-react";
import { useUpdateTask } from "../../hooks/queries/useTasks";
import { useProjectRole } from "../../hooks/useProjectRole";
import { canManageTasks } from "../../utils/roleGuards";

export const TaskBoard = ({ projectId, tasks, onSelectTask }) => {
  const { role } = useProjectRole(projectId);
  const updateTaskMutation = useUpdateTask();
  const canManage = canManageTasks(role);

  const columns = [
    { id: "todo", title: "To Do", color: "amber", icon: Clock },
    { id: "in_progress", title: "In Progress", color: "cyan", icon: Clock },
    { id: "done", title: "Done", color: "emerald", icon: CheckCircle2 },
  ];

  const handleMoveStatus = async (e, taskId, newStatus) => {
    e.stopPropagation();
    try {
      await updateTaskMutation.mutateAsync({
        projectId,
        taskId,
        data: { status: newStatus },
      });
    } catch (err) {
      console.error("Failed to move status", err);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {columns.map((col) => {
        const colTasks = tasks.filter((t) => t.status === col.id);
        const Icon = col.icon;

        return (
          <div
            key={col.id}
            className="flex flex-col bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 min-h-[400px]"
          >
            {/* Column Header */}
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Icon className={`w-4 h-4 text-${col.color}-400`} />
                <h3 className="text-sm font-bold text-white">{col.title}</h3>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-800 text-slate-400">
                {colTasks.length}
              </span>
            </div>

            {/* Column Task Cards */}
            <div className="space-y-3 flex-1 overflow-y-auto">
              {colTasks.length === 0 ? (
                <div className="p-8 text-center border border-dashed border-slate-800 rounded-xl">
                  <p className="text-xs text-slate-500">No tasks in {col.title}</p>
                </div>
              ) : (
                colTasks.map((task) => {
                  const totalSubtasks = task.subtasks?.length || 0;
                  const completedSubtasks =
                    task.subtasks?.filter((st) => st.isCompleted).length || 0;

                  return (
                    <div
                      key={task._id}
                      onClick={() => onSelectTask(task._id)}
                      className="group p-4 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-emerald-500/40 hover:bg-slate-950 transition-all cursor-pointer shadow-md"
                    >
                      <h4 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors mb-2">
                        {task.title}
                      </h4>

                      {totalSubtasks > 0 && (
                        <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-3">
                          <CheckSquare className="w-3.5 h-3.5 text-emerald-400" />
                          <span>
                            {completedSubtasks}/{totalSubtasks} subtasks
                          </span>
                        </div>
                      )}

                      {/* Quick Move Buttons */}
                      {canManage && (
                        <div className="flex items-center justify-end gap-1.5 pt-2 border-t border-slate-800/60">
                          {col.id !== "todo" && (
                            <button
                              onClick={(e) =>
                                handleMoveStatus(
                                  e,
                                  task._id,
                                  col.id === "done" ? "in_progress" : "todo"
                                )
                              }
                              className="p-1 rounded bg-slate-800 text-slate-400 hover:text-white transition-colors"
                              title="Move back"
                            >
                              <MoveLeft className="w-3.5 h-3.5" />
                            </button>
                          )}
                          {col.id !== "done" && (
                            <button
                              onClick={(e) =>
                                handleMoveStatus(
                                  e,
                                  task._id,
                                  col.id === "todo" ? "in_progress" : "done"
                                )
                              }
                              className="p-1 rounded bg-slate-800 text-slate-400 hover:text-white transition-colors"
                              title="Move forward"
                            >
                              <MoveRight className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
