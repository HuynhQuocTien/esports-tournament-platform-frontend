import api from './api';

export interface Game {
  id: string;
  name: string;
  description?: string;
  logo?: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export class GameService {
  private baseUrl = '/games';

  async getGames(): Promise<Game[]> {
    try {
      const response = await api.get(this.baseUrl);
      return response.data;
    } catch (error: any) {
      console.error('Lấy danh sách game thất bại:', error);
      return [];
    }
  }

  async getGame(id: string): Promise<Game | null> {
    try {
      const response = await api.get(`${this.baseUrl}/${id}`);
      return response.data.data;
    } catch (error: any) {
      console.error('Lấy thông tin game thất bại:', error);
      return null;
    }
  }
}

export const gameService = new GameService();