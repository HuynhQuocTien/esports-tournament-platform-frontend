import type { UploadFile } from "antd";
import type dayjs from "dayjs";
import type { Dayjs } from "dayjs";

export const TournamentFormatValues = [
  "SINGLE_ELIMINATION",
  "DOUBLE_ELIMINATION",
  "ROUND_ROBIN",
  "SWISS_SYSTEM",
  "GROUP_STAGE",
  "HYBRID",
] as const;

export type TournamentFormat = typeof TournamentFormatValues[number];

export interface TournamentBasicInfo {
  id: string;
  name: string;
  game: string;
  description?: string;
  logoUrl?: string;
  bannerUrl?: string;
  registrationStart?: Dayjs;
  registrationEnd?: Dayjs;
  tournamentStart?: Dayjs;
  tournamentEnd?: Dayjs;
  maxTeams: number;
  type: string;
  format: string;
  status?: string;
  prizePool?: number;
  registeredTeams?: number;
  organizer?: {
    id: string;
    name: string;
  };
  approvedTeamsCount?: number;
  registrationProgress?: number;
  registrationStatus?: string;
  timeStatus?: {
    label: string;
    color: string;
    icon: string;
  };
  visibility?: 'PUBLIC' | 'PRIVATE' | 'INVITE_ONLY';
}

export const TournamentStatus = {
  DRAFT: 'DRAFT',
  PUBLISHED: 'PUBLISHED',
  REGISTRATION_OPEN: 'REGISTRATION_OPEN',
  REGISTRATION_CLOSED: 'REGISTRATION_CLOSED',
  ONGOING: 'ONGOING',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
} as const;

export type TournamentStatus =
  typeof TournamentStatus[keyof typeof TournamentStatus];

export const MatchStatus = {
  PENDING: 'PENDING',
  SCHEDULED: 'SCHEDULED',
  PROCESSING: 'PROCESSING',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
} as const;

export type MatchStatus =
  typeof MatchStatus[keyof typeof MatchStatus];

export interface TournamentSetting {
  id?: string;
  tournament?: Tournament;
  
  allowTeamRegistration: boolean;
  requireApproval: boolean;
  allowDraws: boolean;
  defaultBestOf: number;
  matchFormat?: any; 
  autoSchedule: boolean;
  defaultMatchTime: number;
  notifyMatchStart: boolean;
  notifyRegistration: boolean;
  notifyResults: boolean;
  requireStream: boolean;
  streamPlatforms: string[];
  
  // Các trường timestamp
  createdAt?: Date;
  updatedAt?: Date;
}


export interface TournamentStage {
  id?: string;
  name: string;
  stageOrder: number;
  type: string;
  format?: any;
  numberOfGroups?: number;
  teamsPerGroup?: number;
  isSeeded?: boolean;
  startDate?: string;
  endDate?: string;
  tournamentId?: string;
  brackets?: Bracket[];
}

export interface Bracket{
  id: string;
  name:string;
  stageId: string;
  stageName: string;
  bracketOrder: number;
  isFinal: boolean;
  matches: Match[];
}

export interface DragData {
  
}

export interface TournamentPrize {
  id?: string;
  position: number;
  type: 'CASH' | 'ITEM' | 'TROPHY' | 'OTHER';
  description: string;
  cashValue?: number;
  quantity?: number;
  sponsor?: string;
  prizeDetails?: any;
  tournamentId?: string;
}

export interface TournamentRule {
  id?: string;
  title: string;
  content: string;
  order: number;
  isRequired: boolean;
  tournamentId?: string;
}

export interface TournamentRegistration {
  id?: string;
  team: Team;
  status: 'pending' | 'approved' | 'rejected';
  registeredAt: string;

}

export interface TournamentData {
  basicInfo: TournamentBasicInfo;
  settings: TournamentSetting;
  stages: TournamentStage[];
  rules: TournamentRule[];
  registrations: TournamentRegistration[];
}

export type TournamentDataKey = keyof TournamentData;

export interface CreateTournamentRequest {
  name: string;
  game: string;
  description?: string;
  logoUrl?: string;
  bannerUrl?: string;
  registrationStart?: Dayjs;
  registrationEnd?: Dayjs;
  tournamentStart?: Dayjs;
  tournamentEnd?: Dayjs;

  type: TournamentFormat;
  maxTeams: number;
  minTeamSize: number;
  maxTeamSize: number;
  allowIndividual: boolean;
  visibility: 'PUBLIC' | 'PRIVATE' | 'INVITE_ONLY';
  registrationFee?: number;
  prizePool?: number;
  prizeGuaranteed?: boolean;

  setting?: {
    defaultBestOf?: number;
    defaultMatchTime?: number;
    allowDraws?: boolean;
  };

  stages: TournamentStage[];
  rules: TournamentRule[];
  registrations?: TournamentRegistration[];

