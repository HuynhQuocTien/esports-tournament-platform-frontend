import api from './api';
import type {
  User,
  UserCreateData,
  UserUpdateData,
  UsersResponse,
} from '@/common/types/user';

export class UserService {
  private baseUrl = '/users';

  async getUsers(
    page: number = 1,
    limit: number = 10,
    search?: string
  ): Promise<UsersResponse> {
    try {
      const params: any = { page, limit };
      if (search) params.search = search;

      const response = await api.get(this.baseUrl, { params });
      return response.data;
    } catch (error: any) {
      throw this.handleError(error, 'Lấy danh sách người dùng thất bại');
    }
  }

  async getUserById(id: string): Promise<User> {
    try {
      const response = await api.get(`${this.baseUrl}/${id}`);
      return response.data.data;
    } catch (error: any) {
      throw this.handleError(error, 'Không tìm thấy người dùng');
    }
  }

  async createUser(userData: UserCreateData): Promise<User> {
    try {
      const response = await api.post(this.baseUrl, userData);
      return response.data.data;
    } catch (error: any) {
      throw this.handleError(error, 'Tạo người dùng thất bại');
    }
  }

  async updateUser(id: string, userData: UserUpdateData): Promise<User> {
    try {
      const response = await api.put(`${this.baseUrl}/${id}`, userData);
      return response.data.data;
    } catch (error: any) {
      throw this.handleError(error, 'Cập nhật người dùng thất bại');
    }
  }

  async deleteUser(id: string): Promise<void> {
    try {
      await api.delete(`${this.baseUrl}/${id}`);
    } catch (error: any) {
      throw this.handleError(error, 'Xóa người dùng thất bại');
    }
  }

  async activateUser(id: string): Promise<void> {
    try {
      await api.put(`${this.baseUrl}/${id}/activate`);
    } catch (error: any) {
      throw this.handleError(error, 'Kích hoạt người dùng thất bại');
    }
  }

  async deactivateUser(id: string): Promise<void> {
    try {
      await api.put(`${this.baseUrl}/${id}/deactivate`);
    } catch (error: any) {
      throw this.handleError(error, 'Vô hiệu hóa người dùng thất bại');
    }
  }

  async searchByEmail(email: string): Promise<User | null> {
    try {
      const response = await api.get(`${this.baseUrl}/search/by-email`, {
        params: { email },
      });
      return response.data;
    } catch (error: any) {
      throw this.handleError(error, 'Tìm người dùng theo email thất bại');
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
          return new Error(data.message || 'Không tìm thấy người dùng');
        case 409:
          return new Error(data.message || 'Người dùng đã tồn tại');
        case 500:
          return new Error('Lỗi hệ thống. Vui lòng thử lại sau');
        default:
          return new Error(data.message || defaultMessage);
      }
    }
    return new Error(defaultMessage);
  }
}

export const userService = new UserService();
