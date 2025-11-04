import type { AuthResponse, Forgot, Login, Register } from "../types";
import api from "./api";

export const login = async (data: Login): Promise<AuthResponse> => {
  const res = await api.post<AuthResponse>("/auth/login", data);

  const { access_token, refresh_token } = res.data;
  if (access_token) {
    localStorage.setItem("access_token", access_token);
    if (refresh_token) localStorage.setItem("refresh_token", refresh_token);
  }

  return res.data;
};

export const register = async (data: Register): Promise<AuthResponse> => {
  const res = await api.post<AuthResponse>("/auth/register", data);
  return res.data;
};

export const refreshToken = async (): Promise<AuthResponse> => {
  const refresh_token = localStorage.getItem("refresh_token");
  if (!refresh_token) throw new Error("No refresh token found");

  const res = await api.post<AuthResponse>("/auth/refresh", {
    refresh_token,
  });

  const { access_token, refresh_token: newRefresh } = res.data;
  if (access_token) {
    localStorage.setItem("access_token", access_token);
    if (newRefresh) localStorage.setItem("refresh_token", newRefresh);
  }

  return res.data;
};

export const forgotPassword = async (data: Forgot): Promise<void> => {
  await api.post("/auth/forgot-password", { email: data.email });
};

export const resetPassword = async (
  email: string,
  otp: string,
  newPassword: string
): Promise<void> => {
  await api.post("/auth/reset-password", { email, otp, newPassword });
};

export const verifyOTP = async (email: string, otp: string): Promise<void> => {
  await api.post("/auth/verify-otp", { email, otp });
};


export const logout = (): void => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  window.location.href = "/login";
};


export const getProfile = async () => {
  const res = await api.get("/auth/me");
  return res.data;
};


export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem("access_token");
};
