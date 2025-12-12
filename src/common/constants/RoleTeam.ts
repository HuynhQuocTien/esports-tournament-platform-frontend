import { TeamRole } from "../types/team";

export const RoleTeamLabel: Record<TeamRole, string> = {
  [TeamRole.CAPTAIN]: 'Đội trưởng',
  [TeamRole.PLAYER]: 'Thành viên',
  [TeamRole.SUBSTITUTE]: 'Dự bị',
  [TeamRole.COACH]: 'Huấn luyện viên',
  [TeamRole.MANAGER]: 'Quản lý',
  [TeamRole.ANALYST]: 'Phân tích'
};

export const getRoleLabel = (role: TeamRole): string => {
  return RoleTeamLabel[role] || role;
};

export type { TeamRole };