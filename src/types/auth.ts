export type AuthStep =
  | "login"
  | "register"
  | "forgotPassword"
  | "verifyOtp"
  | "setupPassword";


export interface Login {
  email: string;
  password: string;
}

export interface Register {
  name: string;
  email: string;
  password: string;
}

export interface Forgot{
  email: string;
}

export interface VerifyOtp{
  email: string;
  otp: string;
} 

export interface AuthResponse {
  access_token: string;
  refresh_token?: string;
}