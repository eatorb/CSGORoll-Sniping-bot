import Websocket from "ws";
import {ConnectionHandler} from "./events/ConnectionHandler";

export class WebsocketServer {
    private socket!: Websocket.Server;
    private readonly port: number;

    constructor(port: number) {
        this.port = port;
        this.listen();
    }

    public listen(): void {
        this.socket = new Websocket.Server({port: this.port});
        this.setupEventListener();
        console.log("[Websocket Server] listening on port: ", this.port);
    }

    private setupEventListener(): void {
        this.socket.on('connection', (ws: Websocket): ConnectionHandler => new ConnectionHandler(ws));
        this.socket.on('error', (error: Error) => console.error('WebSocket Server error:', error));
    }
}