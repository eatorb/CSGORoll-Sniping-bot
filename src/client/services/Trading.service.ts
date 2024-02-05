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
import {CaptchaManager} from "../managers/CaptchaManager";
import { v4 as uuidv4 } from 'uuid';
import {IWithdrawalItem} from "../models/interfaces/IWithdrawalItem";
import axios from "axios";
import {autoJoinTradeQuery} from "../queries/autoJoinQuery";


export class TradingService {
    private static instance: TradingService;

    private captchaManager: CaptchaManager;

    private socket: Websocket;

    private markupPercentage: number = 10;
    private minPrice: number = 1;
    private maxPrice: number = 5;

    private uuid: string = "";

    private preprocessedItems: IWithdrawalItem[] = [];

    private readonly discordWebhookUrl: string = 'https://discord.com/api/webhooks/1200881992129052823/hq3_w1hOwGvoO4irmf4yl1iLQ7Xc8QX4gS2hQjiDfLb0jBL8IGDka4lEBiorel9VWOhd';

    private constructor(socket: Websocket) {
        this.socket = socket;
        this.captchaManager = new CaptchaManager();
        this.socket.onmessage = (event: Websocket.MessageEvent) => this.handleSocketMessage(event);
    }

    public static getInstance(socket: Websocket): TradingService {
        if (!TradingService.instance)
            TradingService.instance = new TradingService(socket);
        return TradingService.instance;
    }

    public handleNewTradeData(data: string): void {
        try {

            const tradeItems: IWithdrawalItem[] = this.parseTradeItems(data);

            if (tradeItems.length > 0) {
                this.preprocessedItems = this.preprocessTradeItems(tradeItems);
                this.withdraw();
            }

        } catch (error) {
            console.log("Error handling new trade data", error);
        }
    }

    private parseTradeItems(jsonData: string): IWithdrawalItem[] {
        try {
            const parsedData = JSON.parse(jsonData);
            const trade = parsedData.payload?.data?.createTrade?.trade;

            if (!trade || !Array.isArray(trade.tradeItems)) {
                return [];
            }

            return trade.tradeItems.map((item: any) => this.mapTradeItem(item, trade.id));
        } catch (error) {
            console.log('Error parsing JSON data', error);
            return [];
        }
    }

    private mapTradeItem(item: any, tradeId: string): IWithdrawalItem {
        return {
            tradeId: tradeId,
            id: item.id,
            marketName: item.marketName,
            value: item.value,
            customValue: item.customValue || null,
            itemVariant: item.itemVariant,
            markupPercent: item.markupPercent,
            stickers: item.stickers || [],
            steamExternalAssetId: item.steamExternalAssetId || null
        };
    }

    private preprocessTradeItems(tradeItems: IWithdrawalItem[]): IWithdrawalItem[] {
        return tradeItems.filter((item: IWithdrawalItem) => this.isValidItem(item));
    }

    private isValidItem(item: IWithdrawalItem): boolean {
        return item.markupPercent <= this.markupPercentage &&
            item.value >= this.minPrice &&
            item.value <= this.maxPrice &&
            !this.isExcludedItem(item.itemVariant.brand);
    }

    private isExcludedItem(brand: string): boolean {
        const excludedBrands: string[] = ['Sticker', 'Pin', 'Music Kit', 'Souvenir', 'Key', 'Capsule', 'Case'];
        return excludedBrands.includes(brand) && !brand.includes('Case Hardened');
    }

    async withdraw(): Promise<void> {

        if (this.preprocessedItems.length === 0)
            return;

        try {
            const withdrawalPromises = this.preprocessedItems.map(item =>
                this.executeWithdrawal(item.tradeId)
            );
            await Promise.all(withdrawalPromises);
        } catch (error) {
            console.error('Error in withdrawing item:', error);
            throw error;
        }
    }

    private async executeWithdrawal(itemId: string): Promise<void> {
        try {
            const captchaResponse: string | null = await this.captchaManager.getCaptchaSolution();

            if (!captchaResponse)
                throw new Error('No captcha response.');

            await this.withdrawItem(itemId, captchaResponse);

        } catch (error) {
            console.error("Error while trying to withdraw item: ", error);
        }
    }

    async withdrawItem(itemId: string, captcha: string): Promise<void> {

        this.uuid = uuidv4();

        const queryData = autoJoinTradeQuery(this.uuid, itemId,);

        //const queryData = joinTradesQuery(this.uuid, itemId, captcha);

        const jsonString: string = JSON.stringify(queryData);

        try {
            this.socket.send(jsonString);
        } catch (error) {
            console.log("Error while trying to send a trade.")
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
                this.sendDiscordNotification(this.preprocessedItems[0]).catch(error => {
                    console.log(error);
                });
            } else {
                return;
            }
        } catch (error) {
            console.error('Error parsing WebSocket message:', error);
        }
    }

    private async sendDiscordNotification(item: IWithdrawalItem): Promise<void> {
        const embed = {
            title: "Trade Completed",
            description: `Item successfully sniped: **${item.itemVariant.name.toString()}**`,
            color: 14862847,
            fields: [
                { name: "Value", value: item.value.toString(), inline: true },
                { name: "Markup Percent", value: item.markupPercent.toString(), inline: true }
            ],
            timestamp: new Date().toISOString(),
            image: { url: item.itemVariant.iconUrl }
        };

        const messageContent = { embeds: [embed] };

        try {
            await axios.post(this.discordWebhookUrl, messageContent, {
                headers: { 'Content-Type': 'application/json' }
            });
        } catch (error) {
            console.error("Failed to send notification to Discord:", error);
        }
    }

}
