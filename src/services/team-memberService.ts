import { jwtDecode } from 'jwt-decode';
import api from './api';
import type {
  TeamMember,
  CreateTeamMemberDto,
  UpdateTeamMemberDto,
  TeamStats
} from '@/common/types/team';
import type { JwtPayload } from '@/common/interfaces/payload/jwt-payload';

export class TeamMemberService {
  private baseUrl = '/teams';

  async addMember(teamId: string, data: CreateTeamMemberDto): Promise<TeamMember> {
    try {
      const response = await api.post(`${this.baseUrl}/${teamId}/members`, data);
      return response.data.data;
    } catch (error: any) {
      throw this.handleError(error, 'Thêm thành viên thất bại');
    }
  }

  async getMembers(teamId: string, status?: 'active' | 'inactive' | 'pending'): Promise<TeamMember[]> {
    try {
      const params = status ? { status } : {};
      const response = await api.get(`${this.baseUrl}/${teamId}/members`, { params });
      return response.data.data;
    } catch (error: any) {
      throw this.handleError(error, 'Lấy danh sách thành viên thất bại');
    }
  }

  async getMember(teamId: string, memberId: string): Promise<TeamMember> {
    try {
      const response = await api.get(`${this.baseUrl}/${teamId}/members/${memberId}`);
      return response.data.data;
    } catch (error: any) {
      throw this.handleError(error, 'Lấy thông tin thành viên thất bại');
    }
  }

  async updateMember(teamId: string, memberId: string, data: UpdateTeamMemberDto): Promise<TeamMember> {
    try {
      const response = await api.patch(`${this.baseUrl}/${teamId}/members/${memberId}`, data);
      return response.data.data;
    } catch (error: any) {
      throw this.handleError(error, 'Cập nhật thành viên thất bại');
    }
  }

  async approveMember(teamId: string, memberId: string): Promise<TeamMember> {
    try {
      const response = await api.patch(`${this.baseUrl}/${teamId}/members/${memberId}/approve`);
      return response.data.data;
    } catch (error: any) {
      throw this.handleError(error, 'Phê duyệt thành viên thất bại');
    }
  }

  async rejectMember(teamId: string, memberId: string): Promise<void> {
    try {
      await api.patch(`${this.baseUrl}/${teamId}/members/${memberId}/reject`);
    } catch (error: any) {
      throw this.handleError(error, 'Từ chối thành viên thất bại');
    }
  }

  async leaveTeam(teamId: string): Promise<void> {
    try {
      await api.post(`${this.baseUrl}/${teamId}/members/leave`);
    } catch (error: any) {
      throw this.handleError(error, 'Rời đội thất bại');
    }
  }

  async transferCaptain(teamId: string, newCaptainId: string): Promise<void> {
    try {
      await api.post(`${this.baseUrl}/${teamId}/members/${newCaptainId}/transfer-captain`);
    } catch (error: any) {
      throw this.handleError(error, 'Chuyển quyền đội trưởng thất bại');
    }
  }

  async removeMember(teamId: string, memberId: string): Promise<void> {
    try {
      await api.delete(`${this.baseUrl}/${teamId}/members/${memberId}`);
    } catch (error: any) {
      throw this.handleError(error, 'Xóa thành viên thất bại');
    }
  }

  async checkTeamPermission(teamId: string): Promise<boolean> {
    try {
      const response = await api.get(`${this.baseUrl}/${teamId}`);
      const team = response.data.data;

      const token = localStorage.getItem('access_token');
      const decoded: JwtPayload = jwtDecode(token || '');
      const currentUserId = decoded.id;

      if (team.createdById === currentUserId) {
        return true;
      }
      const members = await this.getMembers(teamId);
      const captainMember = members.find(m =>
        m.userId === currentUserId &&
        m.role === 'CAPTAIN' &&
        m.status === 'active'
      );

      return !!captainMember;
    } catch (error) {
      return false;
    }
  }
  async checkInGameNameExists(
    teamId: string,
    inGameName: string,
    excludeMemberId?: string
  ): Promise<boolean> {
    try {
      const response = await api.post(`/teams/${teamId}/members/check-in-game-name`, {
        inGameName,
        excludeMemberId
      });
      return response.data.data.exists;
    } catch (error) {
      console.error('Error checking in-game name:', error);
      throw error;
    }
  }

  async getTeamStats(teamId: string): Promise<TeamStats> {
    const response = await api.get(`/teams/${teamId}/members/stats/team-stats`);
    return response.data.data;
  }

  private handleError(error: any, defaultMessage: string): Error {
    if (error.response) {
      const { status, data } = error.response;

      switch (status) {
        case 400:
          const message = data.message || 'Dữ liệu không hợp lệ';

          if (message.includes('đã là thành viên')) {
            return new Error('Người này đã là thành viên của đội khác');
          }
          if (message.includes('đã đủ số lượng')) {
            return new Error('Đội đã đủ số lượng thành viên tối đa');
          }
          if (message.includes('đã có đội trưởng')) {
            return new Error('Đội đã có đội trưởng');
          }
          if (message.includes('Không thể xóa đội trưởng')) {
            return new Error('Không thể xóa đội trưởng. Vui lòng chuyển quyền đội trưởng trước');
          }
          if (message.includes('Đội trưởng không thể rời đội')) {
            return new Error('Đội trưởng không thể rời đội. Vui lòng chuyển quyền đội trưởng trước');
          }
          return new Error(message);

        case 401:
          return new Error('Bạn cần đăng nhập để thực hiện thao tác này');
        case 403:
          return new Error('Bạn không có quyền thực hiện thao tác này');
        case 404:
          return new Error(data.message || 'Không tìm thấy thành viên');
        case 409:
          return new Error(data.message || 'Thành viên đã tồn tại');
        case 500:
          return new Error('Đã xảy ra lỗi hệ thống. Vui lòng thử lại sau');
        default:
          return new Error(data.message || defaultMessage);
      }
    }
    return new Error(defaultMessage);
  }
}

export const teamMemberService = new TeamMemberService();