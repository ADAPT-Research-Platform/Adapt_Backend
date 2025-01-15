import type { UserType } from '../../enums/enum';

export interface UsersCreateBody {
    username: string;
    email: string;
    password: string;
}

// Interface for the response body of the get user by admin
export interface UsersGetResponse {
    id: number;
    username: string;
    email: string;
    role: UserType;
    isVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
    isActive: boolean;
}