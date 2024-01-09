import Websocket from "ws";
import {IConnectionInit} from "../models/interfaces/IConnectionInit";
import {IPingMessage} from "../models/interfaces/IPingMessage";
import {onCreateTrade} from "../queries/onCreateTrade";
export class HandleConnect {

    private socket: Websocket;
    private readonly query: any;
    private pingInterval?: NodeJS.Timer;

    constructor(socket: Websocket) {
        this.socket = socket;
        this.query = onCreateTrade;
        this.init();
    }

    private init(): void {
        console.log("[wss] websocket connection established.");

        this.sendPingMessage();
        this.sendConnectionInit();

        this.pingInterval = setInterval(() => {
            this.sendPingMessage();
        }, 60000);

        this.sendQuery();
    }

    private sendQuery(): void {
        try {
            this.socket.send(JSON.stringify(this.query));
        } catch (error) {
            console.log("[wss] Error while query message. Reason:", error);
        }
    }

    private sendPingMessage(): void {
        try {
            this.socket.send(JSON.stringify(this.getPingMessage()));
        } catch (error) {
            console.log("[wss] Error while sending ping message. Reason:", error);
        }
    }

    private sendConnectionInit(): void {
        try {
            this.socket.send(JSON.stringify(this.getConnectionInit()));
        } catch (error) {
            console.log("[wss] Error while sending connection init message. Reason:", error)
        }
    }

    private getConnectionInit(): IConnectionInit {
        return { type: 'connection_init' };
    }

    private getPingMessage(): IPingMessage {
        return { type: 'ping', payload: {} };
    }

}