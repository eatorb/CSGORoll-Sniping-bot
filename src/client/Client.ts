import Websocket from 'ws';
import {headers} from "./config/Headers";
import {HandleConnect} from "./events/HandleConnect";
import {HandleClose} from "./events/HandleClose";
import {HandleMessage} from "./events/HandleMessage";
import {HandleError} from "./events/HandleError";

export class Client {

    private socket!: Websocket;
    private socketEndpoint: string = 'wss://api.csgoroll.com/graphql';
    private readonly headers: Record<string, string>;
    private subProtocol: string[] = ['graphql-transport-ws'];

    constructor() {
        this.headers = headers;
        this.init();
    }

    private async init(): Promise<void> {
        try {
            this.connect();

            this.setupSocketListener();

        } catch (error) {
            console.error('Error initializing WebSocket:', error);
        }
    }

    private connect(): void {
        this.socket = new Websocket(this.socketEndpoint, this.subProtocol, {
            headers: this.headers
        });
    }

    private setupSocketListener(): void {
        this.socket.on('open', () => new HandleConnect(this.socket));
        this.socket.on('message', (data: Buffer) => new HandleMessage(this.socket, data));
        this.socket.on('close', (code: number, reason: Buffer): void => {
            new HandleClose(this.socket, code, reason);

            // reconnect in case some unexpected close will happen
            this.connect();
        });

        this.socket.on('error', (error: any) => new HandleError(this.socket, error));
    }

}