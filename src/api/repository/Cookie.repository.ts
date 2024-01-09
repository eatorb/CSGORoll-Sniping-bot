import {PrismaClient} from "@prisma/client";

export class CookieRepository {

    private prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    async insertCookie(encryptedCookie: string, userId: number): Promise<void> {
        try {

            await this.prisma.cookies.create({
                data: {
                    userId: userId,
                    cookie: encryptedCookie
                }
            });

        } catch (error) {
            throw new Error('Error occurred while inserting the cookie');
        }
    }

}