export interface Tournament {
  id: string;
  name: string;
  description: string;
  game: string;
  type: string;
  format: string;
  status: string;
  visibility: string;
  logoUrl?: string;
  bannerUrl?: string;
  registrationStart?: string;
  registrationEnd?: string;
  tournamentStart?: string;
  tournamentEnd?: string;
  maxTeams: number;
  minTeamSize: number;
  maxTeamSize: number;
  allowIndividual: boolean;
  registrationFee: number;
  prizePool: number;
  prizeGuaranteed: boolean;
  city?: string;
  venue?: string;
  streamUrl?: string;
  rules?: string;
  approvedTeamsCount: number;
  registrationProgress: number;
  registrationStatus: string;
  timeStatus?: {
    label: string;
    color: string;
    icon: string;
  };
  organizer?: {
    id: string;
    username: string;
    email: string;
    avatar?: string;
  };
  stages?: Stage[];
  registrations?: Registration[];
  settings?: any;
}

export interface Stage {
  id: string;
  name: string;
  type: string;
  stageOrder: number;
  format: any;
  startDate?: string;
  endDate?: string;
  brackets?: Bracket[];
}

export interface Bracket {
  id: string;
  name: string;
  bracketOrder: number;
  isFinal: boolean;
  matches?: Match[];
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
}

export interface Team {
  id: string;
  name: string;
  tag: string;
  logoUrl?: string;
}

export interface Registration {
  id: string;
  team: Team;
  status: string;
  registeredAt: string;
}


export interface RegistrationResponse {
  id: string;
  tournamentId: string;
  teamId: string;
  status: string;
  registeredAt: string;
  approvedAt?: string;
  hasCheckedIn: boolean;
  checkedInAt?: string;
  registrationData?: any;
}

export interface RegistrationStatusResponse {
  isRegistered: boolean;
  status?: string;
  registration?: RegistrationResponse;
  canRegister: boolean;
  reasons?: string[];
}

export interface EligibilityResponse {
  eligible: boolean;
  reasons?: string[];
  remainingSlots: number;
  canRegister: boolean;
  checks: {
    isPublic: boolean;
    isRegistrationOpen: boolean;
    hasAvailableSlots: boolean;
    userNotRegistered: boolean;
    userNotOrganizer: boolean;
  };
  registrationStatus?: RegistrationStatusResponse;
}

export interface RegistrationRequest {
  teamId: string;
  registrationData?: any;
}

export interface UpdateRegistrationStatusRequest {
  status: string;
  reason?: string;
}

export interface CheckInRequest {
  teamId: string;
}

export interface CancelRegistrationRequest {
  teamId: string;
  reason?: string;
}

export interface BulkRegisterRequest {
  teamIds: string[];
}

export interface RegistrationListResponse {
  success: boolean;
  data: RegistrationResponse[];
  total: number;
  isOrganizer: boolean;
}
