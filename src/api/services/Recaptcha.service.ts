import {recaptchaSecretKey} from "../config/Config";
import axios, {AxiosInstance} from "axios";
export class RecaptchaService {

    private readonly secretKey: string;
    private httpClient: AxiosInstance;

    constructor() {
        this.secretKey = recaptchaSecretKey;

        this.httpClient = axios.create({
            baseURL: 'https://www.google.com/recaptcha/api/'
        });
    }

    async verifyRecaptchaToken(token: string, expectedAction: string): Promise<boolean> {

        try {

            const response= await this.httpClient.post('siteverify', null, {
                params: {
                    secret: this.secretKey,
                    response: token
                }
            });

            const isSuccessful = response.data.success;
            const isActionMatch: boolean = response.data.action === expectedAction;
            return isSuccessful && isActionMatch;

        } catch (error) {
            return false;
        }

    }
}