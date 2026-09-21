import { axiosInstance } from "./axiosInstance";

export const listProjectTasksApi = async (projectId) => {
  const res = await axiosInstance.get(`/tasks/${projectId}`);
  return res.data;
};

export const createTaskApi = async (projectId, data) => {
  const res = await axiosInstance.post(`/tasks/${projectId}`, data);
  return res.data;
};

export const getTaskDetailsApi = async (projectId, taskId) => {
  const res = await axiosInstance.get(`/tasks/${projectId}/t/${taskId}`);
  return res.data;
};

export const updateTaskDetailsApi = async (projectId, taskId, data) => {
  const res = await axiosInstance.put(`/tasks/${projectId}/t/${taskId}`, data);
  return res.data;
};

export const deleteTaskApi = async (projectId, taskId) => {
  const res = await axiosInstance.delete(`/tasks/${projectId}/t/${taskId}`);
  return res.data;
};

export const createSubTaskApi = async (projectId, taskId, data) => {
  const res = await axiosInstance.post(`/tasks/${projectId}/t/${taskId}/subtasks`, data);
  return res.data;
};

export const updateSubTaskApi = async (projectId, subTaskId, data) => {
  const res = await axiosInstance.put(`/tasks/${projectId}/st/${subTaskId}`, data);
  return res.data;
};

export const deleteSubTaskApi = async (projectId, subTaskId) => {
  const res = await axiosInstance.delete(`/tasks/${projectId}/st/${subTaskId}`);
  return res.data;
};
