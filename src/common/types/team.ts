export const TeamRole = {
  CAPTAIN: 'CAPTAIN',
  PLAYER: 'PLAYER',
  SUBSTITUTE: 'SUBSTITUTE',
  COACH: 'COACH',
  MANAGER: 'MANAGER',
  ANALYST: 'ANALYST'
} as const;

export type TeamRole = typeof TeamRole[keyof typeof TeamRole];

export type TeamStatus = 'active' | 'inactive' | 'recruiting'
export type MemberStatus = 'active' | 'inactive' | 'pending'

export interface User {
  id: string
  fullname: string
  email?: string
  avatarUrl?: string
  phoneNumber?: string
  isActive?: boolean
  createdAt?: string
  updatedAt?: string
}

export interface Game {
  id: string;
  name: string;
  description?: string;
  genre?: string;
  developer?: string;
  publisher?: string;
  releaseDate?: string;
  logo?: string;
  status?: 'active' | 'inactive';
  isActive?: boolean;
  isDeleted?: boolean;
  deletedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TeamMember {
  id: string
  userId: string
  teamId: string
  role: TeamRole
  gameRole?: string
  inGameName?: string
  kda?: string
  winRate?: number
  status: MemberStatus
  isApproved: boolean
  joinDate: string
  avatarUrl?: string
  email?: string
  phoneNumber?: string
  user?: User
  team?: Team
}

export interface Team {
  id: string
  name: string
  logo?: string
  description?: string
  gameId?: string
  game?: Game
  maxMembers: number
  winRate: number
  tournamentsCount: number
  createdById?: string
  createdBy?: User
  status: TeamStatus
  tags?: string[]
  contactEmail?: string
  contactPhone?: string
  discordLink?: string
  createdAt: string
  updatedAt: string
  isActive: boolean
  isDeleted: boolean
  deletedAt?: string
  members?: TeamMember[]
  tournamentRegistrations?: any[]
}

export interface TeamStats {
  teamInfo: {
    id: string
    name: string
    game: string
    maxMembers: number
    winRate: number
    tournamentsCount: number
    status: TeamStatus
    description?: string
    logo?: string
  }
  stats: {
    activeMembers: number
    pendingMembers: number
    approvedMembers: number
    averageWinRate: number
    captain: {
      name: string
      avatarUrl?: string
    } | null
  }
}

export interface CreateTeamDto {
  name: string
  description?: string
  logo?: string
  gameId: string
  maxMembers?: number
  status?: TeamStatus
  tags?: string[]
  contactEmail?: string
  contactPhone?: string
  discordLink?: string
}

export interface UpdateTeamDto extends Partial<CreateTeamDto> {
  winRate?: number
  tournamentsCount?: number
}

export interface CreateTeamMemberDto {
  userId: string
  role?: TeamRole
  gameRole?: string
  inGameName?: string
  kda?: string
  winRate?: number
  status?: MemberStatus
  email?: string
  phoneNumber?: string
  avatarUrl?: string
}

export interface UpdateTeamMemberDto extends Partial<CreateTeamMemberDto> {
  isApproved?: boolean
}

export interface PaginationParams {
  page?: number
  limit?: number
  search?: string
}

export interface PaginatedResponse<T> {
  statusCode: number
  message: string
  data: T[]
  meta: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}