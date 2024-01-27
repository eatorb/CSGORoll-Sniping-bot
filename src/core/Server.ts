/*
 * Copyright (c) 2024 Šimon Sedlák snipeit.io All rights reserved.
 *
 * Licensed under the GNU GENERAL PUBLIC LICENSE Version 3, 29 June 2007 (the "License");
 * You may not use this file except in compliance with the License.
 *
 * You may obtain a copy of the License at
 * https://www.gnu.org/licenses/gpl-3.0.html
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 */


import express, {Response, Request, Express, NextFunction} from "express";
import bodyParser from "body-parser";
import cors from "cors";
import Routing from "../api/routers/routing";
import {WebsocketServer} from "../server/WebsocketServer";
import {Client} from "../client/Client";


// TODO: refactor this...
interface ErrorWithStatus extends Error {
    status?: number;
}

export class Server {

    private readonly app: Express;
    private readonly port: number;
    private WebsocketServer: WebsocketServer;


    constructor(port: number) {
        this.app = express();
        this.port = port;

        this.initMiddlewares();
        this.initRouting();
        this.initRouting();
        this.initErrorHandling();


        this.WebsocketServer = new WebsocketServer(4200);

        new Client();
    }

    private initMiddlewares(): void {
        this.app.use(express.json());
        this.app.use(bodyParser.json({strict: false}));
        this.app.use(cors());
    }

    private initRouting(): void {
        const routing: Routing = new Routing(this.app);
        routing.init();
    }

    // TODO: refactor this...
    private initErrorHandling(): void {
        this.app.use((err: ErrorWithStatus, req: Request, res: Response, next: NextFunction) => {
            if (err.status === 400 && 'body' in err) {
                return res.status(400).send({ "message": "Invalid JSON payload" });
            }
            next();
        });
    }
    public listen(): void {
        this.app.listen(this.port, (): void => {
            console.log(`[server]: Server is running at http://localhost:${this.port}`);
        });
    }
}