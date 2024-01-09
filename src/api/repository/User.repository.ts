import {Prisma, PrismaClient, user} from "@prisma/client";

export class UserRepository {

    private prisma: PrismaClient;
    constructor() {
        this.prisma = new PrismaClient();
    }

    async createUser(email: string, hashedPassword: string): Promise<number> {
        try {
            const user: user = await this.prisma.user.create({
                data: {
                    email: email,
                    password: hashedPassword
                }
            });
            return user.UserID;

        } catch (error) {

            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2002')
                    throw new Error('This email is already registered.');
            }

            throw new Error('Error creating user.');
        }
    }

    async findByEmail(email: string): Promise<user | null> {
        try {
            return await this.prisma.user.findFirst({
                where: {
                    email: email
                }
            });

        } catch (error) {
            throw new Error('Error while finding user.');
        }
    }

    async updateRefreshToken(refreshToken: string, userId: number): Promise<void> {
        try {
            await this.prisma.user.update({
                where: {
                    UserID: userId
                },
                data: {
                    refreshToken: refreshToken
                }
            });

        } catch(error) {
            throw new Error('Error while updating refresh token.');
        }
    }

    async findRefreshToken(refreshToken: string): Promise<user | null> {
        try {
            return await this.prisma.user.findFirst({
                where: {
                    refreshToken: refreshToken
                },
            });

        } catch (error) {
            throw new Error('Error while finding refresh token.');
        }
    }

    async deleteRefreshToken(refreshToken: string): Promise<void> {
        try {
            await this.prisma.user.updateMany({
                where: {
                    refreshToken: refreshToken
                },
                data: {
                    refreshToken: null
                }
            });

        } catch (error) {
            throw new Error('Error while deleting refresh token.');
        }

    }

}