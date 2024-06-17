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


import {FilterRepository} from "../repository/Filter.repository";
import {filter} from "@prisma/client";

export class FilterService {

    private filterRepository: FilterRepository;

    constructor() {
        this.filterRepository = new FilterRepository();
    }

    async createFilter(userId: number, minPrice: number, maxPrice: number, maxMarkupPercentage: number,
                       excludeSticker: boolean, excludePin: boolean, excludeMusicKit:  boolean,
                       excludeSouvenir: boolean, excludeStatTrak: boolean, excludeCases: boolean, excludeAgents: boolean): Promise<void> {


        await this.filterRepository.insertFilter(
            userId,
            minPrice,
            maxPrice,
            maxMarkupPercentage,
            excludeSticker ? 1 : 0,
            excludePin ? 1 : 0,
            excludeMusicKit ? 1 : 0,
            excludeSouvenir ? 1 : 0,
            excludeStatTrak ? 1 : 0,
            excludeCases ? 1 : 0,
            excludeAgents ? 1 : 0
        );


    }
    async updateFilter(): Promise<void> {

    }

    async deleteFilter(): Promise<void> {

    }
    async findFilter(userId: number): Promise<filter> {

        const filter: filter | null= await this.filterRepository.findFilter(userId);

        if (!filter)
            throw new Error('No filter has been found');

        return filter;
    }
}