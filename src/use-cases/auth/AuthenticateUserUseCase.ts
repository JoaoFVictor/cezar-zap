import { TokenService } from "../../infrastructure/services/TokenService";
import { UserRepository } from "../../infrastructure/repositories/UserRepository";
import { injectable } from "tsyringe";

@injectable()
export class AuthenticateUserUseCase {
    constructor(
        private userRepository: UserRepository, 
        private tokenService: TokenService
    ) {}

    async execute(phoneNumber: string, otp: string): Promise<{isAuthenticated: boolean, token?: string}> {
        const user = await this.userRepository.findByPhoneNumber(phoneNumber);
        if (user && user.otp === otp) {
            user.is_authenticated = true;
            user.otp = undefined;

            const token = this.tokenService.generateToken({phoneNumber: user.phone_number});
            user.token = token;
            await this.userRepository.updateUser(user);
            return { isAuthenticated: true, token };
        }
        return { isAuthenticated: false };
    }
}
