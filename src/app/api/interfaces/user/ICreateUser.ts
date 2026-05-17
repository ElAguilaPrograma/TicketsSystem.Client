export interface ICreateUser {
    fullName: string;
    profilePic: File | null;
    email: string;
    role: string;
    isActive: boolean;
    password: string;
}