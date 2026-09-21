import { axiosInstance } from "./axiosInstance";

export const registerApi = async (data) => {
  const res = await axiosInstance.post("/auth/register", data);
  return res.data;
};

export const loginApi = async (credentials) => {
  const res = await axiosInstance.post("/auth/login", credentials);
  return res.data;
};

export const logoutApi = async () => {
  const res = await axiosInstance.post("/auth/logout");
  return res.data;
};

export const getCurrentUserApi = async () => {
  const res = await axiosInstance.get("/auth/getCurrentUser");
  return res.data;
};

export const verifyEmailApi = async (verificationToken) => {
  const res = await axiosInstance.get(`/auth/verify-email/${verificationToken}`);
  return res.data;
};

export const resendVerificationMailApi = async (email) => {
  const res = await axiosInstance.post("/auth/resend-email-verification", { email });
  return res.data;
};

export const forgotPasswordApi = async (email) => {
  const res = await axiosInstance.post("/auth/forgot-password", { email });
  return res.data;
};

export const resetPasswordApi = async (resetToken, newPassword) => {
  const res = await axiosInstance.post(`/auth/reset-password/${resetToken}`, { newPassword });
  return res.data;
};

export const changePasswordApi = async (currentPassword, newPassword) => {
  const res = await axiosInstance.post("/auth/change-password", { currentPassword, newPassword });
  return res.data;
};
