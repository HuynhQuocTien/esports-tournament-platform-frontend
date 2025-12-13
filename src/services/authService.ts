import type { IProfile } from "@/common/interfaces/users";
import type {
  ForgotRequest,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
} from "../common/interfaces/auth";
import api from "./api";
import type { ApiResponse } from "@/common/interfaces/ApiResponse";

export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  const res = await api.post<LoginResponse>("/auth/login", data);

  const { access_token, refresh_token } = res.data;
  if (access_token) {
    localStorage.setItem("access_token", access_token);
    if (refresh_token) localStorage.setItem("refresh_token", refresh_token);
  }

  return res.data;
};

export const register = async (
  data: RegisterRequest,
): Promise<RegisterResponse> => {
  const res = await api.post<RegisterResponse>("/auth/register", data);
  return res.data;
};

export const refreshToken = async () => {
  const res = await api.post("/auth/refresh-token");

  const { access_token, refresh_token} = res.data;
  if (access_token) {
    localStorage.setItem("access_token", access_token);
    if (refresh_token) localStorage.setItem("refresh_token", refresh_token);
  }

  return res.data;
};

export const forgotPassword = async (data: ForgotRequest): Promise<void> => {
  await api.post("/auth/forgot-password", { email: data.email });
};

export const resetPassword = async (
  email: string,
  otp: string,
  newPassword: string,
): Promise<void> => {
  await api.post("/auth/reset-password", { email, otp, newPassword });
};
export const sendOtp = async (email: string): Promise<ApiResponse> => {
  const res = await api.post<ApiResponse>("/auth/send-otp", { email });
  return res.data;
};

export const verifyOTP = async (email: string, otp: string): Promise<void> => {
  await api.post("/auth/verify-otp", { email, otp });
};

export const logout = (): void => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  window.location.href = "/";
};

export const getProfile = async (): Promise<IProfile> => {
  const res = await api.get("/auth/me");
  return res.data;
};

export const updateProfile = async (data: any) : Promise<IProfile> => {
  const res = await api.patch("/auth/update-profile", data);
  return res.data;
};

export const uploadAvatar = async (file: File) => {
  const formData = new FormData();
  formData.append("avatar", file);

  const res = await api.post("/auth/upload-avatar", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data;
};

export const loginWithGoogle = (): void => {
  const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
  window.location.href = `${baseUrl}/auth/google`;
};

export const loginWithGithub = (): void => {
  const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
  window.location.href = `${baseUrl}/auth/github`;
};

export const handleOAuthCallback = async (): Promise<LoginResponse> => {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    
    if (code) {
      // Nếu có code, gọi API để lấy token
      const res = await api.get(`/auth/callback?code=${code}`);
      
      const { access_token, refresh_token } = res.data;
      if (access_token) {
        localStorage.setItem("access_token", access_token);
        if (refresh_token) localStorage.setItem("refresh_token", refresh_token);
        
        // Xóa code từ URL để tránh lặp lại
        window.history.replaceState({}, document.title, window.location.pathname);
        
        return res.data;
      }
    }
    
    throw new Error('No authorization code found');
  } catch (error) {
    console.error('OAuth callback error:', error);
    throw error;
  }
};


