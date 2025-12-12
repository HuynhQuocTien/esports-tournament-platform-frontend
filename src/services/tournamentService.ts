import api from "./api";
import type { PublishTournamentRequest, TournamentApiResponse, TournamentBasicInfo, TournamentData } from "@/common/types";

export const tournamentService = {
  create: (data: Partial<TournamentBasicInfo>) =>
    api.post<TournamentBasicInfo>("/tournaments", data),
  update: (id: string, data: Partial<TournamentBasicInfo>) =>
    api.patch<TournamentBasicInfo>(`/tournaments/${id}`, data),
  getById: (id: string) => api.get(`/tournaments/${id}`),
  listMine: () => api.get<TournamentBasicInfo[]>("/tournaments"),
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

  getFeature: () =>  api.get(`/tournaments/featured`)
};
