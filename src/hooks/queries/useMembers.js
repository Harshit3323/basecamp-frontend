import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  listProjectMembersApi,
  addProjectMemberApi,
  updateMemberRoleApi,
  removeProjectMemberApi,
} from "../../api/projects.api";

export const useMembers = (projectId) => {
  return useQuery({
    queryKey: ["members", projectId],
    queryFn: async () => {
      if (!projectId) return [];
      const res = await listProjectMembersApi(projectId);
      return res.data || [];
    },
    enabled: Boolean(projectId),
  });
};

export const useAddMember = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ projectId, data }) => addProjectMemberApi(projectId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["members", variables.projectId] });
      queryClient.invalidateQueries({ queryKey: ["project", variables.projectId] });
    },
  });
};

export const useUpdateMemberRole = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ projectId, userId, newRole }) => updateMemberRoleApi(projectId, userId, newRole),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["members", variables.projectId] });
    },
  });
};

export const useRemoveMember = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ projectId, userId }) => removeProjectMemberApi(projectId, userId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["members", variables.projectId] });
      queryClient.invalidateQueries({ queryKey: ["project", variables.projectId] });
    },
  });
};
