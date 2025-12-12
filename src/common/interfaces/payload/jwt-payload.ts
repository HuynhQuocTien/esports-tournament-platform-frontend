export interface JwtPayload {
  id: string;
  email: string;
  fullname?: string;
  role: string | null;
  avatar?: string;
  exp: number;
}
