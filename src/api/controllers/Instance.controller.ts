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
import {ErrorResponse} from "../handlers/ErrorHandler";
import {ErrorCode} from "../models/enums/ErrorCode";
import {ErrorMessage} from "../models/enums/ErrorMessage";
import {InstanceService} from "../services/Instance.service";
import {instance} from "@prisma/client";

export default {

    async createInstance(request: Request, response: Response): Promise<Response | undefined> {
        try {

            const userId: number | undefined = request.user?.userId;

            const instanceService: InstanceService = new InstanceService();

            await instanceService.createInstance(userId);

            return response.send({
                status: "Instance has been created."
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

    async listInstance(request: Request, response: Response): Promise<Response | undefined> {

        const userId: number | undefined = request.user?.userId;

        const instanceService: InstanceService = new InstanceService();

        const instance: instance | null = await instanceService.listInstance(userId);

        return response.send({
            success: "Listed active instances.",
            instance
        });
    },

    async deleteInstance(request: Request, response: Response): Promise<Response | undefined> {
        try {

            const userId: number | undefined = request.user?.userId;

            const instanceService: InstanceService = new InstanceService();

            await instanceService.deleteInstance(userId);

            return response.send({
                status: "Instance has been deleted."
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

    async startInstance(request: Request, response: Response): Promise<Response | undefined>{
        try {

            const userId: number | undefined = request.user?.userId;

            const instanceService: InstanceService = new InstanceService();

            await instanceService.startInstance(userId);

            return response.send({
                status: "Instance has been started."
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

    async stopInstance(request: Request, response: Response): Promise<Response | undefined> {
        try {

            const userId: number | undefined = request.user?.userId;

            const instanceService: InstanceService = new InstanceService();

            await instanceService.stopInstance(userId);

            return response.send({
                status: "Instance has been stoppped."
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
    }

}