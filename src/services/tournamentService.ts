import api from "./api";
import type { TournamentBasicInfo } from "@/common/types";

export const tournamentService = {
  create: (data: Partial<TournamentBasicInfo>) =>
    api.post<TournamentBasicInfo>("/tournaments", data),
  update: (id: number, data: Partial<TournamentBasicInfo>) =>
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
};
