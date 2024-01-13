import Websocket from "ws";
import {joinTradesQuery} from "../queries/joinTradesQuery";
import {IWithdrawalItem} from "../models/interfaces/IWithdrawalItem";
import {CaptchaSolvingService} from "./CaptchaSolving.service";
export class TradingService {

    private readonly data: string;
    private socket: Websocket;
    private markupPercentage: number = 2;
    private minPrice: number = 5;
    private maxPrice: number = 13;

    constructor(data: string, socket: Websocket) {
        this.data = data;
        this.socket = socket;

        this.withdrawLowestPricedItem();
    }

    async withdrawLowestPricedItem(): Promise<void> {
        const startTime = Date.now();

        try {
            const jsonData = JSON.parse(this.data);
            const trade = jsonData.payload?.data?.createTrade?.trade;

            if (!trade) return;

            const tradeId = trade.id;

            const tradeItems = trade.tradeItems;

            if (!tradeItems || tradeItems.length === 0) return;

            const filteredItems = tradeItems.filter((item: any) =>
                item.markupPercent <= this.markupPercentage &&
                item.value >= this.minPrice &&
                item.value <= this.maxPrice
            );

            if (filteredItems.length === 0)
                return;

            const itemToWithdraw = filteredItems[0];

            console.log('Item selected for withdrawal with id:', {
                price: itemToWithdraw.value,
                markup: itemToWithdraw.markupPercent
            });

            await this.executeWithdrawal(tradeId);

            const duration = Date.now() - startTime;
            console.log(`Total time for withdrawal process: ${duration} ms`);

        } catch (error) {
            console.error('Error in withdrawing item:', error);
            throw error;
        }
    }
    private async executeWithdrawal(itemId: string): Promise<void> {
        try {
            const captchaResponse: string = await this.solveCaptcha();

            await this.withdrawItem(itemId, captchaResponse);

        } catch (error) {
            console.log("Error while trying to withdraw item: ", error);
        }
    }

    private async solveCaptcha(): Promise<string> {
        const startTime: number = Date.now();
        const captchaSolvingService: CaptchaSolvingService = new CaptchaSolvingService();
        const taskId: string | null = await captchaSolvingService.createTask();

        if (!taskId)
            throw new Error('Task id has not been found.');

        return this.pollForResult(captchaSolvingService, taskId, 100, startTime, 1000);
    }

    private async pollForResult(captchaSolvingService: CaptchaSolvingService, taskId: string, currentDelay: number, startTime: number, maxDelay: number): Promise<string> {
        let attempt = 0;
        const maxAttempts = 10;

        while (Date.now() - startTime < maxDelay && attempt < maxAttempts) {
            try {
                await new Promise(resolve => setTimeout(resolve, currentDelay));
                return await captchaSolvingService.getTaskResult(taskId);
            } catch (error) {
                attempt++;
                currentDelay = Math.min(currentDelay * 2, maxDelay - (Date.now() - startTime));
            }
        }

        throw new Error('Captcha solve timeout or max attempts reached');
    }

    async withdrawItem(itemId: string, captcha: string): Promise<void> {
        this.socket.send(JSON.stringify(joinTradesQuery(itemId, captcha)));
    }
}