  organizerId?: string;
}

export interface UpdateTournamentRequest extends Partial<TournamentData> {
  id: string;
}

export interface PublishTournamentRequest {
  id: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ONGOING' | 'COMPLETED' | 'CANCELLED';
}

export interface TournamentStepProps {
  data: TournamentData;
  updateData: (key: TournamentDataKey, data: any) => void;
}

export interface UploadState {
  logoFile?: UploadFile;
  bannerFile?: UploadFile;
  logoUploading: boolean;
  bannerUploading: boolean;
}

export interface FormBasicInfo extends Omit<TournamentBasicInfo, 'registrationStart' | 'registrationEnd' | 'tournamentStart'> {
  registrationStart?: dayjs.Dayjs;
  registrationEnd?: dayjs.Dayjs;
  tournamentStart?: dayjs.Dayjs;
}


export interface TournamentApiResponse {
  id: string;
  name: string;
  description: string;
  game: string;
  type: TournamentFormat;
  visibility: string;
  logoUrl: string | null;
  bannerUrl: string | null;
  registrationStart: string | null;
  registrationEnd: string | null;
  tournamentStart: string | null;
  tournamentEnd: string | null;
  maxTeams: number;
  minTeamSize: number;
  maxTeamSize: number;
  allowIndividual: boolean;
  registrationFee: string;
  prizePool: string;
  prizeGuaranteed: boolean;
  status: string;
  isPublished: boolean;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  organizer: {
    id: string;
    role: {
      id: string;
      name: string;
      description: string;
    };
  };
  stages: TournamentStage[];
  registrations: TournamentRegistration[];
  settings: any;
  rules: TournamentRule[];
}

export interface ITournamentApiService {
  getTournament(id: string): Promise<TournamentApiResponse>;
  createTournament(data: CreateTournamentRequest): Promise<TournamentApiResponse>;
  updateTournament(data: UpdateTournamentRequest): Promise<TournamentApiResponse>;
  saveDraft(id: string, data: Partial<TournamentData>): Promise<void>;
  publishTournament(id: string, data: PublishTournamentRequest): Promise<void>;
  deleteTournament(id: string): Promise<void>;
}

export interface Match {
    id: string;
    round: number;
    order: number;
    team1?: Team;
    team2?: Team;
    team1Score?: number;
    team2Score?: number;
    status: string;
    scheduledTime?: string;
    winnerSeed: number | null;
    isHeapified: boolean;
    isBye: boolean;
    nextLoserMatch?: Match;
    heapDepth: number;
    heapPosition: number;
    matchIndex: number;
    team1Seed: number;
    team2Seed: number;
    isActive: boolean;
    heapValue: number;
}

export interface Tournament {
  id: string;
  name: string;
  description?: string;
  game: string;
  type: string;
  format: string;
  status: string;
  maxTeams: number;
  minTeamSize: number;
  maxTeamSize: number;
  registrationStart?: Date;
  registrationEnd?: Date;
  tournamentStart?: Date;
  tournamentEnd?: Date;
  logoUrl?: string;
  bannerUrl?: string;
  prizePool?: number;
  createdAt: Date;
  updatedAt: Date;
  team1seed: number;
  team2seed: number;
}

export interface Team {
  id: string;
  name: string;
  logoUrl?: string;
  seed?: number;
  members: TeamMember[];
}

export interface TeamMember {
  id: string;
  name: string;
  gameId: string;
  role?: string;
  rank?: string;
}

export interface Match {
  id: string;
  round: number;
  order: number;
  team1?: Team;
  team2?: Team;
  team1Score?: number;
  team2Score?: number;
  status: string;
  bracket?: Bracket;
  nextMatch?: Match;
  nextMatchSlot?: number;
  createdAt: Date;
}

export interface Bracket {
  id: string;
  name: string;
  bracketOrder: number;
  isFinal: boolean;
  matches: Match[];
}

export interface TournamentRegistrationRequest {
  type: 'team' | 'individual';
  teamInfo?: {
    teamName: string;
    teamTag?: string;
    teamDescription?: string;
    members: Array<{
      name: string;
      gameId: string;
      role?: string;
      rank?: string;
    }>;
    captainName: string;
    captainEmail: string;
    captainPhone: string;
  };
  individualInfo?: {
    fullName: string;
    age: number;
    email: string;
    phone: string;
    gameId: string;
    rank: string;
    mainRole?: string;
    experience?: string;
    availability?: string[];
    preferences?: string[];
  };
  agreeTerms: boolean;
}

export interface TournamentRegistrationResponse {
  id: string;
  status: string;
  message: string;
  registeredAt: string;
}

export interface TournamentEligibilityCheck {
  eligible: boolean;
  reasons: string[];
  remainingSlots: number;
}

export interface PaginatedTournamentsResponse {
  data: TournamentBasicInfo[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}