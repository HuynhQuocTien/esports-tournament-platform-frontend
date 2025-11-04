export interface login {
  email: string;
  password: string;
}

export type LoginPayload = {
    email: string;
    password: string;
};

export type UserDTO = {
    id: string;
    email: string;
    name?: string;
};

export type AuthResponse = {
    accessToken: string;
    refreshToken?: string;
    user?: UserDTO;
};
