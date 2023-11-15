import Commands from '../../entities/enums/CommandsEnum';
import { MessageService } from '../../../infrastructure/services/MessageService';
import { User } from '../../entities/User';
import { UserRevenueInitializeStageUseCase } from './UserRevenueInitializeStageUseCase';
import { UserRevenueService } from '../../../infrastructure/services/UserRevenueService';
import UserRevenueState from '../../entities/enums/UserRevenueStateEnum';
import { UserTopicMessageDisplayUseCase } from '../user-topic/UserTopicMessageDisplayUseCase';
import { injectable } from 'tsyringe';

@injectable()
export class UserRevenueCommandHandlerUseCase {
  constructor(
    private userRevenueService: UserRevenueService,
    private messageService: MessageService,
    private userTopicMessageDisplayUseCase: UserTopicMessageDisplayUseCase,
    private userRevenueInitializeStageUseCase: UserRevenueInitializeStageUseCase
  ) {}

  async execute(user: User, command: string): Promise<void> {
    switch (command) {
      case Commands.BACK:
        await this.goBack(user);
        return;
      case Commands.CREATE:
        await this.userRevenueInitializeStageUseCase.execute(user);
        return;
    }

    const userRevenueState =
      await this.userRevenueService.getUserRevenueState(user);
    switch (userRevenueState) {
      case UserRevenueState.DEFAULT:
        await this.userRevenueInitializeStageUseCase.execute(user);
        break;
      case UserRevenueState.AWAITING_REVENUE_VALUE:
        await this.handleRevenueValueCreation(user, parseFloat(command));
        break;
      case UserRevenueState.AWAITING_REVENUE_DESCRIPTION:
        await this.handleExpenseCreation(user, command);
        break;
    }
  }

  private async handleRevenueValueCreation(
    user: User,
    value: number
  ): Promise<void> {
    await this.userRevenueService.setUserRevenueState(
      user,
      UserRevenueState.AWAITING_REVENUE_DESCRIPTION
    );
    await this.userRevenueService.createTemporaryUserRevenueValue(user, value);
    await this.messageService.sendMessage(
      user.phone_number,
      `Agora, insira uma descrição para a receita:`,
      true,
      `Escreva ${Commands.CREATE} para criar novo tipo de receita`
    );
  }

  private async handleExpenseCreation(
    user: User,
    description: string
  ): Promise<void> {
    if (description === Commands.SKIP) {
      description = '';
    }

    await this.userRevenueService.finalizeUserRevenueCreation(
      user,
      description
    );
    await this.messageService.sendMessage(
      user.phone_number,
      'Sua receita foi criada!',
      true,
      `Escreva ${Commands.CREATE} para criar novo tipo de receita`
    );
    await this.goBack(user);
  }

  private async goBack(user: User): Promise<void> {
    await this.userRevenueService.forgetUserRevenue(user);
    await this.userTopicMessageDisplayUseCase.execute(user);
  }
}
