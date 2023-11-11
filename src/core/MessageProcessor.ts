import { AuthenticateUserUseCase } from '../use-cases/auth/AuthenticateUserUseCase';
import { CacheService } from '../infrastructure/cache/CacheService';
import { GenerateOtpUseCase } from '../use-cases/auth/GenerateOtpUseCase';
import { MenuProcessor } from './MenuProcessor';
import { Message } from '../entities/Message';
import { MessageService } from '../infrastructure/services/MessageService';
import { RefreshTokenUseCase } from '../use-cases/auth/RefreshTokenUseCase';
import { User } from '../entities/User';
import { UserExpenseProcessor } from './UserExpenseProcessor';
import { UserRevenueProcessor } from './UserRevenueProcessor';
import { UserService } from '../infrastructure/services/UserService';
import { UserTopicProcessor } from './UserTopicProcessor';
import { injectable } from 'tsyringe';

@injectable()
export class MessageProcessor {
    constructor(
        private userService: UserService,
        private menuProcessor: MenuProcessor,
        private generateOtpUseCase: GenerateOtpUseCase,
        private authenticateUserUseCase: AuthenticateUserUseCase,
        private refreshTokenUseCase: RefreshTokenUseCase,
        private cacheService: CacheService,
        private userTopicProcessor: UserTopicProcessor,
        private messageService: MessageService,
        private userExpenseProcessor: UserExpenseProcessor,
        private userRevenueProcessor: UserRevenueProcessor,
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
            this.userExpenseProcessor.processUserExpenseCommand(userRegister, content);
            return;
        }
        if (await this.cacheService.has(`user_${userRegister.id}_id_in_revenue`)) {
            this.userRevenueProcessor.processUserRevenueCommand(userRegister, content);
            return;
        }
        if (await this.cacheService.has(`user_${userRegister.id}_id_in_topic_chat`)) {
            this.userTopicProcessor.processUserTopicCommand(userRegister, content);
            return;
        }

        this.menuProcessor.processMenuCommand(userRegister, content);
    }

    private registerMessageReceived(phoneNumber: string, user: User, content: string): void {
        const messageReceived = new Message(phoneNumber, user, content);
        this.messageService.createMessage(messageReceived);
    }
}
