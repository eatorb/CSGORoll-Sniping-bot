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
import {joinTradesQuery} from "../queries/joinTradesQuery";
import { v4 as uuidv4 } from 'uuid';


export class TradingService {
    private static instance: TradingService;

    private socket: Websocket;

    private markupPercentage: number = 2;
    private minPrice: number = 10;
    private maxPrice: number = 50;

    private uuid: string = "";

    private constructor(socket: Websocket) {
        this.socket = socket;
        this.socket.onmessage = (event: Websocket.MessageEvent) => this.handleSocketMessage(event);
    }

    public static getInstance(socket: Websocket): TradingService {
        if (!TradingService.instance)
            TradingService.instance = new TradingService(socket);
        return TradingService.instance;
    }

    public handleNewTradeData(data: string): void {
        try {

            const parsedData = JSON.parse(data);

            const trade = parsedData.payload?.data?.createTrade?.trade;
            const tradeId = trade?.id;
            const markupPercent = trade?.markupPercent;
            const totalValue = trade?.totalValue;

            if (tradeId && this.isTradeWithinCriteria(markupPercent, totalValue)) {
                this.withdraw(tradeId);
            }


        } catch (error) {
            console.log("Error handling new trade data", error);
        }
    }

    private isTradeWithinCriteria(markupPercent: number | undefined, totalValue: number | undefined): boolean {
        if (markupPercent === undefined || totalValue === undefined) {
            return false;
        }

        return markupPercent <= this.markupPercentage && totalValue >= this.minPrice && totalValue <= this.maxPrice;
    }

    async withdraw(tradeId: string): Promise<void> {
        try {
            this.uuid = uuidv4();

            const queryData = joinTradesQuery(this.uuid, tradeId);

            const jsonString: string = JSON.stringify(queryData);

            this.socket.send(jsonString);

        } catch (error) {
            console.error("Error while trying to send a trade.", error);
        }
    }

    private handleSocketMessage(event: Websocket.MessageEvent): void {
        try {
            const message = JSON.parse(event.data.toString());

            if (message.id !== this.uuid)
                return;

            if (message?.payload?.errors) {
                console.log("----- Trade not completed. ------");

                message.payload.errors.forEach((error: { locations: any[]; }, index: any) => {
                    console.log(`Error ${index}:`, error);
                    if (error.locations) {
                        error.locations.forEach((loc, locIndex) => {
                            console.log(`Location ${locIndex}: Line ${loc.line}, Column ${loc.column}`);
                        });
                    }
                });
            }
            else if (message?.payload?.data) {
                console.log("------- Trade completed -------");
                console.log("Successfully sniped item.");
            } else {
                return;
            }
        } catch (error) {
            console.error('Error parsing WebSocket message:', error);
        }
    }

}
