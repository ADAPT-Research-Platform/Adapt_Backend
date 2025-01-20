import type { UserType } from '../../enums/enum';

export interface AuthLoginBody {
    login: string;
    password: string;
}

export interface AuthLoginResponse {
    id: number;
    username: string;
    email: string;
    isActive: boolean;
    role: UserType.ADMIN | UserType.CLIENT;
}