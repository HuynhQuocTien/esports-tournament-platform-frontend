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
  registrationStart?:  Dayjs;
  registrationEnd?: Dayjs;
  tournamentStart?:  Dayjs;
  tournamentEnd?:  Dayjs;
  maxTeams: number;
  type: string;
  format: string;
}

export interface TournamentSetting {
  type: TournamentFormat;
  maxTeams: number;
  minTeamSize: number;
  maxTeamSize: number;
  allowIndividual: boolean;
  visibility: 'PUBLIC' | 'PRIVATE' | 'INVITE_ONLY';
  registrationFee?: number;
  prizePool?: number;
  prizeGuaranteed?: boolean;
  defaultBestOf?: number;
  defaultMatchTime?: number;
  allowDraws?: boolean;
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
  // ... thêm các trường cần thiết
}

export interface TournamentData {
  basicInfo: TournamentBasicInfo;
  settings: TournamentSetting;
  stages: TournamentStage[];
  rules: TournamentRule[];
  registrations: TournamentRegistration[];
}

export type TournamentDataKey = keyof TournamentData;

// Request DTOs
export interface CreateTournamentRequest {
  // BASIC INFO
  name: string;
  game: string;
  description?: string;
  logoUrl?: string;
  bannerUrl?: string;
  registrationStart?: Dayjs;
  registrationEnd?: Dayjs;
  tournamentStart?: Dayjs;
  tournamentEnd?: Dayjs;

  // SETTINGS
  type: TournamentFormat;
  maxTeams: number;
  minTeamSize: number;
  maxTeamSize: number;
  allowIndividual: boolean;
  visibility: 'PUBLIC' | 'PRIVATE' | 'INVITE_ONLY';
  registrationFee?: number;
  prizePool?: number;
  prizeGuaranteed?: boolean;

  // Advanced settings
  setting?: {
    defaultBestOf?: number;
    defaultMatchTime?: number;
    allowDraws?: boolean;
  };

  // SUB ENTITIES
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


// API Response
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

// API Service Interface
export interface ITournamentApiService {
  getTournament(id: string): Promise<TournamentApiResponse>;
  createTournament(data: CreateTournamentRequest): Promise<TournamentApiResponse>;
  updateTournament(data: UpdateTournamentRequest): Promise<TournamentApiResponse>;
  saveDraft(id: string, data: Partial<TournamentData>): Promise<void>;
  publishTournament(id: string, data: PublishTournamentRequest): Promise<void>;
  deleteTournament(id: string): Promise<void>;
}

export function mapTournamentDataToApi(
  data: TournamentData,
): CreateTournamentRequest {
  return {
    // id: tournamentId,
    // BASIC INFO
    name: data.basicInfo.name,
    game: data.basicInfo.game,
    description: data.basicInfo.description ?? "",
    logoUrl: data.basicInfo.logoUrl,
    bannerUrl: data.basicInfo.bannerUrl,
    registrationStart: data.basicInfo.registrationStart,
    registrationEnd: data.basicInfo.registrationEnd,
    tournamentStart: data.basicInfo.tournamentStart,
    tournamentEnd: data.basicInfo.tournamentEnd,

    // SETTINGS
    type: data.settings.type,
    maxTeams: data.settings.maxTeams,
    minTeamSize: data.settings.minTeamSize,
    maxTeamSize: data.settings.maxTeamSize,
    allowIndividual: data.settings.allowIndividual,
    visibility: data.settings.visibility,
    registrationFee: data.settings.registrationFee ?? 0,
    prizePool: data.settings.prizePool ?? 0,
    prizeGuaranteed: data.settings.prizeGuaranteed ?? false,

    // Nâng cao
    setting: {
      defaultBestOf: data.settings.defaultBestOf ?? 1,
      defaultMatchTime: data.settings.defaultMatchTime ?? 30,
      allowDraws: data.settings.allowDraws ?? false,
    },

    // SUB ENTITIES
    stages: data.stages,
    rules: data.rules,
  };
}
