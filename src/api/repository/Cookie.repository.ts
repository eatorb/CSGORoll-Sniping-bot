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


import {cookies, PrismaClient} from "@prisma/client";

export class CookieRepository {

    private prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    async insertCookie(encryptedCookie: string, userId: number): Promise<void> {
        try {

            await this.prisma.cookies.create({
                data: {
                    userId: userId,
                    cookie: encryptedCookie
                }
            });

        } catch (error) {
            throw new Error('Error occurred while inserting the cookie');
        }
    }

    async getUserCookie(userId: number): Promise<cookies | null> {
        try {
            return await this.prisma.cookies.findFirst({
                where: {
                    userId: userId
                }
            })
        } catch (error) {
            throw new Error('Error occurred while getting users cookie.');
        }
    }

}