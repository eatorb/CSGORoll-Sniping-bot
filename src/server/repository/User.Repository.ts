import {PrismaClient, user} from "@prisma/client";

export class UserRepository {

    private prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    async findUserByAPIToken(apiToken: string): Promise<user | null> {
        try {
            return this.prisma.user.findFirst({
                where: {
                    apiToken: apiToken
                }
            });
        } catch (error) {
            throw new Error('Error while finding user.');
        }
    }
}