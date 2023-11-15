import { ActionService } from '../../../infrastructure/services/ActionService';
import Actions from '../../entities/enums/ActionsEnum';
import CommandsEnum from '../../entities/enums/CommandsEnum';
import { ExecuteAction } from '../actions/ExecuteAction';
import { MessageService } from '../../../infrastructure/services/MessageService';
import { User } from '../../entities/User';
import { UserMenuInitializeStageUseCase } from '../menu/UserMenuInitializeStageUseCase';
import { UserTopic } from '../../entities/UserTopic';
import { UserTopicInitializeStageUseCase } from './UserTopicInitializeStageUseCase';
import { UserTopicMessageDisplayUseCase } from './UserTopicMessageDisplayUseCase';
import { UserTopicPromptCreateTopicUseCase } from './UserTopicPromptCreateTopicUseCase';
import { UserTopicService } from '../../../infrastructure/services/UserTopicService';
import UserTopicState from '../../entities/enums/UserTopicStateEnum';
import { injectable } from 'tsyringe';

@injectable()
export class UserTopicCommandHandlerUseCase {
  constructor(
    private userTopicService: UserTopicService,
    private messageService: MessageService,
    private actionService: ActionService,
    private executeAction: ExecuteAction,
    private userMenuInitializeStageUseCase: UserMenuInitializeStageUseCase,
    private userTopicMessageDisplayUseCase: UserTopicMessageDisplayUseCase,
    private userTopicPromptCreateTopicUseCase: UserTopicPromptCreateTopicUseCase,
    private userTopicInitializeStageUseCase: UserTopicInitializeStageUseCase
  ) {}

  async execute(user: User, command: string): Promise<void> {
    const userTopicState = await this.userTopicService.getUserTopicState(user);
    switch (userTopicState) {
      case UserTopicState.AWAITING_TOPIC_TITLE:
        await this.handleTopicTitleInput(user, command);
        break;
      case UserTopicState.AWAITING_TOPIC_OPTION:
        await this.handleTopicOptionInput(user, command);
        break;
      case UserTopicState.AWAITING_TOPIC_ACTION:
        await this.handleTopicActionInput(user, command);
        break;
      case UserTopicState.AWAITING_TOPIC_DESCRIPTION:
        await this.handleTopicDescriptionInput(user, command);
        break;
      default:
        await this.handleOtherCommands(user, command);
        break;
    }
  }

  private async handleTopicTitleInput(
    user: User,
    title: string
  ): Promise<void> {
    const userTopic = new UserTopic(title, 'temp');
    await this.userTopicService.setTemporaryUserTopic(user, userTopic);
    await this.userTopicService.setUserTopicState(
      user,
      UserTopicState.AWAITING_TOPIC_OPTION
    );
    await this.messageService.sendMessage(
      user.phone_number,
      `Insira a opção para o seu tópico:`,
      true,
      `Escreva ${CommandsEnum.CREATE} para criar um novo tópico`
    );
  }

  private async handleTopicOptionInput(
    user: User,
    option: string
  ): Promise<void> {
    const userTopic = await this.userTopicService.getTemporaryUserTopic(user);
    if (!userTopic) {
      throw new Error('Temporary user topic not found.');
    }
    userTopic.option = option;
    await this.userTopicService.setTemporaryUserTopic(user, userTopic);
    await this.userTopicService.setUserTopicState(
      user,
      UserTopicState.AWAITING_TOPIC_ACTION
    );
    await this.messageService.sendMessage(
      user.phone_number,
      `Seu tópico vai ser de despesa ou receita? (Escreva '${Actions.REVENUE}' para despesa ou '${Actions.EXPENSE}' para receita)`
    );
  }

  private async handleTopicActionInput(
    user: User,
    option: string
  ): Promise<void> {
    const userTopic = await this.userTopicService.getTemporaryUserTopic(user);
    if (!userTopic) {
      throw new Error('Temporary user topic not found.');
    }

    const action =
      option == Actions.REVENUE
        ? await this.actionService.findByType('user-revenue-init')
        : await this.actionService.findByType('user-expense-init');
    if (!action) {
      await this.messageService.sendMessage(
        user.phone_number,
        `Insira uma opção valida.`,
        true,
        `Escreva ${CommandsEnum.CREATE} para criar um novo tópico`
      );
      return;
    }

    userTopic.action = action;
    await this.userTopicService.setTemporaryUserTopic(user, userTopic);
    await this.userTopicService.setUserTopicState(
      user,
      UserTopicState.AWAITING_TOPIC_DESCRIPTION
    );
    await this.messageService.sendMessage(
      user.phone_number,
      `Insira uma descrição para o seu tópico (ou digite '${CommandsEnum.SKIP}' se quiser pular a descrição):`,
      true,
      `Escreva ${CommandsEnum.CREATE} para criar um novo tópico`
    );
  }

