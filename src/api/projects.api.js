import { axiosInstance } from "./axiosInstance";

export const listProjectsApi = async () => {
  const res = await axiosInstance.get("/projects");
  return res.data;
};

export const createProjectApi = async (data) => {
  const res = await axiosInstance.post("/projects", data);
  return res.data;
};

export const getProjectDetailsApi = async (projectId) => {
  const res = await axiosInstance.get(`/projects/${projectId}`);
  return res.data;
};

export const updateProjectApi = async (projectId, data) => {
  const res = await axiosInstance.put(`/projects/${projectId}`, data);
  return res.data;
};

export const deleteProjectApi = async (projectId) => {
  const res = await axiosInstance.delete(`/projects/${projectId}`);
  return res.data;
};

export const listProjectMembersApi = async (projectId) => {
  const res = await axiosInstance.get(`/projects/${projectId}/members`);
  return res.data;
};

export const addProjectMemberApi = async (projectId, { email, role }) => {
  const res = await axiosInstance.post(`/projects/${projectId}/members`, { email, role });
  return res.data;
};

export const updateMemberRoleApi = async (projectId, userId, newRole) => {
  const res = await axiosInstance.put(`/projects/${projectId}/members/${userId}`, { newRole });
  return res.data;
};

export const removeProjectMemberApi = async (projectId, userId) => {
  const res = await axiosInstance.delete(`/projects/${projectId}/members/${userId}`);
  return res.data;
};
