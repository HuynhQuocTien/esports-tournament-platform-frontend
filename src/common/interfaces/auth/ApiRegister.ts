import type { Role } from "@/common/types";
import type { ApiResponse } from "../ApiResponse";

export interface RegisterRequest {
  email: string;
  fullname: string;
  password: string;
  role: Role;
}

export interface RegisterResponse extends ApiResponse {
  data: {
    userId: string;
  };
}
