import Websocket from 'ws';
import {headers} from "./config/Headers";
import {HandleConnect} from "./events/HandleConnect";
import {HandleClose} from "./events/HandleClose";
import {HandleMessage} from "./events/HandleMessage";
import {HandleError} from "./events/HandleError";
import {EncryptionService} from "../api/services/Encryption.service";

export class Client {

    private socket!: Websocket;
    private socketEndpoint: string = 'wss://api.csgoroll.com/graphql';
    private readonly headers: Record<string, string>;
    private subProtocol: string[] = ['graphql-transport-ws'];
    private readonly encryptedUserCookies: string = "cookieyes-consent=consentid:NThsNEQ1WFBMdlZnZkFpTWtoVVp4Y05GU2x0aFdnSE4,consent:yes,action:no,necessary:yes,analytics:yes,advertisement:yes,other:yes; _cfuvid=TV4bWUQMPkSErVJ.Df2vI_URKlXKL2ZHltWg2qLGJOg-1704740811763-0-604800000; cf_clearance=NQs9mYsAV2ZCK4s2rz8WPE3vnG5sWU3KAzLkemeuOm0-1704740812-0-2-4936724d.132ac454.9329131d-0.2.1704740812; session=s%3AujNFOtw6CgClX6JEoxI-L4vM19e7Mc8C.BvdjQXlgOzH5xSNvzuDJsu1jYUPlE94biLGY0RpV3nc; __cf_bm=SF7uzroWN07hiBbH576oqYwkkkaAacMA6vnprIjNs5A-1704997579-1-AbezZwDIPkFhJjalhjNiWeoHW+bSccwL5bErrze4XhDg1wVHlw98S627NYx3dQ5YSkv8RiFh61TY7FT+RBw1100=";
    private encryptionService: EncryptionService;

    constructor() {
        this.encryptionService = new EncryptionService(process.env.ENC_SECRET_KEY!);
        this.headers = headers(this.encryptedUserCookies);
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

    private decryptUserCookies(): string {
        return this.encryptionService.decrypt(this.encryptedUserCookies);
    }

}