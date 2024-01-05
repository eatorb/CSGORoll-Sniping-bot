import Websocket from "ws";

export class HandleClose {

    private socket: Websocket;
    private reason: Buffer;
    private code: number;

    constructor(socket: Websocket, code: number, reason: Buffer) {
        this.socket = socket;
        this.reason = reason;
        this.code = code;

        this.init();
    }

    private init(): void {
        console.log('[wss] connection closed code:', this.code, 'reason: ', this.getReason());
    }

    private getReason(): string {
        return this.reason.toString();
    }

}