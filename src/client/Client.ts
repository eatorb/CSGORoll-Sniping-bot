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


import Websocket from 'ws';
import {headers} from "./config/Headers";
import {HandleConnect} from "./events/HandleConnect";
import {HandleMessage} from "./events/HandleMessage";
import {HandleError} from "./events/HandleError";
import {EncryptionService} from "../api/services/Encryption.service";

export class Client {

    private socket!: Websocket;
    private socketEndpoint: string = 'wss://api.csgoroll.com/graphql';
    private readonly headers: Record<string, string>;
    private subProtocol: string[] = ['graphql-transport-ws'];
    private readonly encryptedUserCookies: string = "cookieyes-consent=consentid:NThsNEQ1WFBMdlZnZkFpTWtoVVp4Y05GU2x0aFdnSE4,consent:yes,action:no,necessary:yes,analytics:yes,advertisement:yes,other:yes;data=2504239b2fe516d3e14805694e3429be;_cfuvid=hivn0lLifbeIsEc.qwnY7ttzMg6jAQiLahAiMJUnqns-1705512740921-0-604800000;session=s%3AQREALkQGfEQM6DVuG2jl1skjlbeSQXNR.eNML9STrf4qvNmXjdYO8PPgPAVU3lsQwXvlAOlfcniQ;__cf_bm=cdsYDqf..A_1YNtOGkVVu3mYpXbhNV1TMSw9vXA.LOw-1706990546-1-AaqG5qvkhD63GJ2B2nB2GCFZ7CH16jfVYWj81WK8tEbP1RVLT60oEhO2vMnMfaZC5By1C3p1fcxPnNJTGWo8HY0=;cf_clearance=CxqyfeavizD2FMjTTMv6dN9a8C7L7zRXrYKdGht9fdk-1706990547-1-AX4SPxVdnmMGaxaJqHGLfXkV9n6dJ9gdkYXFJU0MB064VbEbzeXUXbCjLHLEO8Ne/9Ur6drV5GK5jcHglwFEAFk=";
    private encryptionService: EncryptionService;

    private reconnectAttempts: number = 0;
    private readonly maxReconnectAttempts: number = 5;

    private reconnectDelay: number = 1000;
    private maxReconnectDelay: number = 16000;

    constructor() {
        this.encryptionService = new EncryptionService(process.env.ENC_SECRET_KEY!);
        this.headers = headers(this.encryptedUserCookies);
        this.init();
    }

    private async init(): Promise<void> {
        try {
            this.connect();

        } catch (error) {
            console.error('Error initializing WebSocket:', error);
        }
    }

    private connect(): void {
        this.socket = new Websocket(this.socketEndpoint, this.subProtocol, {
            headers: this.headers
        });
        this.setupSocketListener();
    }

    private setupSocketListener(): void {
        this.socket.on('open', () => new HandleConnect(this.socket));
        this.socket.on('message', (data: Buffer) => new HandleMessage(this.socket, data));

        this.socket.on('close', (code: number, reason: Buffer): void => {
            console.log(`WebSocket closed with code: ${code}, reason: ${reason}`);
            this.reconnect();
        });

        this.socket.on('error', (error: any) => new HandleError(this.socket, error));
    }

    private decryptUserCookies(): string {
        return this.encryptionService.decrypt(this.encryptedUserCookies);
    }

    private reconnect(): void {
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            setTimeout((): void => {
                this.reconnectAttempts++;
                console.log("Attempting to reconnect to websocket... (attempt: ", this.reconnectAttempts, ")");
                this.connect();
            }, Math.min(this.reconnectDelay * Math.pow(2, this.reconnectAttempts), this.maxReconnectDelay));
        } else {
            console.log("Max reconnection attempts reached, stopping reconnecting.");
        }
    }
}