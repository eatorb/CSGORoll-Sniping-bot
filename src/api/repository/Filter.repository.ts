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


import {filter, PrismaClient} from "@prisma/client";

export class FilterRepository {

    private prisma: PrismaClient;
    constructor() {
        this.prisma = new PrismaClient();
    }

    async insertFilter(userId: number, minPrice: number, maxPrice: number, maxMarkupPercentage: number,
                       excludeSticker: number, excludePin: number, excludeMusicKit: number,
                       excludeSouvenir: number, excludeStatTrak: number, excludeCases: number, excludeAgents: number): Promise<void> {
        try {

            await this.prisma.filter.create({
                data: {
                    userId: userId,
                    minPrice: minPrice,
                    maxPrice: maxPrice,
                    maxMarkupPercentage: maxMarkupPercentage,
                    excludeSticker: excludeSticker,
                    excludePin: excludePin,
                    excludeMusicKit: excludeMusicKit,
                    excludeSouvenir: excludeSouvenir,
                    excludeStatTrak: excludeStatTrak,
                    excludeCases: excludeCases,
                    excludeAgents: excludeAgents
                }
            })

        } catch (error) {
            throw new Error('Error while inserting a filter.');
        }
    }

    async findFilter(userId: number): Promise<filter | null> {
        try {
            return await this.prisma.filter.findFirst({
                where: {
                    userId: userId
                }
            });
        } catch (error) {
            throw new Error('Error while trying to find a filter.')
        }
    }
}