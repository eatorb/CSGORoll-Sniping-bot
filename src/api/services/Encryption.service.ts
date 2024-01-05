import * as crypto from "crypto";
export class EncryptionService {

    private algorithm: string =  'aes-256-cbc';
    private readonly secretKey: Buffer;
    private readonly iv: Buffer;

    constructor(secretKey: string) {
        this.secretKey = Buffer.from(secretKey, 'hex');
        this.iv = crypto.randomBytes(16);
    }
    encrypt(text: string): string {
        const cipher: crypto.Cipher = crypto.createCipheriv(this.algorithm, this.secretKey, this.iv);
        const encrypted: Buffer = Buffer.concat([cipher.update(text), cipher.final()]);
        return `${this.iv.toString('hex')}:${encrypted.toString('hex')}`;
    }

    decrypt(text: string): string {
        const textParts = text.split(':');
        const iv = Buffer.from(textParts.shift()!, 'hex');
        const encryptedText = Buffer.from(textParts.join(':'), 'hex');
        const decipher = crypto.createDecipheriv(this.algorithm, this.secretKey, iv);
        const decrypted = Buffer.concat([decipher.update(encryptedText), decipher.final()]);
        return decrypted.toString();
    }
}