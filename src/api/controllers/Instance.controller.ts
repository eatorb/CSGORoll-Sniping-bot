import {Request, Response} from "express";
import {ErrorResponse} from "../handlers/ErrorHandler";
import {ErrorCode} from "../models/enums/ErrorCode";
import {ErrorMessage} from "../models/enums/ErrorMessage";
import {InstanceService} from "../services/Instance.service";
import {IInstance} from "../models/interfaces/IInstance";

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

        const instance: IInstance | null = await instanceService.listInstance(userId);

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