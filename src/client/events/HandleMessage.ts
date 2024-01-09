import Websocket from "ws";
import {TradingService} from "../services/Trading.service";

export class HandleMessage {

    private readonly socket: Websocket;
    private data: Buffer;

    constructor(socket: Websocket, data: Buffer) {
        this.socket = socket;
        this.data = data;

        this.init();
    }
    init(): void {
        new TradingService(this.getData(), this.socket);
    }
    private getData(): string {
        return this.data.toString();
    }
}