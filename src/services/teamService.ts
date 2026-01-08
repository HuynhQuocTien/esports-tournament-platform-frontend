import api from './api';
import type { 
  Team, 
  CreateTeamDto, 
  UpdateTeamDto, 
  PaginationParams, 
  PaginatedResponse 
} from '@/common/types/team';

export class TeamService {
  private baseUrl = '/teams';

  async createTeam(data: CreateTeamDto): Promise<Team> {
    try {
      const response = await api.post(this.baseUrl, data);
      return response.data.data;
    } catch (error: any) {
      throw this.handleError(error, 'Tạo đội thất bại');
    }
  }

  async getTeamMembers(teamId: string): Promise<Team[]> {
    try {
      const response = await api.get(`${this.baseUrl}/${teamId}/members`);
      return response.data.data;
    } catch (error: any) {
      throw this.handleError(error, 'Lấy thành viên đội thất bại');
    }
  }

  async getTeams(params?: PaginationParams): Promise<PaginatedResponse<Team>> {
    try {
      const response = await api.get(this.baseUrl, { params });
      return response.data;
    } catch (error: any) {
      throw this.handleError(error, 'Lấy danh sách đội thất bại');
    }
  }

  async getMyTeams(params?: PaginationParams): Promise<PaginatedResponse<Team>> {
    try {
      const response = await api.get(`${this.baseUrl}/my-teams`, { params });
      return response.data;
    } catch (error: any) {
      throw this.handleError(error, 'Lấy danh sách đội của bạn thất bại');
    }
  }

  async getTeam(id: string): Promise<Team> {
    try {
      const response = await api.get(`${this.baseUrl}/${id}`);
      return response.data.data;
    } catch (error: any) {
      throw this.handleError(error, 'Lấy thông tin đội thất bại');
    }
  }

  async getTeamStats(id: string): Promise<any> {
    try {
      const response = await api.get(`${this.baseUrl}/${id}/stats`);
      return response.data.data;
    } catch (error: any) {
      throw this.handleError(error, 'Lấy thống kê đội thất bại');
    }
  }

  async updateTeam(id: string, data: UpdateTeamDto): Promise<Team> {
    try {
      const response = await api.patch(`${this.baseUrl}/${id}`, data);
      return response.data.data;
    } catch (error: any) {
      throw this.handleError(error, 'Cập nhật đội thất bại');
    }
  }

  async updateTeamStatus(id: string, status: 'active' | 'inactive' | 'recruiting'): Promise<Team> {
    try {
      const response = await api.patch(`${this.baseUrl}/${id}/status`, { status });
      return response.data.data;
    } catch (error: any) {
      throw this.handleError(error, 'Cập nhật trạng thái đội thất bại');
    }
  }

  async deleteTeam(id: string): Promise<void> {
    try {
      await api.delete(`${this.baseUrl}/${id}`);
    } catch (error: any) {
      throw this.handleError(error, 'Xóa đội thất bại');
    }
  }

  private handleError(error: any, defaultMessage: string): Error {
    if (error.response) {
      const { status, data } = error.response;
      
      switch (status) {
        case 400:
          return new Error(data.message || 'Dữ liệu không hợp lệ');
        case 401:
          return new Error('Bạn cần đăng nhập để thực hiện thao tác này');
        case 403:
          return new Error('Bạn không có quyền thực hiện thao tác này');
        case 404:
          return new Error(data.message || 'Không tìm thấy đội');
        case 409:
          return new Error(data.message || 'Đội đã tồn tại');
        case 500:
          return new Error('Đã xảy ra lỗi hệ thống. Vui lòng thử lại sau');
        default:
          return new Error(data.message || defaultMessage);
      }
    }
    return new Error(defaultMessage);
  }
}

export const teamService = new TeamService();