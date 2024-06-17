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


import {PrismaClient} from "@prisma/client";
import {IError} from "../models/interfaces/IError";
class ErrorRepository {

    private prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    async insertError(error: IError): Promise<void> {
        try {

            await this.prisma.errorlogs.create({
                data: {
                    errorCode: error.errorCode,
                    errorMessage: error.errorMessage,
                    timestamp: error.timeStamp,
                    status: error.status
                }
            })

        } catch (error) {
            throw new Error('Error occurred while inserting an error.');
        }
    }
}

export { ErrorRepository }