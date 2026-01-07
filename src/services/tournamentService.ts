// frontend/src/services/tournamentService.ts
import type { BulkRegisterRequest, CancelRegistrationRequest, CheckInRequest, RegistrationListResponse, RegistrationRequest, RegistrationResponse, RegistrationStatusResponse, UpdateRegistrationStatusRequest } from "@/common/interfaces/tournament/tournament";
import api from "./api";
import type { PaginatedTournamentsResponse, PublishTournamentRequest, TournamentApiResponse, TournamentBasicInfo, TournamentData } from "@/common/types";

export const tournamentService = {
  create: (data: Partial<TournamentBasicInfo>) =>
    api.post<TournamentBasicInfo>("/tournaments", data),
  update: (id: string, data: Partial<TournamentBasicInfo>) =>
    api.patch<TournamentBasicInfo>(`/tournaments/${id}`, data),
  getById: (id: string) => api.get(`/tournaments/${id}`),
  listMine: () => api.get<TournamentBasicInfo[]>("/tournaments/mine"),
  listPublic: () => api.get("tournaments"),
  register: (tournamemtId: number, teamName?: string) =>
    api.post(`/tournaments/${tournamemtId}/register`, { team_name: teamName }),
  generateBracket: (tournamemtId: number) =>
    api.post(`/tournaments/${tournamemtId}/generate-bracket`),
  createMatch: (data: any) => api.post(`tournaments/matches`, data),
  updateMatchScore: (matchId: number, scoreA: number, scoreB: number) =>
    api.patch(`tournaments/matches/${matchId}/score`, { scoreA, scoreB }),
  standings: (tournamentId: number) =>
    api.get(`/tournaments/${tournamentId}/standings`),
  getForSetup: async (id: string) => {
    const res = await api.get(`/tournaments/setup/${id}`)
    return res.data;
  },
    
  updateTournamentSection: (id: string, section: keyof TournamentData, data: any): Promise<TournamentApiResponse> =>
    api.patch(`/tournaments/${id}/${section}`),
  saveDraft: (id: string) =>
    api.patch(`tournaments/${id}/draft`),
  publishTournament: (id: string, data: PublishTournamentRequest) =>
    api.patch(`/tournaments/${id}/publish`),
  async uploadImage(file: File, type: 'logo' | 'banner'): Promise<{ url: string}> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    const res = await api.post(`tournament/upload`, formData);
    return res.data;
  },

  getFeature: () =>  api.get(`/tournament-public/featured`),

  getPublicTournaments: (params?: {
    page?: number;
    limit?: number;
    game?: string;
    status?: string;
    search?: string;
  }) => api.get<PaginatedTournamentsResponse>("/tournament-public/filler", { params }),
  
   checkEligibility: (tournamentId: string) =>
    api.get<{ eligible: boolean; reason?: string }>(`/tournaments/${tournamentId}/check-eligibility`),

  async generateBrackets(
    tournamentId: string, 
    options: {
      format: string;
      teams: any[];
      seedingMethod?: 'RANDOM' | 'MANUAL' | 'RANKING';
    }
  ): Promise<any> {
    const response = await api.post(`/tournaments/${tournamentId}/brackets/generate`, options);
    return response.data;
  },
  async seedTeams(
    tournamentId: string, 
    seeds: Array<{ teamId: string; seed: number }>
  ): Promise<any> {
    const response = await api.post(`/tournaments/${tournamentId}/seed`, { seeds });
    return response.data;
  },


  registerForTournament: (tournamentId: string, data: RegistrationRequest) =>
    api.post<RegistrationResponse>(`/tournaments/${tournamentId}/register`, data),
  
  // Kiểm tra trạng thái đăng ký
  getRegistrationStatus: (tournamentId: string, teamId: string) =>
    api.get<RegistrationStatusResponse>(`/tournaments/${tournamentId}/registration-status/${teamId}`),
  
  // Lấy danh sách đăng ký
  getRegistrations: (tournamentId: string, status?: string) =>
    api.get<RegistrationListResponse>(`/tournaments/${tournamentId}/registrations`, { params: { status } }),
  
  // Cập nhật trạng thái đăng ký (cho organizer/admin)
  updateRegistrationStatus: (tournamentId: string, registrationId: string, data: UpdateRegistrationStatusRequest) =>
    api.patch<RegistrationResponse>(`/tournaments/${tournamentId}/registrations/${registrationId}/status`, data),
  
  // Check-in vào giải đấu
  checkIn: (tournamentId: string, data: CheckInRequest) =>
    api.post<RegistrationResponse>(`/tournaments/${tournamentId}/check-in`, data),
  
  // Hủy đăng ký
  cancelRegistration: (tournamentId: string, data: CancelRegistrationRequest) =>
    api.delete(`/tournaments/${tournamentId}/cancel-registration`, { data }),
  
  // Đăng ký hàng loạt (cho organizer/admin)
  bulkRegister: (tournamentId: string, data: BulkRegisterRequest) =>
    api.post<{ success: string[]; failed: Array<{ teamId: string; reason: string }> }>(
      `/tournaments/${tournamentId}/bulk-register`, 
      data
    ),

};
