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
                websiteURL: "https://www.csgoroll.com/en/withdraw/csgo/p2p",
                websiteKey: "6Le-wvkSAAAAAPBMRTvw0Q4Muexq9bi0DJwx_mJ-",
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