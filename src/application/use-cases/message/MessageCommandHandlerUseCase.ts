import { AuthenticateUserUseCase } from '../auth/AuthenticateUserUseCase';
import { CacheService } from '../../../infrastructure/cache/CacheService';
import { GenerateOtpUseCase } from '../auth/GenerateOtpUseCase';
import { MenuCommandHandlerUseCase } from '../menu/MenuCommandHandlerUseCase';
import { Message } from '../../entities/Message';
import { MessageService } from '../../../infrastructure/services/MessageService';
import { RefreshTokenUseCase } from '../auth/RefreshTokenUseCase';
import { User } from '../../entities/User';
import { UserExpenseCommandHandlerUseCase } from '../user-expense/UserExpenseCommandHandlerUseCase';
import { UserRevenueCommandHandlerUseCase } from '../user-revenue/UserRevenueCommandHandlerUseCase';
import { UserService } from '../../../infrastructure/services/UserService';
import { UserTopicCommandHandlerUseCase } from '../user-topic/UserTopicCommandHandlerUseCase';
import { injectable } from 'tsyringe';

@injectable()
export class MessageCommandHandlerUseCase {
  constructor(
    private userService: UserService,
    private menuCommandHandlerUseCase: MenuCommandHandlerUseCase,
    private generateOtpUseCase: GenerateOtpUseCase,
    private authenticateUserUseCase: AuthenticateUserUseCase,
    private refreshTokenUseCase: RefreshTokenUseCase,
    private cacheService: CacheService,
    private userTopicCommandHandlerUseCase: UserTopicCommandHandlerUseCase,
    private messageService: MessageService,
    private userExpenseCommandHandlerUseCase: UserExpenseCommandHandlerUseCase,
    private userRevenueCommandHandlerUseCase: UserRevenueCommandHandlerUseCase
  ) {}

  async execute(phoneNumber: string, content: string): Promise<void> {
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
      this.userExpenseCommandHandlerUseCase.execute(userRegister, content);
      return;
    }
    if (await this.cacheService.has(`user_${userRegister.id}_id_in_revenue`)) {
      this.userRevenueCommandHandlerUseCase.execute(userRegister, content);
      return;
    }
    if (await this.cacheService.has(`user_${userRegister.id}_id_in_get_expensive_data`)) {
      this.userExpenseCommandHandlerUseCase.execute(userRegister, content);
      return;
    }
    if (await this.cacheService.has(`user_${userRegister.id}_id_in_get_revenue_data`)) {
      this.userRevenueCommandHandlerUseCase.execute(userRegister, content);
      return;
    }
    if (await this.cacheService.has(`user_${userRegister.id}_id_in_topic_chat`)) {
      this.userTopicCommandHandlerUseCase.execute(userRegister, content);
      return;
    }

    this.menuCommandHandlerUseCase.execute(userRegister, content);
  }

  private registerMessageReceived(phoneNumber: string, user: User, content: string): void {
    const messageReceived = new Message(phoneNumber, user, content);
    this.messageService.createMessage(messageReceived);
  }
}
