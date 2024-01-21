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


import {UserRepository} from "../repository/User.Repository";
import {user} from "@prisma/client";

export class TokenService {

    private userRepository: UserRepository;
    constructor() {
        this.userRepository = new UserRepository();
    }

    async validateToken(apiToken: string): Promise<boolean> {
        try {
            const user: user | null = await this.userRepository.findUserByAPIToken(apiToken);

            return user !== null;

        } catch (error) {
            return false;
        }
    }
}