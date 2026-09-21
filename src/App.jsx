import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { VerifyEmailPage } from "./pages/VerifyEmailPage";
import { ForgotPasswordPage } from "./pages/ForgotPasswordPage";
import { ResetPasswordPage } from "./pages/ResetPasswordPage";
import { ProjectsPage } from "./pages/ProjectsPage";
import { ProjectOverviewPage } from "./pages/ProjectOverviewPage";
import { ProjectTasksPage } from "./pages/ProjectTasksPage";
import { ProjectNotesPage } from "./pages/ProjectNotesPage";
import { ProjectMembersPage } from "./pages/ProjectMembersPage";
import { ChangePasswordPage } from "./pages/ChangePasswordPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public Auth Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/verify-email/:token" element={<VerifyEmailPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

            {/* Protected Workspace Routes */}
            <Route
              path="/projects"
              element={
                <ProtectedRoute>
                  <ProjectsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/projects/:projectId"
              element={
                <ProtectedRoute>
                  <ProjectOverviewPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/projects/:projectId/tasks"
              element={
                <ProtectedRoute>
                  <ProjectTasksPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/projects/:projectId/notes"
              element={
                <ProtectedRoute>
                  <ProjectNotesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/projects/:projectId/members"
              element={
                <ProtectedRoute>
                  <ProjectMembersPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings/password"
              element={
                <ProtectedRoute>
                  <ChangePasswordPage />
                </ProtectedRoute>
              }
            />

            {/* Default Fallback */}
            <Route path="*" element={<Navigate to="/projects" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
