import React from "react";
import { CheckSquare, Clock, CheckCircle2, ChevronRight } from "lucide-react";

export const TaskList = ({ tasks, onSelectTask }) => {
  const getStatusIcon = (status) => {
    switch (status) {
      case "done":
        return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
      case "in_progress":
        return <Clock className="w-4 h-4 text-cyan-400" />;
      default:
        return <Clock className="w-4 h-4 text-amber-400" />;
    }
  };

  const statusLabels = {
    todo: "To Do",
    in_progress: "In Progress",
    done: "Done",
  };

  const statusClasses = {
    todo: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    in_progress: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
    done: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  };

  return (
    <div className="space-y-3">
      {tasks.map((task) => {
        const totalSubtasks = task.subtasks?.length || 0;
        const completedSubtasks = task.subtasks?.filter((st) => st.isCompleted).length || 0;

        return (
          <div
            key={task._id}
            onClick={() => onSelectTask(task._id)}
            className="group flex items-center justify-between p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-emerald-500/40 hover:bg-slate-900 transition-all cursor-pointer shadow-md"
          >
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 group-hover:border-emerald-500/30 transition-colors">
                {getStatusIcon(task.status)}
              </div>

              <div>
                <h4 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                  {task.title}
                </h4>
                {totalSubtasks > 0 && (
                  <p className="text-xs text-slate-400 mt-1">
                    {completedSubtasks} of {totalSubtasks} subtasks completed
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusClasses[task.status]}`}>
                {statusLabels[task.status]}
              </span>
              <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all" />
            </div>
          </div>
        );
      })}
    </div>
  );
};
