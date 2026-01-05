import type { Match } from "@/common/types";
import api from "./api";

export const matchService = {
async assignTeam(
    matchId: string, 
    data: {
      teamId: string;
      slot: 1 | 2;
    }
  ): Promise<Match> {
    const response = await api.put(`/matches/${matchId}/assign-team`, data);
    return response.data;
  },
  async updateResult(
    matchId: string, 
    data: {
      team1Score: number;
      team2Score: number;
      winnerId?: string;
      gameResults?: any[];
    }
  ): Promise<Match> {
    const response = await api.put(`/matches/${matchId}/result`, data);
    return response.data;
  },
   async getMatch(matchId: string): Promise<Match> {
    const response = await api.get(`/matches/${matchId}`);
    return response.data;
  },

  // Lên lịch match
  async schedule(
    matchId: string, 
    data: {
      scheduledTime: Date;
      streamUrl?: string;
      refereeId?: string;
    }
  ): Promise<Match> {
    const response = await api.put(`/matches/${matchId}/schedule`, data);
    return response.data;
  },

  // Start match
  async start(matchId: string): Promise<Match> {
    const response = await api.post(`/matches/${matchId}/start`);
    return response.data;
  },

  // Complete match
  async complete(matchId: string): Promise<Match> {
    const response = await api.post(`/matches/${matchId}/complete`);
    return response.data;
  },

  // Remove team khỏi match
  async removeTeam(matchId: string, slot: 1 | 2): Promise<Match> {
    const response = await api.delete(`/matches/${matchId}/teams/${slot}`);
    return response.data;
  },

  // Lấy matches của một bracket
  async getBracketMatches(
    bracketId: string, 
    filters?: {
      round?: number;
      status?: string;
    }
  ): Promise<Match[]> {
    const response = await api.get(`/brackets/${bracketId}/matches`, { params: filters });
    return response.data;
  },

  // Lấy matches của một stage
  async getStageMatches(stageId: string): Promise<Match[]> {
    const response = await api.get(`/stages/${stageId}/matches`);
    return response.data;
  },

  // Lấy matches theo tournament
  async getTournamentMatches(
    tournamentId: string, 
    filters?: {
      status?: string;
      round?: number;
      page?: number;
      limit?: number;
    }
  ): Promise<{
    matches: Match[];
    total: number;
    page: number;
    limit: number;
  }> {
    const response = await api.get(`/tournaments/${tournamentId}/matches`, { params: filters });
    return response.data;
  },

  // Tạo match mới
  async createMatch(data: {
    bracketId: string;
    round: number;
    order: number;
    heapIndex: number;
    heapDepth: number;
    heapPosition: number;
    bestOf?: number;
  }): Promise<Match> {
    const response = await api.post('/matches', data);
    return response.data;
  },

  // Xóa match
  async deleteMatch(matchId: string): Promise<void> {
    await api.delete(`/matches/${matchId}`);
  },

  // Set stream URL
  async setStreamUrl(matchId: string, streamUrl: string): Promise<Match> {
    const response = await api.put(`/matches/${matchId}/stream`, { streamUrl });
    return response.data;
  },

  // Lấy match games
  async getMatchGames(matchId: string): Promise<any[]> {
    const response = await api.get(`/matches/${matchId}/games`);
    return response.data;
  },

  // Add game result
  async addGameResult(matchId: string, gameData: any): Promise<any> {
    const response = await api.post(`/matches/${matchId}/games`, gameData);
    return response.data;
  },

  // Lấy next match để advance winner
  async getNextMatch(matchId: string): Promise<Match | null> {
    const response = await api.get(`/matches/${matchId}/next`);
    return response.data;
  },

  // Auto advance winners
  async autoAdvanceWinners(bracketId: string): Promise<any> {
    const response = await api.post(`/brackets/${bracketId}/auto-advance`);
    return response.data;
  }
}