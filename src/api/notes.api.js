import { axiosInstance } from "./axiosInstance";

export const listProjectNotesApi = async (projectId) => {
  const res = await axiosInstance.get(`/notes/${projectId}`);
  return res.data;
};

export const createNoteApi = async (projectId, data) => {
  const res = await axiosInstance.post(`/notes/${projectId}`, data);
  return res.data;
};

export const getNoteDetailsApi = async (projectId, noteId) => {
  const res = await axiosInstance.get(`/notes/${projectId}/n/${noteId}`);
  return res.data;
};

export const updateNoteDetailsApi = async (projectId, noteId, data) => {
  const res = await axiosInstance.put(`/notes/${projectId}/n/${noteId}`, data);
  return res.data;
};

export const deleteNoteApi = async (projectId, noteId) => {
  const res = await axiosInstance.delete(`/notes/${projectId}/n/${noteId}`);
  return res.data;
};
