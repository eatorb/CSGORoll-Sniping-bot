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


import {Prisma, PrismaClient, user} from "@prisma/client";

export class UserRepository {

    private prisma: PrismaClient;
    constructor() {
        this.prisma = new PrismaClient();
    }

    async createUser(email: string, hashedPassword: string): Promise<number> {
        try {
            const user: user = await this.prisma.user.create({
                data: {
                    email: email,
                    password: hashedPassword
                }
            });
            return user.UserID;

        } catch (error) {

            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2002')
                    throw new Error('This email is already registered.');
            }

            throw new Error('Error creating user.');
        }
    }

    async findByEmail(email: string): Promise<user | null> {
        try {
            return await this.prisma.user.findFirst({
                where: {
                    email: email
                }
            });

        } catch (error) {
            throw new Error('Error while finding user.');
        }
    }

    async updateRefreshToken(refreshToken: string, userId: number): Promise<void> {
        try {
            await this.prisma.user.update({
                where: {
                    UserID: userId
                },
                data: {
                    refreshToken: refreshToken
                }
            });

        } catch(error) {
            throw new Error('Error while updating refresh token.');
        }
    }

    async findRefreshToken(refreshToken: string): Promise<user | null> {
        try {
            return await this.prisma.user.findFirst({
                where: {
                    refreshToken: refreshToken
                },
            });

        } catch (error) {
            throw new Error('Error while finding refresh token.');
        }
    }

    async deleteRefreshToken(refreshToken: string): Promise<void> {
        try {
            await this.prisma.user.updateMany({
                where: {
                    refreshToken: refreshToken
                },
                data: {
                    refreshToken: null
                }
            });

        } catch (error) {
            throw new Error('Error while deleting refresh token.');
        }

    }

}