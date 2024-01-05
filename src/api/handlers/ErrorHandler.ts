import {Response} from "express";
import {ErrorCode} from "../models/enums/ErrorCode";
import {ErrorRepository} from "../repository/Error.Repository";
import {IError} from "../models/interfaces/IError";

export class ErrorResponse implements IError {
    response: Response;
    errorMessage: string;
    status: number;
    errorCode: ErrorCode;
    timeStamp: Date;

    constructor(response: Response, errorMessage: string, status: number, errorCode: ErrorCode, timeStamp: Date) {
        this.response = response;
        this.errorMessage = errorMessage;
        this.status = status;
        this.errorCode = errorCode;
        this.timeStamp = timeStamp;
    }

    async sendAll(): Promise<Response>{
        await this.sendMySQL();
        return this.sendResponse();
    }

    sendResponse(): Response {
        return this.response.status(this.status).send({
            error: {
                message: this.errorMessage,
                status: this.status,
                errorCode: this.errorCode,
                time: this.timeStamp
            }
        });
    }

    sendMySQL(): Promise<void> {
        let repository: ErrorRepository = new ErrorRepository();
        return repository.insertError(this);
    }
}