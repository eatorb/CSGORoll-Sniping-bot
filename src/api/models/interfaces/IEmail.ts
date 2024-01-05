export interface IEmail {
    from: string;
    to?: string;
    subject: string;
    html: string;
    headers: {}
}