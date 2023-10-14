import { TokenService } from "../../infrastructure/services/TokenService";
import { UserService } from "../../infrastructure/services/UserService";
import { injectable } from "tsyringe";

@injectable()
export class AuthenticateUserUseCase {
    constructor(
        private userService: UserService, 
        private tokenService: TokenService
    ) {}

    async execute(phoneNumber: string, otp: string): Promise<{isAuthenticated: boolean, token?: string}> {
        const user = await this.userService.findByPhoneNumber(phoneNumber);
        if (user && user.otp === otp) {
            user.is_authenticated = true;
            user.otp = undefined;

            const token = this.tokenService.generateToken({phoneNumber: user.phone_number});
            user.token = token;
            await this.userService.updateUser(user);
            return { isAuthenticated: true, token };
        }
        return { isAuthenticated: false };
    }
}
