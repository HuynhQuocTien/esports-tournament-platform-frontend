import type { ApiResponse } from "../ApiResponse";

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface RegisterResponse extends ApiResponse {
  data: {
    userId: string;
  };
}