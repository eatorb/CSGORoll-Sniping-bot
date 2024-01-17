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
    private readonly encryptedUserCookies: string = "cookieyes-consent=consentid:eXgxcFkxZEpMWWR4bVJHZ2k2ek84VlZUNnNvekc5Q3g,consent:yes,action:yes,necessary:yes,analytics:yes,advertisement:yes,other:yes;session=s%3Axeb56coBQ7t6cpj_OtaWnrkY6zvpLt47.HVgQ2Fvnba0odUNCB6NbsuyTn2EcCrgZYdl%2Fe1fVT54;_cfuvid=Uo8FVQzmzTtldVBGPInSv9GIYYJ7f99OxACSe06lSTo-1705499255698-0-604800000;cf_clearance=2JPVf2CVYJiZVcuUrQZ0_hk5xy.GRHzUVU75g_2Mp40-1705499256-1-AY0aNdtz1xSpOJ/ZwqMHjylwcQGOKu+BJZofQndtz9TK82278C0qvYRO6qlSCIx8Q9DAFeFKxZLNqj5Swq4cAuM=;__cf_bm=RLF2NLVWPTHdfIJcQK7MVNPfda.dDjowslePhpfg5Xc-1705519003-1-AQt4sRqmlEICaJdQJEBBx/akw2uUDWt3rXixNSaskCdQTfee29bJFeT8iprdlHJv12ew8h5+Hu2uk5szer1QhwI=";
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
            this.init();
            console.log("[ws] reconnecting...");
        });

        this.socket.on('error', (error: any) => new HandleError(this.socket, error));
    }

    private decryptUserCookies(): string {
        return this.encryptionService.decrypt(this.encryptedUserCookies);
    }

}