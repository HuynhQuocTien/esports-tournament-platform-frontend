export interface User {
  id: string;
  fullname: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: {
    id: string;
    name: 'ADMIN' | 'ORGANIZER' | 'TEAM_MANAGER';
    description: string;
  };
  isActive: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserCreateData {
  name: string;
  email: string;
  password?: string;
  role: string;
  phone?: string;
  avatarUrl?: string;
}

export interface UserUpdateData {
  name?: string;
  email?: string;
  password?: string;
  role?: string;
  phone?: string;
  avatarUrl?: string;
}

export interface UsersResponse {
  users: User[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}