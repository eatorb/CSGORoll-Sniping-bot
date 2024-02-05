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


import Websocket from "ws";
import {TradingService} from "../services/Trading.service";
import * as fs from "fs";

export class HandleMessage {
    private readonly socket: Websocket;
    private readonly tradingService: TradingService;
    private readonly dataString: string;

    constructor(socket: Websocket, data: Buffer) {
        this.socket = socket;
        this.dataString = data.toString();
        //console.log(this.dataString);
        //this.writeToFile();
        this.tradingService = TradingService.getInstance(this.socket);

        this.init();
    }

    private async init(): Promise<void> {
        try {
            await this.tradingService.handleNewTradeData(this.dataString);
        } catch (error) {
            console.log("Errror in handling trade data");
        }
    }


    private async writeToFile(): Promise<void> {
        const filePath = './src/client/log/introspection.txt';

        try {
            await fs.promises.writeFile(filePath, this.dataString);
            console.log(`Data written to ${filePath}`);
        } catch (error) {
            console.error('Error writing to file:', error);
        }
    }
}
