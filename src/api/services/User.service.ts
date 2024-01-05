import {UserRepository} from "../repository/User.repository";
import {IUser} from "../models/interfaces/IUser";
import {jwtRefreshSecret, jwtSecret} from "../../shared/config/Config";
import {isSQLInjections} from "../../shared/utilities/restUtils";
import bcrypt from 'bcrypt';
import jwt, {JwtPayload} from "jsonwebtoken";
import {PasswordValidationService} from "./PasswordValidation.service";

export class UserService {

    private userRepository: UserRepository;

    constructor() {
        this.userRepository = new UserRepository();
    }

    async registerUser(email: string, password: string, termsAccepted: boolean): Promise<{accessToken: string, refreshToken: string}> {
        if (isSQLInjections(email, password))
            throw new Error('An unexpected error has occurred.');

        if (!termsAccepted)
            throw new Error('You have to accept our terms of service.');

        const user: IUser | null = await this.userRepository.findByEmail(email);

        if (user)
            throw new Error('User with this email has been already registered, please use another email.');

        PasswordValidationService.validate(password);

        const hashedPassword: string = await bcrypt.hash(password, 10);

        const userId: number = await this.userRepository.createUser(email, hashedPassword);

        const refreshToken: string = this.generateRefreshToken(userId);

        await this.userRepository.saveRefreshToken(refreshToken, userId);

        const accessToken: string = jwt.sign({ userId: userId }, jwtSecret, { expiresIn: '15m' });
        return {accessToken, refreshToken};
    }

    async loginUser(email: string, password: string, remember: boolean): Promise<{accessToken: string, refreshToken: string}> {
        if (isSQLInjections(email, password))
            throw new Error('An unexpected error has occurred.');

        const user: IUser | null = await this.userRepository.findByEmail(email);

        if (!user || !(await bcrypt.compare(password, user.password)))
            throw new Error('Invalid credentials');

        const refreshToken: string = this.generateRefreshToken(user.userId!);

        await this.userRepository.saveRefreshToken(refreshToken, user.userId!);

        const expiresIn: string = remember ? '1d' : '15m';

        const accessToken: string = jwt.sign({ userId: user.userId }, jwtSecret, { expiresIn });

        return {accessToken, refreshToken};
    }
    async refreshToken(refreshToken: string): Promise<{accessToken: string}> {

        if (isSQLInjections(refreshToken))
            throw new Error('Invalid token format.');

        const token: string | null = await this.userRepository.findRefreshToken(refreshToken);

        if (!token)
            throw new Error('Refresh token not found. Please log in again.');

        try {

            const decoded: jwt.JwtPayload = jwt.verify(refreshToken, jwtRefreshSecret) as JwtPayload;

            if (!decoded.userId)
                throw new Error('Invalid token payload.');

            const accessToken: string = jwt.sign({ userId: decoded.userId }, jwtSecret, { expiresIn: '15m' });

            return {accessToken};

        } catch (error) {
            throw new Error('Invalid refresh token. Please log in again.')
        }
    }

    async logoutUser(refreshToken: string): Promise<void> {

        if (isSQLInjections(refreshToken))
            throw new Error('Invalid token format.');

        await this.userRepository.removeRefreshToken(refreshToken);

    }

    private generateRefreshToken(userId: number): string {
        return jwt.sign({ userId: userId }, jwtRefreshSecret, {expiresIn: '30d'});
    }
}