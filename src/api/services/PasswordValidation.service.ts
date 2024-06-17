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


export class PasswordValidationService {
    static validate(password: string): void {
        if (password.length < 9) {
            throw new Error('Invalid password lenght.');
        }

        if (!/\d/.test(password)) {
            throw new Error('Password has to contain at least one number.');
        }

        if (!/[A-Z]/.test(password)) {
            throw new Error('Password has to contain one uppercase letter.');
        }

        if (!/\W/.test(password)) {
            throw new Error('Password has to contain one special character.');
        }
    }
}