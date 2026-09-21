import { useProjects } from "./queries/useProjects";
import { useAuth } from "./useAuth";

export const useProjectRole = (projectId) => {
  const { user } = useAuth();
  const { data: projects = [], isLoading } = useProjects();

  if (!projectId || !user) {
    return { role: null, isLoading };
  }

  // Find the project entry in the user's project list which contains `myRole`
  const projectItem = projects.find(
    (item) => item.project?._id === projectId || item.project === projectId
  );

  const role = projectItem ? projectItem.myRole : "member";

  return {
    role,
    isLoading,
    isAdmin: role === "admin",
    isProjectAdmin: role === "project_admin",
    isMember: role === "member",
  };
};
