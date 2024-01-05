import Websocket from "ws";

export class HandleError {

    private socket: Websocket;
    private error: any;

    constructor(socket: Websocket, error: any) {
        this.socket = socket;
        this.error = error;

        this.init();
    }

    private init(): void {
        console.log("[wss] error has occured: ", this.getError());
    }

    private getError(): string {
        return this.error.toString();
    }

}