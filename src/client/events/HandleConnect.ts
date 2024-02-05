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
import {IConnectionInit} from "../models/interfaces/IConnectionInit";
import {IPingMessage} from "../models/interfaces/IPingMessage";
import {onCreateTrade} from "../queries/onCreateTrade";
import {introspectionQuery} from "../queries/introspectionQuery";

export class HandleConnect {

    private socket: Websocket;
    private readonly query: any;
    private pingInterval?: NodeJS.Timer;
    private readonly introspectionQuery: any;
    constructor(socket: Websocket) {
        this.socket = socket;
        this.query = onCreateTrade;
        this.introspectionQuery = introspectionQuery;
        this.init();
    }

    private init(): void {
        console.log("[wss] websocket connection established.");

        this.sendPingMessage();
        this.sendConnectionInit();


        this.pingInterval = setInterval(() => {
            this.sendPingMessage();
        }, 60000);

        this.sendQuery();
    }

    private sendQuery(): void {
        try {
            this.socket.send(JSON.stringify(this.query));
            this.socket.send(JSON.stringify(this.introspectionQuery))
        } catch (error) {
            console.log("[wss] Error while query message. Reason:", error);
        }
    }

    private sendPingMessage(): void {
        try {
            this.socket.send(JSON.stringify(this.getPingMessage()));
        } catch (error) {
            console.log("[wss] Error while sending ping message. Reason:", error);
        }
    }

    private sendConnectionInit(): void {
        try {
            this.socket.send(JSON.stringify(this.getConnectionInit()));
        } catch (error) {
            console.log("[wss] Error while sending connection init message. Reason:", error)
        }
    }

    private getConnectionInit(): IConnectionInit {
        return { type: 'connection_init' };
    }

    private getPingMessage(): IPingMessage {
        return { type: 'ping', payload: {} };
    }

}