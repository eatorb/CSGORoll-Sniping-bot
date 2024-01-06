import {PrismaClient} from "@prisma/client";
import {IError} from "../models/interfaces/IError";
class ErrorRepository {

    private prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    async insertError(error: IError): Promise<void> {
        try {

            await this.prisma.errorlogs.create({
                data: {
                    errorCode: error.errorCode,
                    errorMessage: error.errorMessage,
                    timestamp: error.timeStamp,
                    status: error.status
                }
            })

        } catch (error) {
            throw new Error('Error occurred while inserting an error.');
        }
    }
}

export { ErrorRepository }