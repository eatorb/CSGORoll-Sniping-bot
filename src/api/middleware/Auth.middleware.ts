import {NextFunction, Request, Response} from "express";
import {ErrorMessage} from "../models/enums/ErrorMessage";
import {ErrorCode} from "../models/enums/ErrorCode";
import {ErrorResponse} from "../handlers/ErrorHandler";
import jwt from 'jsonwebtoken';
import {jwtSecret} from "../../shared/config/Config";
import {IJWTPayload} from "../models/interfaces/IJWTPayload";

declare global {
    namespace Express {
        interface Request {
            user?: IJWTPayload;
        }
    }
}
export const AuthMiddleware = (requiredKeyid?: string) => async (request: Request, response: Response, next: NextFunction): Promise<Response | undefined> => {

    const bearer: string | undefined = request.headers.authorization?.split(' ')[1];

    if (!bearer) return new ErrorResponse(response, ErrorMessage.unauthorized, 403, ErrorCode.unauthorized, new Date()).sendAll();

    try {
        const decoded: IJWTPayload = jwt.verify(bearer, jwtSecret) as IJWTPayload;

        if (requiredKeyid && decoded.keyid !== requiredKeyid)
            return new ErrorResponse(response, ErrorMessage.unauthorized, 403, ErrorCode.unauthorized, new Date()).sendAll();

        request.user = decoded;

        next();

    } catch (error) {
        return new ErrorResponse(response, ErrorMessage.unauthorized, 403, ErrorCode.unauthorized, new Date()).sendAll();
    }
}