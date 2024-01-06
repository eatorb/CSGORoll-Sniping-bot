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
            const {email, password, termsAccepted} = request.body as Partial<IUser>;

            if (!email || !password || termsAccepted === undefined)
                return new ErrorResponse(response, ErrorMessage.requestIncomplete, 400, ErrorCode.requestIncomplete, new Date()).sendAll();

            const userService: UserService = new UserService();

            const {accessToken, refreshToken} = await userService.registerUser(email, password, termsAccepted);

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
            const {email, password, remember} = request.body as Partial<IUser>;

            if (!email || !password || remember === undefined)
                return new ErrorResponse(response, ErrorMessage.requestIncomplete, 400, ErrorCode.requestIncomplete, new Date()).sendAll();

            const userService: UserService = new UserService();

            const {accessToken, refreshToken} = await userService.loginUser(email, password, remember);

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

    async changePassword(request: Request, response: Response): Promise<Response | undefined> {

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