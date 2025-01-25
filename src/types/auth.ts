import type { UserType } from '../enums/enum';

export interface AuthLoginBody {
    username: string;
    password: string;
}

export interface AuthLoginResponse {
    id: number;
    username: string;
    isActive: boolean;
    role: UserType.ADMIN | UserType.CLIENT;
}