import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  listProjectTasksApi,
  createTaskApi,
  getTaskDetailsApi,
  updateTaskDetailsApi,
  deleteTaskApi,
  createSubTaskApi,
  updateSubTaskApi,
  deleteSubTaskApi,
} from "../../api/tasks.api";

export const useProjectTasks = (projectId) => {
  return useQuery({
    queryKey: ["tasks", projectId],
    queryFn: async () => {
      if (!projectId) return [];
      const res = await listProjectTasksApi(projectId);
      return res.data || [];
    },
    enabled: Boolean(projectId),
  });
};

export const useTask = (projectId, taskId) => {
  return useQuery({
    queryKey: ["task", taskId],
    queryFn: async () => {
      if (!projectId || !taskId) return null;
      const res = await getTaskDetailsApi(projectId, taskId);
      return res.data;
    },
    enabled: Boolean(projectId && taskId),
  });
};

export const useCreateTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ projectId, data }) => createTaskApi(projectId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["tasks", variables.projectId] });
      queryClient.invalidateQueries({ queryKey: ["project", variables.projectId] });
    },
  });
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ projectId, taskId, data }) => updateTaskDetailsApi(projectId, taskId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["tasks", variables.projectId] });
      queryClient.invalidateQueries({ queryKey: ["task", variables.taskId] });
      queryClient.invalidateQueries({ queryKey: ["project", variables.projectId] });
    },
  });
};

export const useDeleteTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ projectId, taskId }) => deleteTaskApi(projectId, taskId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["tasks", variables.projectId] });
      queryClient.invalidateQueries({ queryKey: ["project", variables.projectId] });
    },
  });
};

export const useCreateSubTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ projectId, taskId, data }) => createSubTaskApi(projectId, taskId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["tasks", variables.projectId] });
      queryClient.invalidateQueries({ queryKey: ["task", variables.taskId] });
      queryClient.invalidateQueries({ queryKey: ["project", variables.projectId] });
    },
  });
};

export const useUpdateSubTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ projectId, subTaskId, data }) => updateSubTaskApi(projectId, subTaskId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["tasks", variables.projectId] });
      if (variables.taskId) {
        queryClient.invalidateQueries({ queryKey: ["task", variables.taskId] });
      }
      queryClient.invalidateQueries({ queryKey: ["project", variables.projectId] });
    },
  });
};

export const useDeleteSubTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ projectId, subTaskId }) => deleteSubTaskApi(projectId, subTaskId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["tasks", variables.projectId] });
      if (variables.taskId) {
        queryClient.invalidateQueries({ queryKey: ["task", variables.taskId] });
      }
      queryClient.invalidateQueries({ queryKey: ["project", variables.projectId] });
    },
  });
};
