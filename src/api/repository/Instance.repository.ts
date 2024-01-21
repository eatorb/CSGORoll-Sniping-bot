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


import {instance, PrismaClient} from "@prisma/client";

export class InstanceRepository {

    private prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    async insertInstance(userId: number, containerId: string, status: string): Promise<void> {
        try {
            await this.prisma.instance.create({
                data: {
                    userId: userId,
                    containerId: containerId,
                    status: status
                }
            });
        } catch (error) {
            throw new Error('Error while creating a new instance.');
        }
    }

    async getUserInstance(userId: number): Promise<instance | null> {
        try {
            return await this.prisma.instance.findFirst({
                where: {
                    userId: userId
                }
            });
        } catch (error) {
            throw new Error('Error while finding an instance.');
        }

    }

    async deleteInstance(userId: number, containerId: string): Promise<void> {
        try {
            await this.prisma.instance.deleteMany({
                where: {
                    AND: [
                        { userId: userId },
                        { containerId: containerId }
                    ]
                }
            })

        } catch (error) {
            throw new Error('Error while deleting an instance.');
        }
    }
}