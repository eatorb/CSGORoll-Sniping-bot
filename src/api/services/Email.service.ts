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


import nodemailer from 'nodemailer';
import {IEmail} from "../models/interfaces/IEmail";
export class EmailService {

    private transporter: nodemailer.Transporter;
    private sender: string = 'noreply@snipeit.io';
    private recipient: string;

    constructor(recipient: string) {
        this.transporter = nodemailer.createTransport();
        this.recipient = recipient;
    }

    async sendRegisterVerify() {

    }

    async send2faVerify() {

    }

    async sendPasswordReset() {

    }

    private getEmailConfig(): IEmail{
        return {
            from: 'lol',
            subject: 'lol',
            to: 'lol',
            html: 'lel',
            headers: {
                'Content-Type': 'text/html',
            }
        }
    }


    async sendEmail(): Promise<void> {
        return new Promise((resolve, reject): void => {
            this.transporter.sendMail(this.getEmailConfig(), (error: Error | null): void => {
                if (error)
                    reject(new Error('An error occurred while sending an email.'));

                resolve();
            })
        });
    }
}