export interface IUpdateUser {
    fullName: string;
    email: string;
    password: string;
    confirmPassword: string;
    role: string;
    isActive: boolean;
}