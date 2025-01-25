import type { UserType } from '../enums/enum';

export interface UsersCreateBody {
    username: string;
    password: string;
}

export interface UsersUpdateBody {
  userName?: string;
  currentPassword?: string;
  newPassword?: string;
}

export interface UsersDeleteBody {
  currentPassword: string;
}

// Interface for the response body of the get user by admin
export interface UsersGetResponse {
    id: number;
    username: string;
    role: UserType;
    createdAt: Date;
    updatedAt: Date;
    isActive: boolean;
}