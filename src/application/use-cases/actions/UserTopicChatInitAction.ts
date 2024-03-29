import { container, injectable } from 'tsyringe';

import { Action } from '../../entities/Action';
import { CacheService } from '../../../infrastructure/cache/CacheService';
import { CacheTimes } from '../../../config/CacheTimes';
import { User } from '../../entities/User';
import { UserTopicInitializeStageUseCase } from '../user-topic/UserTopicInitializeStageUseCase';

@injectable()
export class UserTopicChatInitAction extends Action {
  private userTopicInitializeStageUseCase: UserTopicInitializeStageUseCase;

  constructor(description: string, action_type?: string, cacheService?: CacheService | null) {
    super(description, action_type, cacheService);
    this.userTopicInitializeStageUseCase = container.resolve(UserTopicInitializeStageUseCase);
  }

  async execute(user: User): Promise<string | void> {
    await this.cacheService?.put(`user_${user.id}_id_in_topic_chat`, true, CacheTimes.ONE_DAY);
    await this.userTopicInitializeStageUseCase.execute(user);
  }
}
