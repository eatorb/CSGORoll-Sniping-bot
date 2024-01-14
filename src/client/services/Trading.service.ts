import Websocket from "ws";
import {joinTradesQuery} from "../queries/joinTradesQuery";
import {CaptchaSolvingService} from "./CaptchaSolving.service";

export class TradingService {

    private static instance: TradingService;

    private socket: Websocket;
    private data!: string;
    private markupPercentage: number = 2;
    private minPrice: number = 5;
    private maxPrice: number = 13;

    private captchaQueue: Array<{ taskId: string, solution: string | null, timestamp: number }> = [];
    private readonly maxCaptchaAge: number = 120000;
    private readonly maxConcurrentCaptchaTasks: number = 10;

    private constructor(socket: Websocket) {
        this.socket = socket;

        setInterval(() => this.maintainCaptchaQueue(), 60000);
    }

    public static getInstance(socket: Websocket): TradingService {

        if (!TradingService.instance)
            TradingService.instance = new TradingService(socket);

        return TradingService.instance;
    }

    public setData(data: string): void {
        this.data = data;
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
            const captchaResponse: string | null = await this.getCaptchaSolution();

            if (!captchaResponse)
                throw new Error('No captcha response.');

            await this.withdrawItem(itemId, captchaResponse);
        } catch (error) {
            console.error("Error while trying to withdraw item: ", error);
        }
    }

    private async maintainCaptchaQueue(): Promise<void> {
        this.cleanupExpiredTokens();

        if (this.captchaQueue.filter(task => !task.solution).length < this.maxConcurrentCaptchaTasks) {
            await this.addCaptchaTask();
        }

        await this.resolveCaptchaTasks();
    }

    private async resolveCaptchaTasks(): Promise<void> {
        for (const task of this.captchaQueue) {
            if (!task.solution) {
                try {
                    const solution = await this.pollForResult(new CaptchaSolvingService(), task.taskId, 100, Date.now(), 1000);
                    if (solution) {
                        task.solution = solution;
                    }
                } catch (error) {
                    console.error('Error polling captcha solution:', error);
                }
            }
        }
    }

    private async addCaptchaTask(): Promise<void> {
        const captchaSolvingService = new CaptchaSolvingService();
        if (this.captchaQueue.filter(task => !task.solution).length < this.maxConcurrentCaptchaTasks) {
            const taskId: string | null = await captchaSolvingService.createTask();
            if (taskId) {
                this.captchaQueue.push({ taskId, solution: null, timestamp: Date.now() });
                console.log('Captcha task created with ID:', taskId);
            }
        }
    }

    private cleanupExpiredTokens(): void {
        const currentTime = Date.now();
        this.captchaQueue = this.captchaQueue.filter(task =>
            (task.solution && currentTime - task.timestamp < this.maxCaptchaAge) || !task.solution
        );
        console.log("Cleaned up expired task.");
    }

    private async getCaptchaSolution(): Promise<string | null> {
        const validToken = this.captchaQueue.find(task => task.solution);
        if (validToken) {
            this.captchaQueue = this.captchaQueue.filter(task => task !== validToken);
            return validToken.solution;
        } else {
            throw new Error('No valid captcha available.');
        }
    }

    private async pollForResult(captchaSolvingService: CaptchaSolvingService, taskId: string, currentDelay: number, startTime: number, maxDelay: number): Promise<string> {
        let attempt = 0;
        const maxAttempts = 10;

        while (Date.now() - startTime < maxDelay && attempt < maxAttempts) {
            try {
                await new Promise(resolve => setTimeout(resolve, currentDelay));
                const result = await captchaSolvingService.getTaskResult(taskId);
                console.log(`Captcha task ${taskId} solved on attempt ${attempt + 1} in ${Date.now() - startTime}ms`);
                return result;
            } catch (error) {
                attempt++;
                currentDelay = Math.min(currentDelay * 2, maxDelay - (Date.now() - startTime));
            }
        }

        throw new Error('Captcha solve timeout or max attempts reached');
    }


    async withdrawItem(itemId: string, captcha: string): Promise<void> {

        const queryData = joinTradesQuery(itemId, captcha);

        const jsonString: string = JSON.stringify(queryData);

        this.socket.send(jsonString);
    }
}
