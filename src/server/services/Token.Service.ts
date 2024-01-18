import {UserRepository} from "../repository/User.Repository";
import {user} from "@prisma/client";

export class TokenService {

    private userRepository: UserRepository;
    constructor() {
        this.userRepository = new UserRepository();
    }

    async validateToken(apiToken: string): Promise<boolean> {
        try {
            const user: user | null = await this.userRepository.findUserByAPIToken(apiToken);

            return user !== null;

        } catch (error) {
            return false;
        }
    }
}