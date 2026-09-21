import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { AppShell } from "../components/layout/AppShell";
import { ProjectTabs } from "../components/layout/ProjectTabs";
import { useMembers, useUpdateMemberRole, useRemoveMember } from "../hooks/queries/useMembers";
import { useProjectRole } from "../hooks/useProjectRole";
import { useAuth } from "../hooks/useAuth";
import { canManageMembers } from "../utils/roleGuards";
import { AddMemberModal } from "../components/members/AddMemberModal";
import { LoadingSpinner } from "../components/common/LoadingSpinner";
import { EmptyState } from "../components/common/EmptyState";
import { UserPlus, Users, ShieldCheck, ShieldAlert, User as UserIcon, Trash2, AlertCircle } from "lucide-react";

export const ProjectMembersPage = () => {
  const { projectId } = useParams();
  const { user: currentUser } = useAuth();
  const { data: members = [], isLoading, isError, error } = useMembers(projectId);
  const { role } = useProjectRole(projectId);

  const updateRoleMutation = useUpdateMemberRole();
  const removeMemberMutation = useRemoveMember();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const isAdmin = canManageMembers(role);

  const handleRoleChange = async (member, newRole) => {
    if (!member.userId) {
      setErrorMsg("Member user ID missing from server response");
      return;
    }
    setErrorMsg("");
    try {
      await updateRoleMutation.mutateAsync({
        projectId,
        userId: member.userId,
        newRole,
      });
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Failed to update member role");
    }
  };

  const handleRemoveMember = async (member) => {
    if (!member.userId) {
      setErrorMsg("Member user ID missing from server response");
      return;
    }
    if (window.confirm(`Are you sure you want to remove ${member.userName} from this project?`)) {
      setErrorMsg("");
      try {
        await removeMemberMutation.mutateAsync({
          projectId,
          userId: member.userId,
        });
      } catch (err) {
        setErrorMsg(err.response?.data?.message || "Failed to remove member");
      }
    }
  };

  const getRoleBadge = (memberRole) => {
    if (memberRole === "admin") {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          <ShieldCheck className="w-3.5 h-3.5" />
          Admin
        </span>
      );
    }
    if (memberRole === "project_admin") {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
          <ShieldAlert className="w-3.5 h-3.5" />
          Project Admin
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-400 border border-slate-700">
        <UserIcon className="w-3.5 h-3.5" />
        Member
      </span>
    );
  };

  return (
    <AppShell>
      <ProjectTabs activeTab="Members" />

      {/* Header action */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-lg font-bold text-white">Project Members ({members.length})</h2>
          <p className="text-xs text-slate-400">Team members with access to this project workspace.</p>
        </div>

        {isAdmin && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add Member</span>
          </button>
        )}
      </div>

      {errorMsg && (
        <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center gap-2 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Content */}
      {isLoading ? (
        <LoadingSpinner message="Loading team members..." />
      ) : isError ? (
        <div className="p-6 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-center">
          <p className="font-semibold">Error loading members</p>
          <p className="text-xs mt-1">{error?.message || "Something went wrong"}</p>
        </div>
      ) : members.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No members present"
          description="Add members to collaborate on tasks, subtasks, and notes."
          actionButton={
            isAdmin && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-all cursor-pointer"
              >
                <UserPlus className="w-4 h-4" />
                <span>Add Member</span>
              </button>
            )
          }
        />
      ) : (
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl overflow-hidden shadow-xl">
          <div className="divide-y divide-slate-800/80">
            {members.map((member, idx) => {
              const isSelf = member.userName === currentUser?.userName;

              return (
                <div
                  key={member.userId || member.userName || idx}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:px-6 gap-4 hover:bg-slate-900/80 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/80 flex items-center justify-center font-bold text-slate-300">
                      {member.userName?.substring(0, 2).toUpperCase()}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm">
                          {member.name || member.userName}
                        </span>
                        {isSelf && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                            You
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400">@{member.userName}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    {/* Role Dropdown (for Admin) or Static Badge */}
                    {isAdmin && member.userId && !isSelf ? (
                      <select
                        value={member.role}
                        onChange={(e) => handleRoleChange(member, e.target.value)}
                        className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-semibold text-slate-200 focus:outline-none focus:border-emerald-500 cursor-pointer"
                      >
                        <option value="member">Member</option>
                        <option value="project_admin">Project Admin</option>
                        <option value="admin">Admin</option>
                      </select>
                    ) : (
                      getRoleBadge(member.role)
                    )}

                    {/* Remove Member button */}
                    {isAdmin && member.userId && !isSelf && (
                      <button
                        onClick={() => handleRemoveMember(member)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                        title="Remove Member"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <AddMemberModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        projectId={projectId}
      />
    </AppShell>
  );
};
