import type { ForgotRequest, LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from "../common/interfaces/auth";
import api from "./api";

export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  const res = await api.post<LoginResponse>("/auth/login", data);

  const { access_token, refresh_token } = res.data.data;
  if (access_token) {
    localStorage.setItem("access_token", access_token);
    if (refresh_token) localStorage.setItem("refresh_token", refresh_token);
  }

  return res.data;
};

export const register = async (data: RegisterRequest): Promise<RegisterResponse> => {
  const res = await api.post<RegisterResponse>("/auth/register", data);
  return res.data;
};

export const refreshToken = async () => {
  const refresh_token = localStorage.getItem("refresh_token");
  if (!refresh_token) throw new Error("No refresh token found");

  const res = await api.post("/auth/refresh", {
    refresh_token
  });

  const { access_token, refresh_token: newRefresh } = res.data;
  if (access_token) {
    localStorage.setItem("access_token", access_token);
    if (newRefresh) localStorage.setItem("refresh_token", newRefresh);
  }

  return res.data;
};

export const forgotPassword = async (data: ForgotRequest): Promise<void> => {
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
