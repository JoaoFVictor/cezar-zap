import Commands from '../../entities/enums/CommandsEnum';
import { MessageService } from '../../../infrastructure/services/MessageService';
import { User } from '../../entities/User';
import { UserExpenseService } from '../../../infrastructure/services/UserExpenseService';
import UserExpenseState from '../../entities/enums/UserExpenseStateEnum';
import { UserTopic } from '../../entities/UserTopic';
import { injectable } from 'tsyringe';

@injectable()
export class UserExpenseInitializeStageUseCase {
  constructor(
    private userExpenseService: UserExpenseService,
    private messageService: MessageService
  ) {}

  async execute(user: User): Promise<{
    currentUserTopic: UserTopic;
    userTopicStack: UserTopic[];
  } | void> {
    await this.userExpenseService.setUserExpenseState(
      user,
      UserExpenseState.AWAITING_EXPENSE_VALUE
    );
    await this.messageService.sendMessage(
      user.phone_number,
      'Por favor o valor da despesa:',
      true,
      `Escreva ${Commands.CREATE} para criar novo tipo de despesa`
    );
    return;
  }
}
