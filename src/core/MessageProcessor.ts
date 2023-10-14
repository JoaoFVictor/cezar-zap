import { AuthenticateUserUseCase } from '../use-cases/auth/AuthenticateUserUseCase';
import { GenerateOtpUseCase } from '../use-cases/auth/GenerateOtpUseCase';
import { MenuProcessor } from './MenuProcessor';
import { RefreshTokenUseCase } from '../use-cases/auth/RefreshTokenUseCase';
import { UserService } from '../infrastructure/services/UserService';
import { injectable } from 'tsyringe';

@injectable()
export class MessageProcessor {
    constructor(
        private userService: UserService,
        private menuProcessor: MenuProcessor,
        private generateOtpUseCase: GenerateOtpUseCase,
        private authenticateUserUseCase: AuthenticateUserUseCase,
        private refreshTokenUseCase: RefreshTokenUseCase,
    ) {}

    async processMessage(phoneNumber: string, messageText: string): Promise <string | undefined> {
        const phoneRegister = await this.userService.findByPhoneNumber(phoneNumber);
        if (!phoneRegister) {
            const otp = await this.generateOtpUseCase.execute(phoneNumber);
            return `Verifiquei que você não é cadastrado no sistema, seu código de autenticação é ${otp} \nEsse código poderá ser pedido para autenticar você no sistema.\nMe responda com o código de autenticação.`;
        }

        const isTokenValid = phoneRegister.token ? this.refreshTokenUseCase.execute(phoneRegister.token) : false;
        if (!isTokenValid) {
            const { isAuthenticated } = await this.authenticateUserUseCase.execute(phoneNumber, messageText);
            if (!isAuthenticated) {
                return 'Você não está autenticado, informe seu codigo de autenticação.';
            }
        }

        return this.menuProcessor.processMenuCommand(phoneNumber, messageText);
    }
}
