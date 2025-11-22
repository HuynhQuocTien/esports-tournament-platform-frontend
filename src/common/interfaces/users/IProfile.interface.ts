export interface IProfile {
  id: string;
  fullname?: string;
  name?: string;
  email?: string;
  phone?: string;
  userType?: "ADMIN" | "TEAM_MANAGER" | "ORGANIZER";
  isActive?: boolean;
  avatar?: string;
}