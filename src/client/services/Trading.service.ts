export class TradingService {
    private markupPercentage: number = 2;
    private minPrice: number = 5;
    private maxPrice: number = 100;

    private readonly data: string;
    constructor(data: string) {
        this.data = data;

        this.withdrawLowestPricedItem();
    }

    async withdrawLowestPricedItem(): Promise<void> {
        try {
            const jsonData = JSON.parse(this.data);
            const tradeItems = jsonData.payload?.data?.createTrade?.trade?.tradeItems;

            if (!tradeItems || tradeItems.length === 0)
                return;

            const itemToWithdraw = tradeItems.find((item: any) => {
                const meetsMarkupCriteria: boolean = item.markupPercent <= this.markupPercentage;
                const meetsPriceCriteria: boolean = item.value >= this.minPrice && item.value <= this.maxPrice;

                return meetsMarkupCriteria && meetsPriceCriteria;
            });

            if (!itemToWithdraw)
                return;

            console.log('Item selected for withdrawal:', itemToWithdraw);

        } catch (error) {
            console.error('Error in withdrawing item:', error);
            throw error;
        }
    }

    async withdrawItem(apiKey: string, itemId: number, coinValue: number): Promise<void> {
    }
}
