import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  listProjectNotesApi,
  createNoteApi,
  getNoteDetailsApi,
  updateNoteDetailsApi,
  deleteNoteApi,
} from "../../api/notes.api";

export const useNotes = (projectId) => {
  return useQuery({
    queryKey: ["notes", projectId],
    queryFn: async () => {
      if (!projectId) return [];
      const res = await listProjectNotesApi(projectId);
      return res.data || [];
    },
    enabled: Boolean(projectId),
  });
};

export const useNote = (projectId, noteId) => {
  return useQuery({
    queryKey: ["note", noteId],
    queryFn: async () => {
      if (!projectId || !noteId) return null;
      const res = await getNoteDetailsApi(projectId, noteId);
      return res.data;
    },
    enabled: Boolean(projectId && noteId),
  });
};

export const useCreateNote = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ projectId, data }) => createNoteApi(projectId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["notes", variables.projectId] });
    },
  });
};

export const useUpdateNote = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ projectId, noteId, data }) => updateNoteDetailsApi(projectId, noteId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["notes", variables.projectId] });
      queryClient.invalidateQueries({ queryKey: ["note", variables.noteId] });
    },
  });
};

export const useDeleteNote = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ projectId, noteId }) => deleteNoteApi(projectId, noteId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["notes", variables.projectId] });
    },
  });
};
