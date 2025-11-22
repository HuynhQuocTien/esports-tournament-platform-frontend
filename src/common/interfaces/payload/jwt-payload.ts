export interface JwtPayload {
  sub: string;
  email: string;
  fullname?: string;
  userType: string | null;
  avatar?: string;
  exp: number;
}
