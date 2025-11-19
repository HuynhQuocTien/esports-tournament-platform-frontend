export interface JwtPayload{
  sub: string;   
  email: string;
  username?: string;
  avatar?: string;
  exp: number;
}