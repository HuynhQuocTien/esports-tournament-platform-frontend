export type TeamRole = 'CAPTAIN' | 'PLAYER' | 'COACH' | 'SUBSTITUTE';

export const RoleTeamLabel: Record<TeamRole, string> = {
    CAPTAIN: 'Đội trưởng',
    PLAYER: 'Cầu thủ',
    COACH: 'Huấn luyện viên',
    SUBSTITUTE: 'Dự bị',
};

export const getRoleLabel = (role: TeamRole | string): string =>
    (RoleTeamLabel as Record<string, string>)[role] ?? role;