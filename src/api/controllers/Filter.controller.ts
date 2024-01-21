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
import {IFilter} from "../models/interfaces/IFilter";
import {ErrorResponse} from "../handlers/ErrorHandler";
import {ErrorMessage} from "../models/enums/ErrorMessage";
import {ErrorCode} from "../models/enums/ErrorCode";
import {FilterService} from "../services/Filter.service";

export default {

    async getFilter(request: Request, response: Response): Promise<Response | undefined> {

        return response;
    },

    async createFilter(request: Request, response: Response): Promise<Response | undefined> {

        try {

            const userId: number | undefined = request.user?.userId;

            if (!userId)
                return new ErrorResponse(response, ErrorMessage.unauthorized, 401, ErrorCode.unauthorized, new Date()).sendAll();

            const {minPrice, maxPrice,
                maxMarkupPercentage, excludeSticker,
                excludePin, excludeMusicKit, excludeSouvenir,
                excludeStatTrak, excludeCases, excludeAgents} = request.body as Partial<IFilter>;

            if (!minPrice || !maxPrice || !maxMarkupPercentage || excludeSticker === undefined || excludePin === undefined
                || excludeMusicKit === undefined || excludeSouvenir === undefined
                || excludeStatTrak === undefined || excludeCases === undefined || excludeAgents === undefined)
                    return new ErrorResponse(response, ErrorMessage.requestIncomplete, 400, ErrorCode.requestIncomplete, new Date()).sendAll();


            const filterService: FilterService = new FilterService();

            await filterService.createFilter(userId, minPrice, maxPrice, maxMarkupPercentage, excludeSticker, excludePin, excludeMusicKit, excludeSouvenir, excludeStatTrak, excludeCases, excludeAgents);

            return response.status(200).send({
                success: "Successfully created a filter."
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

    async deleteFilter(request: Request, response: Response): Promise<Response | undefined> {

        try {

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

    async updateFilter(request: Request, response: Response): Promise<Response | undefined> {
        return response;
    }

}