  private async handleTopicDescriptionInput(
    user: User,
    description: string
  ): Promise<void> {
    if (description.toUpperCase() === CommandsEnum.SKIP) {
      description = '';
    }
    const topic = await this.userTopicService.finalizeTopicCreation(
      user,
      description
    );
    await this.userTopicService.setUserTopicState(user, UserTopicState.DEFAULT);
    await this.messageService.sendMessage(
      user.phone_number,
      `Seu tópico "${topic.title}" foi criado!`,
      true,
      `Escreva ${CommandsEnum.CREATE} para criar um novo tópico`
    );
    await this.userTopicInitializeStageUseCase.execute(user);
  }

  private async handleOtherCommands(
    user: User,
    command: string
  ): Promise<void> {
    const userTopicStage = await this.userTopicService.getUserTopicStage(user);
    if (!userTopicStage) {
      await this.userTopicInitializeStageUseCase.execute(user);
      return;
    }

    switch (command.toUpperCase()) {
      case CommandsEnum.BACK:
        await this.goBack(user);
        break;
      case CommandsEnum.RESTART:
        await this.userTopicInitializeStageUseCase.execute(user);
        await this.userMenuInitializeStageUseCase.execute(user);
        break;
      case CommandsEnum.CREATE:
        await this.userTopicPromptCreateTopicUseCase.execute(user);
        break;
      default:
        await this.processSelectedOption(user, command);
        break;
    }
  }

  private async goBack(user: User): Promise<void> {
    const userTopicStage = await this.userTopicService.getUserTopicStage(user);
    if (!userTopicStage || userTopicStage.userTopicStack.length === 0) {
      await this.messageService.sendMessage(
        user.phone_number,
        'Você já está no início.',
        true,
        `Escreva ${CommandsEnum.CREATE} para criar um novo tópico`
      );
      return;
    }
    userTopicStage.currentUserTopic = userTopicStage.userTopicStack.pop()!;
    await this.userTopicService.setUserTopicStage(user, userTopicStage);
    await this.userTopicMessageDisplayUseCase.execute(user);
  }

  private async processSelectedOption(
    user: User,
    command: string
  ): Promise<void> {
    const userTopicStage = await this.userTopicService.getUserTopicStage(user);
    if (!userTopicStage) {
      await this.messageService.sendMessage(
        user.phone_number,
        'Opção inválida. Selecione uma opção válida.',
        true,
        `Escreva ${CommandsEnum.CREATE} para criar um novo tópico`
      );
      return;
    }

    const selectedTopic =
      userTopicStage.userTopicStack.length === 0
        ? await this.userTopicService.findTopLevelTopicByOption(user, command)
        : await this.userTopicService.findChildTopicByOption(
            user,
            userTopicStage.currentUserTopic!,
            command
          );

    if (!selectedTopic) {
      await this.messageService.sendMessage(
        user.phone_number,
        'Opção inválida. Selecione uma opção válida.',
        true,
        `Escreva ${CommandsEnum.CREATE} para criar um novo tópico`
      );
      return;
    }

    userTopicStage.userTopicStack.push(userTopicStage.currentUserTopic!);
    userTopicStage.currentUserTopic = selectedTopic;
    await this.userTopicService.setUserTopicStage(user, userTopicStage);
    await this.userTopicMessageDisplayUseCase.execute(user);

    if (!selectedTopic.action) return;

    const actionResponse = await this.executeAction.execute(
      selectedTopic.action.id,
      user
    );
    if (actionResponse) {
      await this.messageService.sendMessage(
        user.phone_number,
        actionResponse,
        true,
        `Escreva ${CommandsEnum.CREATE} para criar um novo tópico`
      );
    }
  }
}
