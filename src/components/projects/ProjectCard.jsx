import React from "react";
import { Link } from "react-router-dom";
import { Folder, Users, ChevronRight, ShieldCheck, ShieldAlert, User } from "lucide-react";

export const ProjectCard = ({ projectItem }) => {
  const { project, myRole } = projectItem;
  if (!project) return null;

  const getRoleBadge = () => {
    if (myRole === "admin") {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          <ShieldCheck className="w-3 h-3" />
          Admin
        </span>
      );
    }
    if (myRole === "project_admin") {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
          <ShieldAlert className="w-3 h-3" />
          Project Admin
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold bg-slate-800 text-slate-400 border border-slate-700">
        <User className="w-3 h-3" />
        Member
      </span>
    );
  };

  return (
    <Link
      to={`/projects/${project._id}`}
      className="group block p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-emerald-500/40 hover:bg-slate-900 transition-all duration-300 relative overflow-hidden shadow-lg hover:shadow-emerald-500/5"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
          <Folder className="w-5 h-5" />
        </div>
        {getRoleBadge()}
      </div>

      <h3 className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors mb-2 line-clamp-1">
        {project.name}
      </h3>

      <p className="text-sm text-slate-400 line-clamp-2 min-h-[40px] mb-4">
        {project.description || "No description provided."}
      </p>

      <div className="flex items-center justify-between pt-4 border-t border-slate-800/60 text-xs text-slate-400">
        <div className="flex items-center gap-1.5">
          <Users className="w-3.5 h-3.5 text-slate-500" />
          <span>{project.memberCount || 1} {project.memberCount === 1 ? "member" : "members"}</span>
        </div>
        <div className="flex items-center gap-1 text-emerald-400 font-semibold group-hover:translate-x-1 transition-transform">
          <span>Open</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </div>
      </div>
    </Link>
  );
};
