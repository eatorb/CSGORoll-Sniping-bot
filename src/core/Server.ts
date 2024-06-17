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


import express, {Express, NextFunction, Request, Response} from "express";
import bodyParser from "body-parser";
import cors from "cors";
import Routing from "../api/routers/routing";
import {WebsocketServer} from "../server/WebsocketServer";
import {Client} from "../client/Client";
import {EndpointType} from "../client/models/enums/EndpointType";


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

        new Client(EndpointType.CSGOROLL_TR, 'api.csgorolltr.com', 'https://www.csgorolltr.com', 'cf_clearance=IIDmfC8VJEb.aLPQBx0bR1QzMAs9yV6JQsnGyjFdo8I-1707485444-1-ARb2zT4xYSlCk/kW02/V3Gl9cNcQ4Tdwnd0QgJpMTzZnK64xSpwgYHyD66X2nj765NrzCA0IGe7N+LAgLRmQ5SM=;session=s%3Ap5L7Q6BM_dS-ev0VLxtK4zhjb-Q4RnT_.OGTBv1gHCABfJhUnl7HctAIGrdTjWCMkgNbUAQBQJ0Y;__cf_bm=_khLPt4IkVX1FJVs5JuScM65REnwlxWeByFpwTHPGcs-1707494263-1-Achg4yhuJPB+Pm/+4Tb9u1jn1Cz/eP5gMyAK4nMezcWqKtdDBcTVxanD7RO7QmO19L1gehMA3/DWO/zRFK5rzoE=;__cf_bm=hmAgfbxGHZ3jZ4HSGiR4WRoup_hJbEpB7TgvS4uxJrw-1707494985-1-AeBtBbHsWEqud7nG6SS7i6TraSmDqmDqHerV0mBAn/7jXdPIPnhnVnD7tJ3C9YnRxHMhxEpDLC+chF4Lgg6lcbs=;__cf_bm=.DlWclNpi2g4usHq3_MBvuovXP7rtEfvt72o2PNNNtA-1707495085-1-AWeLL7xCc3bBf79eR2pFF6HUgpvqOGoDONo9WgvafRIgitOAKE659+VRgoW0DgqPq5MBpHteAFTIEmmEq/vwWc0=');
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