import CommandsEnum from '../../entities/enums/CommandsEnum';
import { MessageService } from '../../../infrastructure/services/MessageService';
import { User } from '../../entities/User';
import { UserTopicService } from '../../../infrastructure/services/UserTopicService';
import UserTopicStateEnum from '../../entities/enums/UserTopicStateEnum';
import { injectable } from 'tsyringe';

@injectable()
export class UserTopicPromptCreateTopicUseCase {
  constructor(
    private userTopicService: UserTopicService,
    private messageService: MessageService
  ) {}

  async execute(user: User): Promise<void> {
    await this.userTopicService.setUserTopicState(
      user,
      UserTopicStateEnum.AWAITING_TOPIC_TITLE
    );
    await this.messageService.sendMessage(
      user.phone_number,
      'Por favor, insira um título para o seu novo tópico:',
      true,
      `Escreva ${CommandsEnum.CREATE} para criar um novo tópico`
    );
  }
}
