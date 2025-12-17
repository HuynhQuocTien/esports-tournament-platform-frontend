import api from './api';
import type {
  CreateNotificationData,
  PaginatedResponse,
  Notification,
  User,
  NotificationStats,
} from '@/common/types/notification';

export class NotificationService {
  private baseUrl = '/notifications';

  async getNotifications(
    params?: any
  ): Promise<PaginatedResponse<Notification>> {
    try {
      const response = await api.get(this.baseUrl, { params });
      return response.data;
    } catch (error: any) {
      throw this.handleError(error, 'Lấy danh sách thông báo thất bại');
    }
  }

  async getNotification(id: string): Promise<Notification> {
    try {
      const response = await api.get(`${this.baseUrl}/${id}`);
      return response.data;
    } catch (error: any) {
      throw this.handleError(error, 'Không tìm thấy thông báo');
    }
  }

  async createNotification(
    data: CreateNotificationData
  ): Promise<Notification> {
    try {
      const response = await api.post(this.baseUrl, data);
      return response.data;
    } catch (error: any) {
      throw this.handleError(error, 'Tạo thông báo thất bại');
    }
  }

  async scheduleNotification(
    data: CreateNotificationData
  ): Promise<Notification> {
    try {
      const response = await api.post(
        `${this.baseUrl}/schedule`,
        data
      );
      return response.data;
    } catch (error: any) {
      throw this.handleError(error, 'Lên lịch thông báo thất bại');
    }
  }

  async markAsRead(id: string): Promise<void> {
    try {
      await api.patch(`${this.baseUrl}/${id}/read`);
    } catch (error: any) {
      throw this.handleError(error, 'Đánh dấu đã đọc thất bại');
    }
  }

  async markAllAsRead(): Promise<void> {
    try {
      await api.patch(`${this.baseUrl}/read-all`);
    } catch (error: any) {
      throw this.handleError(error, 'Đánh dấu tất cả đã đọc thất bại');
    }
  }

  async bulkMarkAsRead(ids: string[]): Promise<void> {
    try {
      await api.patch(`${this.baseUrl}/bulk/read`, { ids });
    } catch (error: any) {
      throw this.handleError(error, 'Đánh dấu nhiều thông báo thất bại');
    }
  }

  async deleteNotification(id: string): Promise<void> {
    try {
      await api.delete(`${this.baseUrl}/${id}`);
    } catch (error: any) {
      throw this.handleError(error, 'Xóa thông báo thất bại');
    }
  }

  async bulkDeleteNotifications(ids: string[]): Promise<void> {
    try {
      await api.delete(`${this.baseUrl}/bulk`, {
        data: { ids },
      });
    } catch (error: any) {
      throw this.handleError(error, 'Xóa nhiều thông báo thất bại');
    }
  }

  async getStats(): Promise<NotificationStats> {
    try {
      const response = await api.get(`${this.baseUrl}/stats`);
      return response.data;
    } catch (error: any) {
      throw this.handleError(error, 'Lấy thống kê thông báo thất bại');
    }
  }

  async getUnreadCount(): Promise<number> {
    try {
      const response = await api.get(
        `${this.baseUrl}/unread-count`
      );
      return response.data;
    } catch (error: any) {
      throw this.handleError(error, 'Lấy số thông báo chưa đọc thất bại');
    }
  }

  async resendNotification(id: string): Promise<void> {
    try {
      await api.post(`${this.baseUrl}/${id}/resend`);
    } catch (error: any) {
      throw this.handleError(error, 'Gửi lại thông báo thất bại');
    }
  }

  async sendTestNotification(): Promise<void> {
    try {
      await api.post(`${this.baseUrl}/test`);
    } catch (error: any) {
      throw this.handleError(error, 'Gửi thông báo test thất bại');
    }
  }

  async getUsers(): Promise<User[]> {
    try {
      const response = await api.get(`${this.baseUrl}/users`);
      return response.data;
    } catch (error: any) {
      throw this.handleError(error, 'Lấy danh sách người dùng thất bại');
    }
  }

  private handleError(error: any, defaultMessage: string): Error {
    if (error.response) {
      const { status, data } = error.response;

      switch (status) {
        case 400:
          return new Error(data.message || 'Dữ liệu không hợp lệ');
        case 401:
          return new Error('Bạn cần đăng nhập');
        case 403:
          return new Error('Bạn không có quyền thực hiện thao tác này');
        case 404:
          return new Error(data.message || 'Không tìm thấy thông báo');
        case 500:
          return new Error('Lỗi hệ thống. Vui lòng thử lại sau');
        default:
          return new Error(data.message || defaultMessage);
      }
    }
    return new Error(defaultMessage);
  }
}

export const notificationService = new NotificationService();