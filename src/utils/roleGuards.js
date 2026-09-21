// Helper functions for per-project role-based access control
export const canManageProject = (role) => role === "admin";
export const canManageTasks = (role) => role === "admin" || role === "project_admin";
export const canManageNotes = (role) => role === "admin";
export const canManageMembers = (role) => role === "admin";
export const canUpdateSubtaskStatus = () => true; // All project members
