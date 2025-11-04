
import axios, { type AxiosResponse } from 'axios';
import type { AuthResponse, LoginPayload } from '../types/auth';
const API = process.env.REACT_APP_API_URL;
export type RegisterPayload = {
    name?: string;
    email: string;
    password: string;
    passwordConfirm?: string;
    // add additional registration fields here
};


// Register a new user
export const register = (payload: RegisterPayload): Promise<AxiosResponse<AuthResponse>> =>
    axios.post<AuthResponse>(`${API}/register`, payload);

// Login
export const login = (payload: LoginPayload): Promise<AxiosResponse<AuthResponse>> =>
    axios.post<AuthResponse>(`${API}/login`, payload);

// Refresh access token
export const refreshToken = (token: string): Promise<AxiosResponse<AuthResponse>> =>
    axios.post<AuthResponse>(`${API}/refresh-token`, { refreshToken: token });

// Logout (optionally invalidates refresh token server-side)
export const logout = (token?: string): Promise<AxiosResponse<void>> =>
    axios.post<void>(`${API}/logout`, { refreshToken: token });