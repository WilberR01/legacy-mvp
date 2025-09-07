export interface LoginCredentials {
    email: string;
    password: string;
}

export interface User {
    name: string;
    email: string;
    password: string;
}

export interface LoginResponse {
    message: string;
    user: {
        userId: number;
        name: string;
        email: string;
        token: string;
    }
}