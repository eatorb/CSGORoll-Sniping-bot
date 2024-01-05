import dotenv from 'dotenv';
dotenv.config();

import {Server} from './core/Server';

const server: Server = new Server(3000);

server.listen();