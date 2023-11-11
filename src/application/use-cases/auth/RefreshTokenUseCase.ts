import { TokenService } from "../../../infrastructure/services/TokenService";
import { UserService } from "../../../infrastructure/services/UserService";
import { injectable } from "tsyringe";

@injectable()
export class RefreshTokenUseCase {
    constructor(
        private userService: UserService, 
        private tokenService: TokenService
    ) {}

    async execute(token: string): Promise<string | null> {
        if (this.tokenService.isTokenValid(token)) {
            let decoded = this.tokenService.decodeToken(token);
            if ('exp' in decoded) {
                decoded = {...decoded};
                delete decoded.exp;
            }

            const newToken = this.tokenService.generateToken(decoded);
            const user = await this.userService.findByPhoneNumber(decoded.phoneNumber);
            if (user) {
                user.token = newToken;
                await this.userService.updateUser(user);
            }
            return newToken;
        }
        return null;
    }
}
