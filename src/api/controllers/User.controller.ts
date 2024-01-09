import {Request, Response} from "express";
import {CookieService} from "../services/Cookie.service";

export default {

    async saveUserCookie(request: Request, response: Response): Promise<Response | undefined> {
        const cookie: string = request.params.cookie;

        const userId: number | undefined = request.user?.userId;

        const cookieService: CookieService = new CookieService();

        await cookieService.saveUserCookie(cookie, userId);

        return response.status(200).send({
            success: "Successfully saved user cookie."
        });
    },

    async changePassword(request: Request, response: Response): Promise<Response | undefined> {

        return response;
    },
}