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


import * as crypto from "crypto";
export class EncryptionService {

    private algorithm: string =  'aes-256-cbc';
    private readonly secretKey: Buffer;
    private readonly iv: Buffer;

    constructor(secretKey: string) {
        this.secretKey = Buffer.from(secretKey, 'hex');
        this.iv = crypto.randomBytes(16);
    }
    encrypt(text: string): string {
        const cipher: crypto.Cipher = crypto.createCipheriv(this.algorithm, this.secretKey, this.iv);
        const encrypted: Buffer = Buffer.concat([cipher.update(text), cipher.final()]);
        return `${this.iv.toString('hex')}:${encrypted.toString('hex')}`;
    }

    decrypt(text: string): string {
        const textParts = text.split(':');
        const iv = Buffer.from(textParts.shift()!, 'hex');
        const encryptedText = Buffer.from(textParts.join(':'), 'hex');
        const decipher = crypto.createDecipheriv(this.algorithm, this.secretKey, iv);
        const decrypted = Buffer.concat([decipher.update(encryptedText), decipher.final()]);
        return decrypted.toString();
    }
}