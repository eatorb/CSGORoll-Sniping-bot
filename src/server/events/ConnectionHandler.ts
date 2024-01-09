import Websocket from "ws";
import {TokenService} from "../services/Token.Service";
import {ConnectionState} from "../models/enum/ConnectionState";
import {WebSocketMessage} from "../models/interfaces/WebSocketMessage";


/*
    The server flow looks like this:

        - client connects to the server.
        - clients sends a first ping message that looks like this { connection: 'ping' }
        - server responds with a valid message that looks like this { connection: 'pong }
        - if the server doesn't get the first message in one minute or its different, the connection will be closed.
        - after that, client needs to send a { connection: 'ping' } each minute, as a verification, that the client is still connected to the server
        - after that, the authentication will come.
        - the server expects { authentication: 'api-token' }
        - after that it validates it and start sending the correct messages from csgo roll client.
 */

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
        this.ws.on('error', (error: Error): void => {
            console.error('WebSocket error:', error);
            this.clearPingTimeout();
        });
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
            this.closeConnection('Invalid message format.');
        }
    }

    private parseMessage(message: Buffer): WebSocketMessage {
        try {
            return JSON.parse(message.toString());
        } catch (error) {
            throw new Error('Error while parsing message.')
        }
    }

    private handleFirstMessage(data: WebSocketMessage): void {
        if (data.connection !== 'ping') {
            this.closeConnection('Invalid first message.');
            return;
        }

        this.ws.send(this.sendPongMessage());
        this.resetPingTimeout();

        this.connectionState = ConnectionState.AwaitingTokenValidation;
    }

    private async handleTokenValidation(data: WebSocketMessage): Promise<void> {
        if (!data.authentication) {
            this.closeConnection('API token is required.');
            return;
        }

        // validate the token here
        const isTokenValid: boolean = await this.tokenService.validateToken(data.authentication);

        if (!isTokenValid) {
            this.closeConnection('Invalid API token.');
            return;
        }

        this.connectionState = ConnectionState.RegularOperation;
    }

    private handleRegularOperation(data: WebSocketMessage): void {
        if (data.connection === 'ping') {
            this.ws.send(this.sendPongMessage());
            this.resetPingTimeout();
        }
    }

    private sendPongMessage(): string {
        return JSON.stringify({connection: 'pong'});
    }

    private resetPingTimeout(): void {
        this.clearPingTimeout();
        this.pingTimeout = setTimeout(() => this.closeConnection('Client has timed out.'), 60000);
    }

    private clearPingTimeout(): void {
        clearTimeout(this.pingTimeout);
    }

    private closeConnection(reason: string): void {
        this.ws.send(JSON.stringify({ error: reason }));
        this.ws.terminate();
    }
}