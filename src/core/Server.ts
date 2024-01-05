import express, {Express} from "express";
import bodyParser from "body-parser";
import cors from "cors";
import Routing from "../api/routers/routing";

export class Server {

    private readonly app: Express;
    private readonly port: number;

    constructor(port: number) {
        this.app = express();
        this.port = port;

        this.initMiddlewares();
        this.initRouting();
        this.initRouting();
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

    public listen(): void {
        this.app.listen(this.port, (): void => {
            console.log(`[server]: Server is running at http://localhost:${this.port}`);
        });
    }
}