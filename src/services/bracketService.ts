import api from './api';

export interface GenerateBracketRequest {
  format: string;
  matchFormat: string;
  matchDuration: number;
}

export interface BracketResponse {
  success: boolean;
  message: string;
  data?: {
    bracketId: string;
    totalMatches: number;
    rounds: number;
  };
}

export const bracketService = {
  // Gọi BE để tạo bracket
  async generateBracket(tournamentId: string, data: GenerateBracketRequest): Promise<BracketResponse> {
    try {
      const response = await api.post(`/tournaments/${tournamentId}/generate-brackets`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Lấy cấu trúc bracket
  async getBracketStructure(tournamentId: string) {
    try {
      const response = await api.get(`/tournaments/${tournamentId}/brackets`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Lấy thông tin bracket
  async getBracketInfo(tournamentId: string) {
    try {
      const response = await api.get(`/tournaments/${tournamentId}/brackets/info`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Kiểm tra xem bracket đã được tạo chưa
  async checkBracketExists(tournamentId: string): Promise<boolean> {
    try {
      const response = await api.get(`/tournaments/${tournamentId}/brackets/exists`);
      return response.data.exists;
    } catch (error) {
      return false;
    }
  },

  // Xóa bracket
  async deleteBracket(tournamentId: string): Promise<void> {
    try {
      await api.delete(`/tournaments/${tournamentId}/brackets`);
    } catch (error) {
      throw error;
    }
  },
};