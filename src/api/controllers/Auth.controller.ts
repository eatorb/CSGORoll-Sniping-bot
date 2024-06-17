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


import {ErrorResponse} from "../handlers/ErrorHandler";
import {ErrorMessage} from "../models/enums/ErrorMessage";
import {ErrorCode} from "../models/enums/ErrorCode";
import {UserService} from "../services/User.service";
import {Request, Response} from "express";
import {IUser} from "../models/interfaces/IUser";
import {accessTokenCookie, refreshTokenCookie} from "../config/Config";

export default {
    async registerUser(request: Request, response: Response): Promise<Response | undefined> {
        try {
            const {email, password, termsAccepted, recaptchaToken} = request.body as Partial<IUser & { recaptchaToken: string }>;

            if (!email || !password || termsAccepted === undefined || !recaptchaToken)
                return new ErrorResponse(response, ErrorMessage.requestIncomplete, 400, ErrorCode.requestIncomplete, new Date()).sendAll();

            const userService: UserService = new UserService();

            const {accessToken, refreshToken} = await userService.registerUser(email, password, termsAccepted, recaptchaToken);

            // send both access token and refresh token in cookies
            response.cookie('refreshToken', refreshToken, refreshTokenCookie);
            response.cookie('accessToken', accessToken, accessTokenCookie);

            return response.status(200).send({
                success: "You have successfully registered.",
            });

        } catch (error) {
            if (error instanceof Error) {
                return new ErrorResponse(response, error.message, 500, ErrorCode.serverError, new Date())
                    .sendAll();
            } else {
                return new ErrorResponse(response, ErrorMessage.unknownServerError, 500, ErrorCode.serverError, new Date())
                    .sendAll();
            }
        }
    },

    async userLogin(request: Request, response: Response): Promise<Response | undefined> {
        try {
            const {email, password, remember, recaptchaToken} = request.body as Partial<IUser & { recaptchaToken: string }>;

            if (!email || !password || remember === undefined || !recaptchaToken)
                return new ErrorResponse(response, ErrorMessage.requestIncomplete, 400, ErrorCode.requestIncomplete, new Date()).sendAll();

            const userService: UserService = new UserService();

            const {accessToken, refreshToken} = await userService.loginUser(email, password, remember, recaptchaToken);

            // send both access token and refresh token in cookies
            response.cookie('refreshToken', refreshToken, refreshTokenCookie);
            response.cookie('accessToken', accessToken, accessTokenCookie);

            return response.status(200).send({
                success: "You have successfully logged in.",
            });

        } catch(error) {
            if (error instanceof Error) {
                return new ErrorResponse(response, error.message, 500, ErrorCode.serverError, new Date())
                    .sendAll();
            } else {
                return new ErrorResponse(response, ErrorMessage.unknownServerError, 500, ErrorCode.serverError, new Date())
                    .sendAll();
            }
        }
    },

    async forgotPassword(request: Request, response: Response): Promise<Response | undefined> {

        return response;
    },

    async verifyEmail(request: Request, response: Response): Promise<Response | undefined> {

        return response;
    },

    async logout(request: Request, response: Response): Promise<Response | undefined> {
        try {
            const {refreshToken} = request.body;

            const userService: UserService = new UserService();

            await userService.logoutUser(refreshToken);

            return response.status(200).send({
                success: 'Successfully logged out.'
            });

        } catch (error) {
            if (error instanceof Error) {
                return new ErrorResponse(response, error.message, 500, ErrorCode.serverError, new Date())
                    .sendAll();
            } else {
                return new ErrorResponse(response, ErrorMessage.unknownServerError, 500, ErrorCode.serverError, new Date())
                    .sendAll();
            }
        }

    },

    async refreshToken(request: Request, response: Response): Promise<Response | undefined> {
        try {
            const {refreshToken} = request.body;

            if (!refreshToken)
                return new ErrorResponse(response, ErrorMessage.requestIncomplete, 400, ErrorCode.requestIncomplete, new Date()).sendAll();

            const userService: UserService = new UserService();

            const {accessToken} = await userService.refreshToken(refreshToken);

            response.cookie('accessToken', accessToken, accessTokenCookie);

            return response.status(200).send({
                success: "Successfully refreshed access token.",
            });

        } catch (error) {
            if (error instanceof Error) {
                return new ErrorResponse(response, error.message, 500, ErrorCode.serverError, new Date())
                    .sendAll();
            } else {
                return new ErrorResponse(response, ErrorMessage.unknownServerError, 500, ErrorCode.serverError, new Date())
                    .sendAll();
            }
        }
    },
}