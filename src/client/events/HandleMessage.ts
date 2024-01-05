import Websocket from "ws";
import {TradingService} from "../services/Trading.service";
import * as fs from "fs";
import path from "path";

export class HandleMessage {

    private socket: Websocket;
    private data: Buffer;
    private logFilePath: string;

    constructor(socket: Websocket, data: Buffer) {
        this.socket = socket;
        this.data = data;
        this.logFilePath = path.join('./src/client/log', 'itemlogger.txt');

        this.init();
    }
    init(): void {
        console.log(this.getData());
        this.logToFile(this.getData());
        //new TradingService(this.getData());
    }
    private getData(): string {
        return this.data.toString();
    }

    private logToFile(data: string): void {
        fs.appendFile(this.logFilePath, data + '\n', (err) => {
            if (err) {
                console.error('Error writing to file:', err);
            }
        })
    }
}