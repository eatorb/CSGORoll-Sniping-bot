export interface ICreateTaskPayload {
    clientKey: string;
    task: {
        type: string;
        websiteURL: string;
        websiteKey: string;
        pageAction: string;
        minScore?: number;
    };
}