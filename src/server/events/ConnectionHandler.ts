import Websocket from "ws";

export class ConnectionHandler {
    private ws: Websocket;
    private isFirstMessage: boolean;
    private pingTimeout!: NodeJS.Timeout;

    constructor(ws: Websocket) {
        this.ws = ws;
        this.isFirstMessage = true;
        this.setupEvents();
        this.resetPingTimeout();
    }

    private setupEvents(): void {
        this.ws.on('message', (message: Buffer) => this.handleMessage(message));
        this.ws.on('close', () => this.clearPingTimeout());
        this.ws.on('error', (error: Error) => {
            console.error('WebSocket error:', error);
            this.clearPingTimeout();
        });
    }

    private handleMessage(message: Buffer): void {
        try {
            const data = JSON.parse(message.toString());

            if (this.isFirstMessage) {

                this.isFirstMessage = false;

                if (data.connection && data.connection !== 'ping'){
                    this.closeConnection();
                    return;
                }
            }

            if (data.connection && data.connection === 'ping') {
                this.ws.send(this.sendPongMessage());
                this.resetPingTimeout();
            }

        } catch {
            this.closeConnection();
        }
    }

    private sendPongMessage(): string {
        return JSON.stringify({connection: 'pong'});
    }

    private resetPingTimeout(): void {
        this.clearPingTimeout();
        this.pingTimeout = setTimeout(() => this.closeConnection(), 5000);
    }

    private clearPingTimeout(): void {
        clearTimeout(this.pingTimeout);
    }

    private closeConnection(): void {
        this.ws.send(JSON.stringify({ error: 'Connection timed out.' }));
        this.ws.terminate();
    }
}