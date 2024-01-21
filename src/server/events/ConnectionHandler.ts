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


import Websocket from "ws";
import {TokenService} from "../services/Token.Service";
import {ConnectionState} from "../models/enum/ConnectionState";
import {WebSocketMessage} from "../models/interfaces/WebSocketMessage";
import {MessageType} from "../models/enum/MessageType";
import {CloseMessageType} from "../models/enum/CloseMessageType";

export class ConnectionHandler {

    private ws: Websocket;
    private pingTimeout!: NodeJS.Timeout;
    private tokenService: TokenService;
    private connectionState: ConnectionState;

    constructor(ws: Websocket) {
        this.ws = ws;
        this.tokenService = new TokenService();
        this.connectionState = ConnectionState.AwaitingFirstMessage;

        this.setupEvents();
        this.resetPingTimeout();
    }

    private setupEvents(): void {
        this.ws.on('message', (message: Buffer) => this.handleMessage(message));

        this.ws.on('close', () => this.clearPingTimeout());

        this.ws.on('error', (error: Error): void => this.handleError(error));
    }

    private async handleMessage(message: Buffer): Promise<void> {
        try {
            const data: WebSocketMessage = this.parseMessage(message);

            switch (this.connectionState) {
                case ConnectionState.AwaitingFirstMessage:
                    this.handleFirstMessage(data);
                    break;

                case ConnectionState.AwaitingTokenValidation:
                    await this.handleTokenValidation(data);
                    break;

                case ConnectionState.RegularOperation:
                    this.handleRegularOperation(data);
                    break;
            }
        } catch {
            this.closeConnection(CloseMessageType.InvalidMessageFormat);
        }
    }

    private handleError(error: Error): void {
        console.error(error);
        this.clearPingTimeout();
    }

    private parseMessage(message: Buffer): WebSocketMessage {
        try {
            return JSON.parse(message.toString());
        } catch (error) {
            throw new Error(CloseMessageType.ErrorParsingMessage)
        }
    }

    private handleFirstMessage(data: WebSocketMessage): void {

        if (data.connection !== MessageType.Ping) {
            this.closeConnection(CloseMessageType.InvalidFirstMessage);
            return;
        }

        this.ws.send(this.sendPongMessage());
        this.resetPingTimeout();

        this.connectionState = ConnectionState.AwaitingTokenValidation;
    }

    private async handleTokenValidation(data: WebSocketMessage): Promise<void> {

        if (!data.authentication) {
            this.closeConnection(CloseMessageType.APITokenRequired);
            return;
        }

        // validate the token here
        const isTokenValid: boolean = await this.tokenService.validateToken(data.authentication);

        if (!isTokenValid) {
            this.closeConnection(CloseMessageType.InvalidAPIToken);
            return;
        }

        this.connectionState = ConnectionState.RegularOperation;
    }

    private handleRegularOperation(data: WebSocketMessage): void {
        if (data.connection === MessageType.Ping) {
            this.ws.send(this.sendPongMessage());
            this.resetPingTimeout();
        }
    }

    private sendPongMessage(): string {
        return JSON.stringify({ connection: MessageType.Pong });
    }

    private resetPingTimeout(): void {
        this.clearPingTimeout();
        this.pingTimeout = setTimeout(() => this.closeConnection(CloseMessageType.ClientTimedOut), 60000);
    }

    private clearPingTimeout(): void {
        clearTimeout(this.pingTimeout);
    }

    private closeConnection(reason: string): void {
        this.ws.send(JSON.stringify({ error: reason }));
        this.ws.terminate();
    }
}