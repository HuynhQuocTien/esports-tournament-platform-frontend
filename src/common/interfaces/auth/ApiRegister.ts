import type { ApiResponse } from "../ApiResponse";

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  userType: string;
}

export interface RegisterResponse extends ApiResponse {
  data: {
    userId: string;
  };
}
