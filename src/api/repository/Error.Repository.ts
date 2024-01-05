import {MysqlError, Pool} from "mysql";
import {IError} from "../models/interfaces/IError";
import mysql from "../../shared/config/Config";
class ErrorRepository {
    private connection: Pool;
    constructor() {
        this.connection = mysql.connection;
    }

    async insertError(error: IError): Promise<void> {
        return new Promise<void>((resolve, reject: (reason?: any) => void) => {
            this.connection.query('INSERT INTO errorlogs (`errorMessage`, `status`, `errorCode`, `timestamp`) VALUES ((?), (?), (?), (?))', [error.errorMessage, error.status, error.errorCode, error.timeStamp], (error: MysqlError | null) => {
                if (error) console.log(error)//reject(new Error('Mysql has occured an error'));
                else resolve();
            });
        })
    }
}

export { ErrorRepository }