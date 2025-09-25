export interface AuthRequest {
    email: string;
    password: string;
}

export interface AuthResponse {
    token: string;
}

export interface Whoami {
    _id: string;
    email: string;
}
