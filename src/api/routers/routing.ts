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


import express, {Express, Router} from 'express';
import MainRouting from './main';
import AuthController from "../controllers/Auth.controller";

export default class Routing {

    app: Express;
    config: Map<String, any> = new Map<String, any>();

    constructor(app: Express) {
        this.app = app;

        this.config.set('app', this.app);

        this.init();
    }

    init(): void {
        this.app.use(express.json());
        this.app.use("/v1/", new MainRouting(this.config).getRouter);

        let router: Router = express.Router();

        this.initRoutes(router);

        this.app.use("/v1", router);
    }

    initRoutes(router: Router): void  {
        this.initAuthRoutes(router);
    }

    initAuthRoutes(router: Router): void {
        router.post('/auth/register', AuthController.registerUser);
        router.post('/auth/login', AuthController.userLogin);
        router.post('/auth/token/refresh', AuthController.refreshToken);
        router.post('/auth/logout', AuthController.logout);
    }


}