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


import axios, {AxiosInstance, AxiosResponse} from "axios";
import {ICreateTaskPayload} from "../models/interfaces/ICreateTaskPayload";
import {ICreateTaskResponse} from "../models/interfaces/ICreateTaskResponse";
import {IGetTaskResultPayload} from "../models/interfaces/IGetTaskResultPayload";
import {IGetTaskResultResponse} from "../models/interfaces/IGetTaskResultResponse";

export class CaptchaSolvingService {

    private readonly apiKey: string = 'CAP-8B4136B87934FBD05D8A6EF0C77E2E6C';
    private httpClient: AxiosInstance;

    constructor() {
        this.httpClient = axios.create({
            baseURL: 'https://api.capsolver.com'
        })
    }

    async createTask(): Promise<string | null> {
        const url: string = '/createTask';

        const data: ICreateTaskPayload = {
            clientKey: this.apiKey,
            task: {
                type: "ReCaptchaV3M1TaskProxyLess",
                websiteURL: "https://api.csgoroll.com",
                websiteKey: "6LfVf3wUAAAAAL8T79ziKWF-Jmkc3LT9fzEVoiO5",
                pageAction: "joinTrades",
            }
        }

        try {
            const response: AxiosResponse<ICreateTaskResponse> = await this.httpClient.post<ICreateTaskResponse>(url, data);

            return response.data.taskId;

        } catch (error) {
            console.log("Error while creating a task:", error);
            return null;
        }
    }

    async getTaskResult(taskId: string): Promise<string> {
        const url: string = '/getTaskResult';

        const data: IGetTaskResultPayload = {
            clientKey: this.apiKey,
            taskId: taskId
        }

        try {
            const response: AxiosResponse<IGetTaskResultResponse> = await this.httpClient.post<IGetTaskResultResponse>(url, data);

            if (!response.data.solution?.gRecaptchaResponse)
                throw new Error('gRecaptchaResponse hasnt been found');

            return response.data.solution?.gRecaptchaResponse;

        } catch {
            throw new Error('Error while getting task result');
        }
    }
}