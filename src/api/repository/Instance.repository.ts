import {MysqlError, Pool} from "mysql";
import mysql from "../../shared/config/Config";
import {IInstance} from "../models/interfaces/IInstance";

export class InstanceRepository {

    private connection: Pool;
    constructor() {
        this.connection = mysql.connection;
    }

    async insertInstance(userId: number, containerId: string, status: string): Promise<void> {
        return new Promise((resolve, reject): void => {
            this.connection.query('INSERT INTO instance (userId, containerId, status) VALUES (?, ?, ?)', [userId, containerId, status], (error: MysqlError | null): void => {
                if (error)
                    reject(new Error('Mysql has occurred an error while trying to insert instance.'));

                resolve();
            });
        });
    }

    async getUserInstance(userId: number): Promise<IInstance | null> {
        return new Promise((resolve, reject): void => {
            this.connection.query('SELECT * FROM instance WHERE userId = (?)', [userId], (error: MysqlError | null, results): void => {
                if (error)
                    reject(new Error('Mysql has occurred an error while trying to get user instance.'));

                const instance: IInstance = results.length > 0 ? results[0] : null;
                resolve(instance);
            });
        });
    }

    async deleteInstance(userId: number, containerId: string): Promise<void> {
        return new Promise((resolve, reject): void => {
            this.connection.query('DELETE FROM instance WHERE userId = (?) AND containerId = (?)', [userId, containerId], (error: MysqlError | null) => {
                if (error)
                    reject(new Error('Mysql has occurred an error while trying to delete an instance.'));

                resolve();
            });
        });
    }

}