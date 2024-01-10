import {Client} from "./Client";

if (!process.env.COOKIES)
    throw new Error('Failed to pass user cookies.');

new Client(process.env.COOKIES);