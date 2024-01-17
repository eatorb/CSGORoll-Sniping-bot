import Websocket from "ws";
import {joinTradesQuery} from "../queries/joinTradesQuery";
import {CaptchaManager} from "../managers/CaptchaManager";
import { v4 as uuidv4 } from 'uuid';
export class TradingService {

    private static instance: TradingService;

    private captchaManager: CaptchaManager;

    private socket: Websocket;
    private data!: string;

    private startTime: number = 0;

    private markupPercentage: number = 2;
    private minPrice: number = 5;
    private maxPrice: number = 50;
    private uuid: string = "";

    private constructor(socket: Websocket) {
        this.socket = socket;

        this.captchaManager = new CaptchaManager();
        this.socket.onmessage = (event: Websocket.MessageEvent) => this.handleSocketMessage(event);
    }

    public static getInstance(socket: Websocket): TradingService {

        if (!TradingService.instance)
            TradingService.instance = new TradingService(socket);

        return TradingService.instance;
    }

    public setData(data: string): void {
        this.data = data;
        this.withdraw();
    }

    async withdraw(): Promise<void> {
        this.startTime = Date.now();

        try {

            const jsonData = JSON.parse(this.data);

            const trade = jsonData.payload?.data?.createTrade?.trade;

            if (!trade)
                return;

            const tradeId = trade.id;

            const tradeItems = trade.tradeItems;

            if (!tradeItems || tradeItems.length === 0)
                return;

            // TODO: make advanced filter...

            const filteredItems = tradeItems.filter((item: any) =>
                item.markupPercent <= this.markupPercentage &&
                item.value >= this.minPrice &&
                item.value <= this.maxPrice &&
                !(item.itemVariant.brand === 'Sticker' || item.itemVariant.brand.includes('Pin') || item.itemVariant.brand.includes('Music Kit') || item.itemVariant.brand.includes('Souvenir'))
            );

            if (filteredItems.length === 0)
                return;

            const itemToWithdraw = filteredItems[0];

            console.log('Item selected for withdrawal with id:', {
                price: itemToWithdraw.value,
                markup: itemToWithdraw.markupPercent
            });

            await this.executeWithdrawal(tradeId);

        } catch (error) {
            console.error('Error in withdrawing item:', error);
            throw error;
        }

    }

    private async executeWithdrawal(itemId: string): Promise<void> {
        try {
            const captchaResponse: string | null = await this.captchaManager.getCaptchaSolution();

            if (!captchaResponse)
                throw new Error('No captcha response.');

            await this.withdrawItem(itemId, captchaResponse);

        } catch (error) {
            console.error("Error while trying to withdraw item: ", error);
        }
    }

    async withdrawItem(itemId: string, captcha: string): Promise<void> {

        this.uuid = uuidv4();

        const queryData = joinTradesQuery(this.uuid, itemId, captcha);

        const jsonString: string = JSON.stringify(queryData);

        console.log(jsonString);

        this.socket.send(jsonString);
    }

    private handleSocketMessage(event: Websocket.MessageEvent): void {
        try {
            const message = JSON.parse(event.data.toString());

            if (message.id === this.uuid) {

                console.log(message);

                if (message.payload && message.payload.errors) {
                    console.log("Errors:", JSON.stringify(message.payload.errors, null, 2));
                }
            }
        } catch (error) {
            console.error('Error parsing WebSocket message:', error);
        }
    }

}
