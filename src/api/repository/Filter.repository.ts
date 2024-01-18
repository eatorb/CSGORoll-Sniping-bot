import { PrismaClient } from "@prisma/client";

export class FilterRepository {

    private prisma: PrismaClient;
    constructor() {
        this.prisma = new PrismaClient();
    }

    async insertFilter(): Promise<void> {
        try {

            // TODO: insert filter query...

        } catch (error) {
            throw new Error('Error while inserting a filter.');
        }
    }
}