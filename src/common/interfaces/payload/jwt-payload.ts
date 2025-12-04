export interface JwtPayload {
  sub: string;
  email: string;
  fullname?: string;
  role: string | null;
  avatar?: string;
  exp: number;
}
