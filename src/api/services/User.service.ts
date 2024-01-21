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


import {UserRepository} from "../repository/User.repository";
import {jwtRefreshSecret, jwtSecret} from "../config/Config";
import bcrypt from 'bcrypt';
import jwt, {JwtPayload} from "jsonwebtoken";
import {PasswordValidationService} from "./PasswordValidation.service";
import {user} from "@prisma/client";
import {RecaptchaService} from "./Recaptcha.service";

export class UserService {

    private userRepository: UserRepository;
    private recaptchaService: RecaptchaService;

    constructor() {
        this.userRepository = new UserRepository();
        this.recaptchaService = new RecaptchaService();
    }

    async registerUser(email: string, password: string, termsAccepted: boolean, recaptchaToken: string): Promise<{accessToken: string, refreshToken: string}> {
        if (!termsAccepted)
            throw new Error('You have to accept our terms of service.');

        const isRecaptchaValid: boolean = await this.recaptchaService.verifyRecaptchaToken(recaptchaToken, 'register');

        if (!isRecaptchaValid)
            throw new Error('Failed to solve a recaptcha.');

        PasswordValidationService.validate(password);

        const hashedPassword: string = await bcrypt.hash(password, 10);

        const userId: number = await this.userRepository.createUser(email, hashedPassword);

        const refreshToken: string = this.generateRefreshToken(userId);

        await this.userRepository.updateRefreshToken(refreshToken, userId);

        const accessToken: string = jwt.sign({ userId: userId }, jwtSecret, { expiresIn: '15m' });

        return {accessToken, refreshToken};
    }

    async loginUser(email: string, password: string, remember: boolean, recaptchaToken: string): Promise<{accessToken: string, refreshToken: string}> {

        const isRecaptchaValid: boolean = await this.recaptchaService.verifyRecaptchaToken(recaptchaToken, 'login');

        if (!isRecaptchaValid)
            throw new Error('Failed to solve a recaptcha.');

        const user: user | null = await this.userRepository.findByEmail(email);

        if (!user || !(await bcrypt.compare(password, user.password)))
            throw new Error('Invalid credentials');

        const refreshToken: string = this.generateRefreshToken(user.UserID);

        await this.userRepository.updateRefreshToken(refreshToken, user.UserID);

        const expiresIn: string = remember ? '1d' : '15m';

        const accessToken: string = jwt.sign({ userId: user.UserID }, jwtSecret, { expiresIn });

        return {accessToken, refreshToken};
    }

    async refreshToken(refreshToken: string): Promise<{accessToken: string}> {

        const user: user | null = await this.userRepository.findRefreshToken(refreshToken);

        if (!user)
            throw new Error('User not found. Please log in again.');

        try {
            const decoded: jwt.JwtPayload = jwt.verify(refreshToken, jwtRefreshSecret) as JwtPayload;

            if (!decoded.userId)
                throw new Error('Invalid token payload.');

            const accessToken: string = jwt.sign({ userId: decoded.userId }, jwtSecret, { expiresIn: '15m' });

            return {accessToken};

        } catch (error) {
            throw new Error('Invalid refresh token. Please log in again.')
        }
    }

    async logoutUser(refreshToken: string): Promise<void> {
        await this.userRepository.deleteRefreshToken(refreshToken);
    }

    private generateRefreshToken(userId: number): string {
        return jwt.sign({ userId: userId }, jwtRefreshSecret, {expiresIn: '30d'});
    }
}