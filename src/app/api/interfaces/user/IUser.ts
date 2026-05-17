export interface IUser {
    userId: string,
    fullName: string,
    email: string,
    role: string,
    isActive: boolean,
    profilePicUrl?: string,
    profilePicPath?: string,
    createdAt: Date
}