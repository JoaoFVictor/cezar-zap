import Commands from '../../entities/enums/CommandsEnum';
import { MessageService } from '../../../infrastructure/services/MessageService';
import { User } from '../../entities/User';
import { UserRevenueService } from '../../../infrastructure/services/UserRevenueService';
import UserRevenueStateEnum from '../../entities/enums/UserRevenueStateEnum';
import { UserTopic } from '../../entities/UserTopic';
import { injectable } from 'tsyringe';

@injectable()
export class UserRevenueInitializeStageUseCase {
  constructor(
    private userRevenueService: UserRevenueService,
    private messageService: MessageService
  ) {}

  async execute(user: User): Promise<{
    currentUserTopic: UserTopic;
    userTopicStack: UserTopic[];
  } | void> {
    await this.userRevenueService.setUserRevenueState(
      user,
      UserRevenueStateEnum.AWAITING_REVENUE_VALUE
    );
    await this.messageService.sendMessage(
      user.phone_number,
      'Por favor o valor da receita:',
      true,
      `Escreva ${Commands.CREATE} para criar novo tipo de receita`
    );
    return;
  }
}
