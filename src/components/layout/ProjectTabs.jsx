import React from "react";
import { NavLink, useParams } from "react-router-dom";
import { LayoutDashboard, CheckSquare, FileText, Users, ShieldAlert, ShieldCheck, User } from "lucide-react";
import { useProjectRole } from "../../hooks/useProjectRole";
import { useProject } from "../../hooks/queries/useProjects";

export const ProjectTabs = ({ activeTab }) => {
  const { projectId } = useParams();
  const { data: project } = useProject(projectId);
  const { role } = useProjectRole(projectId);

  const getRoleBadge = () => {
    if (role === "admin") {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          <ShieldCheck className="w-3.5 h-3.5" />
          Admin
        </span>
      );
    }
    if (role === "project_admin") {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
          <ShieldAlert className="w-3.5 h-3.5" />
          Project Admin
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
        <User className="w-3.5 h-3.5" />
        Member
      </span>
    );
  };

  const tabs = [
    { name: "Overview", href: `/projects/${projectId}`, icon: LayoutDashboard },
    { name: "Tasks", href: `/projects/${projectId}/tasks`, icon: CheckSquare },
    { name: "Notes", href: `/projects/${projectId}/notes`, icon: FileText },
    { name: "Members", href: `/projects/${projectId}/members`, icon: Users },
  ];

  return (
    <div className="mb-8 border-b border-slate-800">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-white tracking-tight">
              {project?.name || "Project Workspace"}
            </h1>
            {getRoleBadge()}
          </div>
          {project?.description && (
            <p className="mt-1 text-sm text-slate-400 max-w-3xl">
              {project.description}
            </p>
          )}
        </div>
      </div>

      {/* Navigation tabs */}
      <nav className="flex space-x-2 overflow-x-auto pb-px scrollbar-none" aria-label="Tabs">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <NavLink
              key={tab.name}
              to={tab.href}
              end={tab.href === `/projects/${projectId}`}
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-3 border-b-2 text-sm font-semibold transition-all whitespace-nowrap ${
                  isActive
                    ? "border-emerald-400 text-emerald-400 bg-emerald-500/5"
                    : "border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700"
                }`
              }
            >
              <Icon className="w-4 h-4" />
              <span>{tab.name}</span>
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
};
