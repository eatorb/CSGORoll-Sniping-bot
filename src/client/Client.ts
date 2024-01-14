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
    private readonly encryptedUserCookies: string = "cookieyes-consent=consentid:NThsNEQ1WFBMdlZnZkFpTWtoVVp4Y05GU2x0aFdnSE4,consent:yes,action:no,necessary:yes,analytics:yes,advertisement:yes,other:yes; _cfuvid=TV4bWUQMPkSErVJ.Df2vI_URKlXKL2ZHltWg2qLGJOg-1704740811763-0-604800000; session=s%3AujNFOtw6CgClX6JEoxI-L4vM19e7Mc8C.BvdjQXlgOzH5xSNvzuDJsu1jYUPlE94biLGY0RpV3nc; cf_clearance=Yskai_CGeCiIz7IvuixE135lKxG_S4KqL_yzCDSfRVw-1705000342-0-2-4936724d.9329131d.1e372dad-0.2.1705000342; __cf_bm=c8Ou7QDUUMcGAWPnUfAPo57E.bjxRgfKJQkvKZWuTHU-1705188012-1-AWgwywgwEXRkrZv/BJsRMxw0JhdmwzX3jRXO/RPqV9E4/BON9M0DfnEDJ1MhCM4paPiFtKLafHOk3hLVaLMeQOE=";
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