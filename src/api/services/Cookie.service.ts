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


import {CookieRepository} from "../repository/Cookie.repository";
import {EncryptionService} from "./Encryption.service";
import {encryptionSecret} from "../config/Config";

export class CookieService {

    private cookieRepository: CookieRepository;
    private encryptionService: EncryptionService;
    private readonly encryptionSecret: string = encryptionSecret;

    constructor() {
        this.cookieRepository = new CookieRepository();

        this.encryptionService = new EncryptionService(this.encryptionSecret);
    }

    public async saveUserCookie(cookie: string, userId?: number): Promise<void> {
        if (!cookie)
            throw new Error('Cookie has not been provided.');

        if (!userId)
            throw new Error('User not found. Please log in again.');

        const encryptedCookie: string = this.encryptionService.encrypt(cookie);

        await this.cookieRepository.insertCookie(encryptedCookie, userId);
    }
}