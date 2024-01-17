import {CaptchaSolvingService} from "../services/CaptchaSolving.service";

export class CaptchaManager {

    private captchaSolvingService: CaptchaSolvingService;

    private captchaQueue: Array<{ taskId: string, solution: string | null, timestamp: number }> = [];

    private readonly maxCaptchaAge: number = 120000;
    private readonly maxConcurrentCaptchaTasks: number = 3;

    constructor() {
        this.captchaSolvingService = new CaptchaSolvingService();

        // TODO: test and check any unexpected behaviour eg overlapping executions
        // call this first, as soon as we start a new client so the captcha is ready
        this.maintainCaptchaQueue();

        // then set interval for calling it every 1.8 minutes
        setInterval(() => this.maintainCaptchaQueue(), 108000);
    }

    async maintainCaptchaQueue(): Promise<void> {

        this.cleanupExpiredTokens();

        const tasksToBeAdded: number = this.maxConcurrentCaptchaTasks - this.captchaQueue.filter(task => !task.solution).length;

        for (let i = 0; i < Math.min(3, tasksToBeAdded); i++) {
            await this.addCaptchaTask();
        }

        await this.resolveCaptchaTasks();

    }

    private async addCaptchaTask(): Promise<void> {

        if (this.captchaQueue.some(task => !task.solution) || this.captchaQueue.length >= this.maxConcurrentCaptchaTasks)
            return;

        const taskId: string | null = await this.captchaSolvingService.createTask();

        if (!taskId)
            throw new Error('No captcha task id found.');

        this.captchaQueue.push({ taskId, solution: null, timestamp: Date.now() });


        await this.resolveCaptchaTasks();

    }

    async resolveCaptchaTasks(): Promise<void> {


        for (const task of this.captchaQueue) {
            if (!task.solution) {
                try {
                    const solution: string = await this.pollForResult(task.taskId, 100, Date.now(), 1000);

                    if (solution) {
                        task.solution = solution;
                    }


                } catch (error) {
                    console.error('Error polling captcha solution:', error);
                }
            }
        }

    }

    private cleanupExpiredTokens(): void {
        const currentTime: number = Date.now();

        this.captchaQueue = this.captchaQueue.filter(task => (task.solution && currentTime - task.timestamp < this.maxCaptchaAge) || !task.solution);
    }

    async getCaptchaSolution(): Promise<string | null> {
        const retryLimit = 3;
        let attempts = 0;

        while (attempts < retryLimit) {
            const validToken = this.captchaQueue.find(task => task.solution);
            if (validToken) {
                this.captchaQueue = this.captchaQueue.filter(task => task !== validToken);

                this.addCaptchaTask().catch(error => console.error('Error adding new captcha task:', error));

                return validToken.solution;
            } else {
                attempts++;
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }

        throw new Error('No valid captcha available after retries.');
    }


    async pollForResult(taskId: string, currentDelay: number, startTime: number, maxDelay: number): Promise<string> {
        let attempt: number = 0;

        const maxAttempts: number = 10;

        while (Date.now() - startTime < maxDelay && attempt < maxAttempts) {
            await new Promise(resolve => setTimeout(resolve, currentDelay));

            try {
                return await this.captchaSolvingService.getTaskResult(taskId);
            } catch (error) {
                attempt++;
                currentDelay *= 2;
            }
        }

        throw new Error('Captcha solve timeout or max attempts reached');
    }

}