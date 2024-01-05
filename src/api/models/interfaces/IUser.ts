export interface IUser {
    userId?: number;
    email: string;
    password: string;
    createdAt?: Date;
    remember?: boolean;
    termsAccepted?: boolean;
    refreshToken?: string;
}