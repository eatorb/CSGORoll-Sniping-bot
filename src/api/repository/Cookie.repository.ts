import {cookies, PrismaClient} from "@prisma/client";

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

    async getUserCookie(userId: number): Promise<cookies | null> {
        try {
            return await this.prisma.cookies.findFirst({
                where: {
                    userId: userId
                }
            })
        } catch (error) {
            throw new Error('Error occurred while getting users cookie.');
        }
    }

}