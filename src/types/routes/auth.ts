export interface AuthLoginBody {
    login: string;
    password: string;
}

export interface AuthLoginResponse {
    id: number;
    username: string;
    email: string;
}