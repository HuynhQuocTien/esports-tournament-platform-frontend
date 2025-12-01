// Object chứa tất cả giá trị
export const TournamentFormatValues = [
  "SINGLE_ELIMINATION",
  "DOUBLE_ELIMINATION",
  // "ROUND_ROBIN",
  // "SWISS_SYSTEM",
  // "GROUP_STAGE",
  // "HYBRID",
] as const;

// Union type từ mảng
export type TournamentFormat = typeof TournamentFormatValues[number];
export interface ITournament {
  name: string;
  game: string;
  format: string;
  maxTeams: number;
  startDate: Date;
  endDate: Date;
}

export interface TournamentBasicInfo {
  name?: string;
  game?: string;
  description?: string;
  logoUrl?: string;
  bannerUrl?: string;
  registrationStart?: Date;
  registrationEnd?: Date;
  tournamentStart?: Date;
  status?: string;
}

export interface TounamentSetting {
  type?: string;
  maxTeams?: number;
  minTeamSize?: number;
  maxTeamSize?: number;
  allowIndividual?: boolean;
  visibility?: string;
  registrationFee?: number;
  prizePool?: number;
  defaultBestOf?: number;
  defaultMatchTime?: string;
  allowDraws?: boolean;
}

export interface TournamentStage {
  id: string;
  name: string;
  stageOreder: number;
  type: string;
  format?: any;
  numberOfGroups?: number;
  teamsPerGroup?: number;
  isSeeded?: boolean;
  startDate?: Date;
  endDate?: Date;
}

export interface TournamentPrize {
  id: string;
  position: number;
  type: string;
  description: string;
  cashValue?: number;
  quantity?: number;
  sponsor?: string;
  prizeDetails?: any;
}

export interface TournamentRule {
  id: string;
  title: string;
  content: string;
  order: number;
  isRequired: boolean;
}

export interface TournamentRegistration {
}

export interface TournamentData {
  basicInfo: TournamentBasicInfo;
  settings: TounamentSetting;
  stages: TournamentStage[];
  prizes: TournamentPrize[];
  rules: TournamentRule[];
  registrations: TournamentRegistration[];
}

export type TournamentDataKey = keyof TournamentData;

export interface TournamentStepProps {
  data: TournamentData;
  updateData: (key: TournamentDataKey, data: any) => void;
}
