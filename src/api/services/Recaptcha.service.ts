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