import Websocket from "ws";
import {joinTradesQuery} from "../queries/joinTradesQuery";
import {IWithdrawalItem} from "../models/interfaces/IWithdrawalItem";
import {CaptchaSolvingService} from "./CaptchaSolving.service";
export class TradingService {

    private readonly data: string;
    private socket: Websocket;
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

            if (!trade)
                return;

            const tradeId = trade.id;


            const tradeItems = trade.tradeItems;

            if (!tradeItems || tradeItems.length === 0)
                return;

            const itemToWithdraw: IWithdrawalItem = tradeItems.find((item: any): boolean => {
                return item.value < 2;
            });

            if (!itemToWithdraw)
                return;

            console.log('Item selected for withdrawal with id:', tradeId);
            console.log('Obj:', itemToWithdraw);

            await this.executeWithdrawal(tradeId);

            const duration = Date.now() - startTime;
            console.log(`Total time for withdrawal process: ${duration} ms`);

        } catch (error) {
            console.error('Error in withdrawing item:', error);
            throw error;
        }
    }

    private async executeWithdrawal(itemId: string): Promise<void> {

        const startTime = Date.now();

        try {
            const captchaResponse: string = await this.solveCaptcha();

            await this.withdrawItem(itemId, captchaResponse);

            const duration = Date.now() - startTime;
            console.log(`Time for executing withdrawal: ${duration} ms`);

        } catch (error) {
            console.log("Error while trying to withdraw item. Reason?: ", error);
        }
    }

    private async solveCaptcha(): Promise<string> {

        const startTime = Date.now();

        const captchaSolvingService: CaptchaSolvingService = new CaptchaSolvingService();

        return new Promise((resolve, reject): void => {
            captchaSolvingService.createTask().then((taskId: string | null): void => {

                console.log("[captcha] trying to resolve captcha...");

                if (!taskId) {
                    reject(new Error('Task id hasnt been found.'));
                    return;
                }

                // we need to set the timeout to delay calling function getTaskResult()
                // this is important because of async procesing for example...
                // hovewer we can still calculate the timing of the request being procced and then make the timeout lower
                // deppening on average response from the server

                setTimeout((): void => {
                    captchaSolvingService.getTaskResult(taskId).then((captchaResponse) => {
                        const duration = Date.now() - startTime;
                        console.log(`[captcha] Time taken to solve captcha: ${duration} ms`);
                        resolve(captchaResponse);
                    }).catch(reject);
                }, 5000);

            }).catch(reject);
        })
    }

    async withdrawItem(itemId: string, captcha: string): Promise<void> {
        console.log("[withdraw] executed withdraw", JSON.stringify(joinTradesQuery(itemId, captcha)))
        this.socket.send(JSON.stringify(joinTradesQuery(itemId, captcha)));
    }
}
