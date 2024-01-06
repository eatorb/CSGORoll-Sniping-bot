import Routing from "../models/Routing";
import express from "express";
import restUtils from "../utils/restUtils";
export default class MainRouting extends Routing {

    router: express.Router;
    startTime: number;

    constructor(props:any) {
        super(props);

        this.router = this.newRouter();

        this.startTime = Date.now();

        this.init();
    }
    init(): void {
        this.router.all('/', (request, result, next) => {

            const uptime: string = restUtils.formatUptime(process.uptime());

            return result.send({
                status: "OK",
                message: "EmpireSniper API is up and running.",
                uptime: uptime
            });
        });
    }

    get getRouter(): express.Router {
        return this.router;
    }
}
