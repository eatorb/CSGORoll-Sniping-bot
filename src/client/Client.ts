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
import {EndpointType} from "./models/enums/EndpointType";

export class Client {

    private socket!: Websocket;
    private readonly socketEndpoint: EndpointType;
    private readonly headers: Record<string, string>;
    private subProtocol: string[] = ['graphql-transport-ws'];

    private reconnectAttempts: number = 0;
    private readonly maxReconnectAttempts: number = 5;

    private reconnectDelay: number = 1000;
    private maxReconnectDelay: number = 16000;

    constructor(endpoint: EndpointType, host: string, origin: string, cookie: string) {
        this.socketEndpoint = endpoint;
        this.headers = headers(cookie, host, origin);
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

        console.log("[wss] connecting to endpoint: ", this.socketEndpoint);
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