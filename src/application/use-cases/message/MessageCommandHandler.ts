import { AuthenticateUserUseCase } from '../auth/AuthenticateUserUseCase';
import { CacheService } from '../../../infrastructure/cache/CacheService';
import { GenerateOtpUseCase } from '../auth/GenerateOtpUseCase';
import { MenuCommandHandler } from '../menu/MenuCommandHandler';
import { Message } from '../../entities/Message';
import { MessageService } from '../../../infrastructure/services/MessageService';
import { RefreshTokenUseCase } from '../auth/RefreshTokenUseCase';
import { User } from '../../entities/User';
import { UserExpenseCommandHandler } from '../user-expense/UserExpenseCommandHandler';
import { UserRevenueCommandHandler } from '../user-revenue/UserRevenueCommandHandler';
import { UserService } from '../../../infrastructure/services/UserService';
import { UserTopicCommandHandler } from '../user-topic/UserTopicCommandHandler';
import { injectable } from 'tsyringe';

@injectable()
export class MessageCommandHandler {
    constructor(
        private userService: UserService,
        private menuCommand: MenuCommandHandler,
        private generateOtpUseCase: GenerateOtpUseCase,
        private authenticateUserUseCase: AuthenticateUserUseCase,
        private refreshTokenUseCase: RefreshTokenUseCase,
        private cacheService: CacheService,
        private userTopicCommand: UserTopicCommandHandler,
        private messageService: MessageService,
        private userExpenseCommand: UserExpenseCommandHandler,
        private userRevenueCommand: UserRevenueCommandHandler
    ) {}

    public async processMessage(phoneNumber: string, content: string): Promise <void> {
        const userRegister = await this.userService.findByPhoneNumber(phoneNumber);
        if (!userRegister) {
            const otp = await this.generateOtpUseCase.execute(phoneNumber);
            const response = `Verifiquei que você não é cadastrado no sistema, seu código de autenticação é ${otp} \nEsse código poderá ser pedido para autenticar você no sistema.\nMe responda com o código de autenticação.`;
            this.messageService.sendMessage(phoneNumber, response);
            return;
        }

        this.registerMessageReceived(phoneNumber, userRegister, content);
        const isTokenValid = userRegister.token ? await this.refreshTokenUseCase.execute(userRegister.token) : false;
        if (!isTokenValid) {
            const { isAuthenticated } = await this.authenticateUserUseCase.execute(phoneNumber, content);
            if (!isAuthenticated) {
                const response = 'Você não está autenticado, informe seu codigo de autenticação.';
                this.messageService.sendMessage(phoneNumber, response);
                return;
            }
        }

        if (await this.cacheService.has(`user_${userRegister.id}_id_in_expensive`)) {
            this.userExpenseCommand.processUserExpenseCommand(userRegister, content);
            return;
        }
        if (await this.cacheService.has(`user_${userRegister.id}_id_in_revenue`)) {
            this.userRevenueCommand.processUserRevenueCommand(userRegister, content);
            return;
        }
        if (await this.cacheService.has(`user_${userRegister.id}_id_in_topic_chat`)) {
            this.userTopicCommand.processUserTopicCommand(userRegister, content);
            return;
        }

        this.menuCommand.processMenuCommand(userRegister, content);
    }

    private registerMessageReceived(phoneNumber: string, user: User, content: string): void {
        const messageReceived = new Message(phoneNumber, user, content);
        this.messageService.createMessage(messageReceived);
    }
}
