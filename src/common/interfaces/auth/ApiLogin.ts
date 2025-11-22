import type { ApiResponse } from "../ApiResponse";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse extends ApiResponse {
  access_token: string;
  refresh_token: string;
}
