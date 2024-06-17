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


if (!process.env.ENC_SECRET_KEY)
    throw new Error('ENC_SECRET_KEY is not defined in environment variables!');

if (!process.env.JWT_SECRET)
    throw new Error('JWT_SECRET is not defined in environment variables!');

if (!process.env.JWT_REFRESH_SECRET)
    throw new Error('JWT_REFRESH_SECRET is not defined in environment variables!');

if (!process.env.RECAPTCHA_SECRET)
    throw new Error('RECAPTCHA_SECRET is not defined in environment variables!');

export const encryptionSecret: string = process.env.ENC_SECRET_KEY;
export const jwtSecret: string = process.env.JWT_SECRET;
export const jwtRefreshSecret: string = process.env.JWT_REFRESH_SECRET;
export const recaptchaSecretKey: string = process.env.RECAPTCHA_SECRET;

export const refreshTokenCookie: Object = {
    httpOnly: true,
    secure: false,
    maxAge: 30 * 24 * 60 * 60 * 1000,
    sameSite: 'strict'
}

export const accessTokenCookie: Object = {
    httpOnly: true,
    secure: false,
    maxAge: 900000,
    sameSite: 'strict'
}

export default {
    encryptionSecret, jwtSecret, jwtRefreshSecret, refreshTokenCookie, recaptchaSecretKey
}