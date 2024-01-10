export interface IGetTaskResultResponse {
    errorId: number;
    errorCode: string | null;
    errorDescription: string | null;
    solution?: {
        userAgent: string;
        expireTime: number;
        gRecaptchaResponse: string;
    }
}