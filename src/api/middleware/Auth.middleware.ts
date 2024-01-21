/*
 * Copyright (c) 2024 Šimon Sedlák snipeit.io All rights reserved.
 *
 * Licensed under the GNU GENERAL PUBLIC LICENSE Version 3, 29 June 2007 (the "License");
 * You may not use this file except in compliance with the License.
 *
 * You may obtain a copy of the License at
 * https://www.gnu.org/licenses/gpl-3.0.html
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 */


import {NextFunction, Request, Response} from "express";
import {ErrorMessage} from "../models/enums/ErrorMessage";
import {ErrorCode} from "../models/enums/ErrorCode";
import {ErrorResponse} from "../handlers/ErrorHandler";
import jwt from 'jsonwebtoken';
import {jwtSecret} from "../config/Config";
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