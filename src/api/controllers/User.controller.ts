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


import {Request, Response} from "express";
import {CookieService} from "../services/Cookie.service";

export default {

    async getUser(request: Request, response: Response): Promise<Response | undefined> {

        return response;
    },

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