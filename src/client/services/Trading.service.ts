import Websocket from "ws";
import {joinTradesQuery} from "../queries/joinTradesQuery";
import {IWithdrawalItem} from "../models/interfaces/IWithdrawalItem";
export class TradingService {

    private readonly data: string;
    private socket: Websocket;
    constructor(data: string, socket: Websocket) {
        this.data = data;
        this.socket = socket;

        this.withdrawLowestPricedItem();
    }

    async withdrawLowestPricedItem(): Promise<void> {
        try {
            const jsonData = JSON.parse(this.data);
            const tradeItems = jsonData.payload?.data?.createTrade?.trade?.tradeItems;

            if (!tradeItems || tradeItems.length === 0)
                return;

            const itemToWithdraw: IWithdrawalItem = tradeItems.find((item: any): boolean => {
                return item.value < 10;
            });

            if (!itemToWithdraw)
                return;

            //console.log('Item selected for withdrawal:', itemToWithdraw);

            console.log(itemToWithdraw.id);

            await this.withdrawItem(itemToWithdraw.id, 'test');



        } catch (error) {
            console.error('Error in withdrawing item:', error);
            throw error;
        }
    }

    async withdrawItem(itemId: string, captcha: string): Promise<void> {
        this.socket.send(JSON.stringify(joinTradesQuery(itemId, captcha)));
    }

    private solveCaptcha(): void {

    }


}
