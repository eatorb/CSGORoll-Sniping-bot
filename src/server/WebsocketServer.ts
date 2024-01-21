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
import {ConnectionHandler} from "./events/ConnectionHandler";

export class WebsocketServer {
    private socket!: Websocket.Server;
    private readonly port: number;

    constructor(port: number) {
        this.port = port;
        this.listen();
    }

    public listen(): void {
        this.socket = new Websocket.Server({port: this.port});
        this.setupEventListener();
        console.log("[Websocket Server] listening on port: ", this.port);
    }

    private setupEventListener(): void {
        this.socket.on('connection', (ws: Websocket): ConnectionHandler => new ConnectionHandler(ws));
        this.socket.on('error', (error: Error) => console.error('WebSocket Server error:', error));
    }
}