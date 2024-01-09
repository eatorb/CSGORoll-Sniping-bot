import {CookieRepository} from "../repository/Cookie.repository";
import {EncryptionService} from "./Encryption.service";
import {encryptionSecret} from "../config/Config";

export class CookieService {

    private cookieRepository: CookieRepository;
    private encryptionService: EncryptionService;
    private readonly encryptionSecret: string = encryptionSecret;

    constructor() {
        this.cookieRepository = new CookieRepository();

        this.encryptionService = new EncryptionService(this.encryptionSecret);
    }

    public async saveUserCookie(cookie: string, userId?: number): Promise<void> {
        if (!cookie)
            throw new Error('Cookie has not been provided.');

        if (!userId)
            throw new Error('User not found. Please log in again.');

        const encryptedCookie: string = this.encryptionService.encrypt(cookie);

        await this.cookieRepository.insertCookie(encryptedCookie, userId);
    }
}