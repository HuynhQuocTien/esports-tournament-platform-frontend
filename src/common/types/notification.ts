export type NotificationType = 'info' | 'warning' | 'success' | 'error' | 'system';

export const NotificationType = {
  INFO: 'info' as const,
  WARNING: 'warning' as const,
  SUCCESS: 'success' as const,
  ERROR: 'error' as const,
  SYSTEM: 'system' as const,
};

export interface User {
  id: string;
  email: string;
  fullname: string;
  avatar?: string;
  role?: {
    id: string;
    name: string;
  };
  isActive: boolean;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  isImportant: boolean;
  isScheduled: boolean;
  isSent: boolean;
  isExpired: boolean;
  sendToAll: boolean;
  scheduledAt?: string;
  expiresAt?: string;
  sentAt?: string;
  user?: User;
  recipients?: User[];
  createdAt: string;
  updatedAt?: string;
}

export interface CreateNotificationData {
  title: string;
  message: string;
  type?: NotificationType;
  isImportant?: boolean;
  sendToAll?: boolean;
  userIds?: string[];
  scheduledAt?: string;
  expiresAt?: string;
}

export interface PaginatedResponse<T> {
  notifications: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface NotificationStats {
  total: number;
  unread: number;
  important: number;
  scheduled: number;
  expired: number;
  sentToday: number;
}