import {MysqlError, Pool} from "mysql";
import mysql from "../../shared/config/Config";
import {IUser} from "../models/interfaces/IUser";

export class UserRepository {
    private connection: Pool;
    constructor() {
        this.connection = mysql.connection;
    }

    async createUser(email: string, hashedPassword: string): Promise<number> {
        return new Promise((resolve, reject): void => {
            this.connection.query('INSERT INTO user (email, password) VALUES ((?), (?))', [email, hashedPassword], (error: MysqlError | null, results): void => {
                if (error)
                    reject(new Error('Mysql has occurred an error while registering.'));

                // get the user id
                resolve(results.insertId);
            });
        });
    }

    async findByEmail(email: string): Promise<IUser | null> {
        return new Promise((resolve, reject): void => {
            this.connection.query('SELECT * FROM user WHERE email = (?)', [email], (error: MysqlError | null, results): void => {
                if (error)
                    reject(new Error('Mysql has occurred an error while finding an email.'));

                resolve(results.length > 0 ? results[0] : null);
            });
        });
    }

    async saveRefreshToken(refreshToken: string, userId: number): Promise<void> {
        return new Promise((resolve, reject): void => {
            this.connection.query('UPDATE user SET refreshToken = (?) WHERE UserID = (?)', [refreshToken, userId], (error: MysqlError | null): void => {
                if (error)
                    reject(new Error('Mysql has occurred an error while trying to refresh token.'));

                resolve();
            });
        });
    }

    async findRefreshToken(refreshToken: string): Promise<string | null> {
        return new Promise((resolve, reject): void => {
            this.connection.query('SELECT refreshToken FROM user WHERE refreshToken = (?)', [refreshToken], (error: MysqlError | null, results): void => {
                if (error)
                    reject(new Error('Mysql has occured an error while trying to find refresh token.'));

                resolve(results.length > 0 ? results[0].refreshToken : null);
            });
        });
    }

    async removeRefreshToken(refreshToken: string): Promise<void> {
        return new Promise((resolve, reject) => {
            this.connection.query('UPDATE user SET refreshToken = NULL WHERE refreshToken = (?)', [refreshToken], (error: MysqlError | null): void => {
                if (error)
                    reject(new Error('Mysql has occurred an error while trying to delete refresh token.'));

                resolve();
            });
        });
    }



}