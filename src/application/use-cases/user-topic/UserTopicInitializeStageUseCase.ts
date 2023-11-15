import { User } from '../../entities/User';
import { UserTopicMessageDisplayUseCase } from './UserTopicMessageDisplayUseCase';
import { UserTopicPromptCreateTopicUseCase } from './UserTopicPromptCreateTopicUseCase';
import { UserTopicService } from '../../../infrastructure/services/UserTopicService';
import { injectable } from 'tsyringe';

@injectable()
export class UserTopicInitializeStageUseCase {
  constructor(
    private userTopicService: UserTopicService,
    private userTopicMessageDisplayUseCase: UserTopicMessageDisplayUseCase,
    private userTopicPromptCreateTopicUseCase: UserTopicPromptCreateTopicUseCase
  ) {}

  async execute(user: User): Promise<void> {
    const topLevelUserTopics =
      await this.userTopicService.getMainUserTopics(user);
    const userTopicStage = {
      topLevelUserTopics: topLevelUserTopics,
      currentUserTopic:
        topLevelUserTopics.length > 0 ? topLevelUserTopics[0] : null,
      userTopicStack: [],
    };
    await this.userTopicService.setUserTopicStage(user, userTopicStage);
    if (!userTopicStage.currentUserTopic) {
      await this.userTopicPromptCreateTopicUseCase.execute(user);
      return;
    }
    await this.userTopicMessageDisplayUseCase.execute(user);
  }
}
