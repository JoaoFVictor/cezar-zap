import CommandsEnum from '../../entities/enums/CommandsEnum';
import { MessageService } from '../../../infrastructure/services/MessageService';
import { User } from '../../entities/User';
import { UserTopicService } from '../../../infrastructure/services/UserTopicService';
import { injectable } from 'tsyringe';

@injectable()
export class UserTopicMessageDisplayUseCase {
    constructor(
        private userTopicService: UserTopicService,
        private messageService: MessageService
    ) {}

    async execute(user: User): Promise<void> {
        const userTopicStage = await this.userTopicService.getUserTopicStage(user);
        if (!userTopicStage) return;

        const response = userTopicStage.userTopicStack.length === 0
            ? userTopicStage.topLevelUserTopics.map(topic => `${topic.option} - ${topic.title}`).join('\n')
            : `${userTopicStage.currentUserTopic!.title}\n${userTopicStage.currentUserTopic!.description}\n\n` + 
              userTopicStage.currentUserTopic!.children?.map(child => `- ${child.option}. ${child.title}`).join('\n');

        await this.messageService.sendMessage(user.phone_number, response.trim(), true, `Escreva ${CommandsEnum.CREATE} para criar um novo tópico`);
    }
}
