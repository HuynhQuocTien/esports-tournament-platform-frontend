export interface JwtPayload {
  sub: string;
  email: string;
  username?: string;
  userType: string | null;
  avatar?: string;
  exp: number;
}
