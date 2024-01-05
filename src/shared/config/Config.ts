import mysql, { Pool } from 'mysql';

// TODO: refactor this shit
if (!process.env.ENC_SECRET_KEY)
    throw new Error('ENC_SECRET_KEY is not defined in environment variables!');

if (!process.env.EMPIRE_API_KEY)
    throw new Error('EMPIRE_API_KEY is not defined in environment variables!');

if (!process.env.JWT_SECRET)
    throw new Error('JWT_SECRET is not defined in environment variables!');

if (!process.env.DB_HOST)
    throw new Error('DB_HOST is not defined in environment variables!');

if (!process.env.DB_USER)
    throw new Error('DB_USER is not defined in environment variables!');

if (!process.env.DB_PASSWORD)
    throw new Error('DB_PASSWORD is not defined in environment variables!');

if (!process.env.DB_DATABASE)
    throw new Error('DB_DATABASE is not defined in environment variables!');

if (!process.env.DB_PORT)
    throw new Error('DB_PORT is not defined in environment variables!');

if (!process.env.JWT_REFRESH_SECRET)
    throw new Error('JWT_REFRESH_SECRET is not defined in environment variables!');


export const connection: Pool = mysql.createPool({
    host: '192.168.88.232',
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    connectionLimit: 1000
});
export const encryptionSecret: string = process.env.ENC_SECRET_KEY;
export const jwtSecret: string = process.env.JWT_SECRET;
export const jwtRefreshSecret: string = process.env.JWT_REFRESH_SECRET;

export const refreshTokenCookie: Object = {
    httpOnly: true,
    secure: false,
    maxAge: 30 * 24 * 60 * 60 * 1000,
    sameSite: 'strict'
}

export const accessTokenCookie: Object = {
    httpOnly: true,
    secure: false,
    maxAge: 900000,
    sameSite: 'strict'
}

export default {
    encryptionSecret, connection, jwtSecret, jwtRefreshSecret, refreshTokenCookie
}