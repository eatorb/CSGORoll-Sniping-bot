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