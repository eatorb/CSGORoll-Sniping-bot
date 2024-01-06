import {instance, PrismaClient} from "@prisma/client";

export class InstanceRepository {

    private prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    async insertInstance(userId: number, containerId: string, status: string): Promise<void> {
        try {
            await this.prisma.instance.create({
                data: {
                    userId: userId,
                    containerId: containerId,
                    status: status
                }
            });
        } catch (error) {
            throw new Error('Error while creating a new instance.');
        }
    }

    async getUserInstance(userId: number): Promise<instance | null> {
        try {
            return await this.prisma.instance.findFirst({
                where: {
                    userId: userId
                }
            });
        } catch (error) {
            throw new Error('Error while finding an instance.');
        }

    }

    async deleteInstance(userId: number, containerId: string): Promise<void> {
        try {
            await this.prisma.instance.deleteMany({
                where: {
                    AND: [
                        { userId: userId },
                        { containerId: containerId }
                    ]
                }
            })

        } catch (error) {
            throw new Error('Error while deleting an instance.');
        }
    }
}