import Commands from '../../entities/enums/CommandsEnum';
import { MessageService } from '../../../infrastructure/services/MessageService';
import { User } from '../../entities/User';
import { UserExpenseInitializeStageUseCase } from './UserExpenseInitializeStageUseCase';
import { UserExpenseService } from '../../../infrastructure/services/UserExpenseService';
import UserExpenseState from '../../entities/enums/UserExpenseStateEnum';
import { UserTopicMessageDisplayUseCase } from '../user-topic/UserTopicMessageDisplayUseCase';
import { injectable } from 'tsyringe';

@injectable()
export class UserExpenseCommandHandlerUseCase {
  constructor(
    private userExpenseService: UserExpenseService,
    private messageService: MessageService,
    private userExpenseInitializeStageUseCase: UserExpenseInitializeStageUseCase,
    private userTopicMessageDisplayUseCase: UserTopicMessageDisplayUseCase
  ) {}

  async execute(user: User, command: string): Promise<void> {
    switch (command) {
      case Commands.BACK:
        await this.goBack(user);
        return;
      case Commands.CREATE:
        await this.userExpenseInitializeStageUseCase.execute(user);
        return;
    }

    const userExpenseState =
      await this.userExpenseService.getUserExpenseState(user);
    switch (userExpenseState) {
      case UserExpenseState.DEFAULT:
        await this.userExpenseInitializeStageUseCase.execute(user);
        break;
      case UserExpenseState.AWAITING_EXPENSE_VALUE:
        await this.handleExpenseValueCreation(user, parseFloat(command));
        break;
      case UserExpenseState.AWAITING_EXPENSE_DESCRIPTION:
        await this.handleExpenseCreation(user, command);
        break;
    }
  }

  private async handleExpenseValueCreation(
    user: User,
    value: number
  ): Promise<void> {
    await this.userExpenseService.setUserExpenseState(
      user,
      UserExpenseState.AWAITING_EXPENSE_DESCRIPTION
    );
    await this.userExpenseService.createTemporaryUserExpenseValue(user, value);
    await this.messageService.sendMessage(
      user.phone_number,
      `Agora, insira uma descrição para a despesa`,
      true,
      `Escreva ${Commands.CREATE} para criar novo tipo de despesa`
    );
  }

  private async handleExpenseCreation(
    user: User,
    description: string
  ): Promise<void> {
    if (description === Commands.SKIP) {
      description = '';
    }

    await this.userExpenseService.finalizeUserExpenseCreation(
      user,
      description
    );
    await this.messageService.sendMessage(
      user.phone_number,
      'Sua despesa foi criada!',
      true,
      `Escreva ${Commands.CREATE} para criar novo tipo de despesa`
    );
  }

  private async goBack(user: User): Promise<void> {
    await this.userExpenseService.forgetUserExpense(user);
    await this.userTopicMessageDisplayUseCase.execute(user);
  }
}
