import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { AppShell } from "../components/layout/AppShell";
import { ProjectTabs } from "../components/layout/ProjectTabs";
import { useNotes, useDeleteNote } from "../hooks/queries/useNotes";
import { useProjectRole } from "../hooks/useProjectRole";
import { canManageNotes } from "../utils/roleGuards";
import { NoteEditorModal } from "../components/notes/NoteEditorModal";
import { LoadingSpinner } from "../components/common/LoadingSpinner";
import { EmptyState } from "../components/common/EmptyState";
import { Plus, FileText, Trash2, Edit3, Calendar } from "lucide-react";

export const ProjectNotesPage = () => {
  const { projectId } = useParams();
  const { data: notes = [], isLoading, isError, error } = useNotes(projectId);
  const { role } = useProjectRole(projectId);
  const deleteNoteMutation = useDeleteNote();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);

  const canManage = canManageNotes(role);

  const handleOpenCreate = () => {
    setSelectedNote(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (note) => {
    setSelectedNote(note);
    setIsModalOpen(true);
  };

  const handleDelete = async (noteId) => {
    if (window.confirm("Are you sure you want to delete this note?")) {
      try {
        await deleteNoteMutation.mutateAsync({ projectId, noteId });
      } catch (err) {
        alert(err.response?.data?.message || "Failed to delete note");
      }
    }
  };

  return (
    <AppShell>
      <ProjectTabs activeTab="Notes" />

      {/* Header action */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-lg font-bold text-white">Project Notes & Docs</h2>
          <p className="text-xs text-slate-400">Share documentation, updates, and discussions with the team.</p>
        </div>

        {canManage && (
          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Note</span>
          </button>
        )}
      </div>

      {/* Content */}
      {isLoading ? (
        <LoadingSpinner message="Loading notes..." />
      ) : isError ? (
        <div className="p-6 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-center">
          <p className="font-semibold">Error loading notes</p>
          <p className="text-xs mt-1">{error?.message || "Something went wrong"}</p>
        </div>
      ) : notes.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No notes in this project"
          description="Create project notes to document decisions, architecture, and team guidelines."
          actionButton={
            canManage && (
              <button
                onClick={handleOpenCreate}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Create Note</span>
              </button>
            )
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {notes.map((note) => (
            <div
              key={note._id}
              className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-all flex flex-col justify-between shadow-lg"
            >
              <div>
                <p className="text-sm text-slate-200 whitespace-pre-line leading-relaxed mb-4">
                  {note.content}
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-800/60 text-xs text-slate-500">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                  <span>{new Date(note.createdAt).toLocaleDateString()}</span>
                </div>

                {canManage && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenEdit(note)}
                      className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                      title="Edit Note"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(note._id)}
                      className="p-1 rounded text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                      title="Delete Note"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <NoteEditorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        projectId={projectId}
        initialData={selectedNote}
      />
    </AppShell>
  );
};
