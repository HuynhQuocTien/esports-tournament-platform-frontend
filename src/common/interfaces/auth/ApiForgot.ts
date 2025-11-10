import type { ApiResponse } from "../ApiResponse";

export interface ForgotRequest {
    email: string;
}

export interface ForgotResponse extends ApiResponse {
}