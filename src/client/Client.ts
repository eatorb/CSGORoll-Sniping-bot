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
    private readonly encryptedUserCookies: string = "cookieyes-consent=consentid:eXgxcFkxZEpMWWR4bVJHZ2k2ek84VlZUNnNvekc5Q3g,consent:yes,action:yes,necessary:yes,analytics:yes,advertisement:yes,other:yes;intercom-device-id-u1yr9red=148b38a8-473c-4d03-98d0-c1da9e412990;cfuvid=H4drlWBKTxKGtamD6v1C.1r_iJ0dlBBqZM_75AK0eU-1705838098066-0-604800000;amp_2bba79=L_FbOjBijwfA-b-tP3DKdT.VlhObGNqb3hOekl3T0Rj..1hkr2f0tj.1hkr2f6bh.3.0.3;session=s%3A1A3POyI8pMPuiS6foPzuP46pTBf5cbyK.lGdiO2NyZ%2FHMKgeR20tketZBfHY8EZvZLEiySNE1Vzw;cf_clearance=Tg8rYAw7T4eYVph4CGYPaE0DlEh8KAjaeoVOP_oTRcA-1706275400-1-AbtPVvp4AMqxCDo1aWj8W402TFhbnKKUrpv1immQDCW5qXJG4FthVH5mlRkalbMtQC11aqO1cIIoair/gFC3Q8g=;intercom-session-u1yr9red=RWVBSEVkcHJISmxvSEs1WmUyUWh1VEVlRm5DQ3pFYjM0elVuLzdoMkpjb3R5U1drRGtUb2hzb29OZ2JlaW9vaS0tYUpnaExQajdIRXZsVXFwV3E1Y0doZz09--5d6eeac894f2f561d3214dc2dc7bda7b1d563ebf;__cf_bm=j39qRfewgSVx8M52K_TmeHI10OueA82OJVycisskh.k-1706357416-1-AWJJ3gUWQqXXE9Ld+Vs/YJ2urhXDXsuTmSBttmWH/T+/oh8mNi3YoOSd3+fK6cs46etalG1btjYeUYbvq+22b2E=";
    private encryptionService: EncryptionService;

    private reconnectAttempts: number = 0;
    private readonly maxReconnectAttempts: number = 5;

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
                console.log(`Attempting to reconnect... (Attempt ${this.reconnectAttempts})`);
                this.connect();
            }, Math.pow(2, this.reconnectAttempts) * 1000);
        } else {
            console.error("Max reconnection attempts reached. Stopping reconnection attempts.");
        }
    }

}