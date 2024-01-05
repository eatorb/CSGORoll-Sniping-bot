import {ErrorCode} from "../enums/ErrorCode";
export interface IError {
    errorMessage: string;
    status: number;
    errorCode: ErrorCode;
    timeStamp: Date;
}
