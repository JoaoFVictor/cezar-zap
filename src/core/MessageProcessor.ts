import { ActionService } from '../actions/services/ActionService';
import { AuthenticationService } from '../auth/services/AuthenticationService';
import { MenuProcessor } from './MenuProcessor';
import { MenuService } from '../menu/services/MenuService';

export class MessageProcessor {
    constructor(
        private actionService: ActionService,
        private authService: AuthenticationService,
        private menuService: MenuService
    ) {}
    private menuProcessor = new MenuProcessor(this.actionService, this.menuService);

    async processMessage(phoneNumber: string, messageText: string): Promise <string | undefined> {
        const phoneRegister = await this.authService.findByPhoneNumber(phoneNumber);
        if (!phoneRegister) {
            const otp = await this.authService.generateOtp(phoneNumber);
            return `Verifiquei que você não é cadastrado no sistema, seu código de autenticação é ${otp} \nEsse código poderá ser pedido para autenticar você no sistema.\nMe responda com o código de autenticação.`;
        }

        const phoneSession = this.authService.isTokenValid(phoneRegister.token ?? '');
        if (!phoneSession ) {
            const phoneOTPValid = await this.authService.authenticate(phoneNumber, messageText);
            if (!phoneOTPValid) {
                return 'Você não está autenticado, informe seu codigo de autenticação.';
            }
        }

        return this.menuProcessor.processMenuCommand(phoneNumber, messageText);
    }
}
