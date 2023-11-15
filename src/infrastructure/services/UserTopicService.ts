import { CacheService } from '../cache/CacheService';
import { CacheTimes } from '../../config/CacheTimes';
import { User } from '../../application/entities/User';
import { UserTopic } from '../../application/entities/UserTopic';
import { UserTopicRepository } from '../repositories/UserTopicRepository';
import UserTopicState from '../../application/entities/enums/UserTopicStateEnum';
import { injectable } from 'tsyringe';

@injectable()
export class UserTopicService {
  constructor(
    private userTopicRepository: UserTopicRepository,
    private cacheService: CacheService
  ) {}

  public async createUserTopic(
    userTopic: UserTopic
  ): Promise<UserTopic | null> {
    const newUserTopic =
      await this.userTopicRepository.createUserTopic(userTopic);
    await this.cacheService.forget(
      `get_main_user_topics_by_user_${userTopic.user?.id}`
    );
    return newUserTopic;
  }

  public async updateUserTopic(
    userTopic: UserTopic
  ): Promise<UserTopic | null> {
    const userTopicUpdated =
      await this.userTopicRepository.updateUserTopic(userTopic);
    await this.cacheService.put(
      `get_user_topic_by_id_${userTopic.id}`,
      userTopicUpdated,
      CacheTimes.ONE_DAY
    );
    await this.cacheService.forget(
      `get_main_user_topics_by_user_${userTopic.user?.id}`
    );

    return userTopicUpdated;
  }

  public async getMainUserTopics(user: User): Promise<UserTopic[]> {
    // return await this.cacheService.remember(`get_main_user_topics_by_user_${user.id}`, CacheTimes.ONE_DAY, async () => {
    return await this.userTopicRepository.getMainUserTopics(user);
    // });
  }

  public async findTopLevelTopicByOption(
    user: User,
    option: string
  ): Promise<UserTopic | null> {
    return await this.cacheService.remember(
      `find_top_level_topic_by_option_${option}_and_user_id_${user.id}`,
      CacheTimes.ONE_DAY,
      async () => {
        return await this.userTopicRepository.findTopLevelTopicByOption(
          user,
          option
        );
      }
    );
  }

  public async findChildTopicByOption(
    user: User,
    parentTopic: UserTopic,
    option: string
  ): Promise<UserTopic | null> {
    return await this.cacheService.remember(
      `find_child_topic_by_option_${option}_and_parent_topic_${parentTopic.id}_user_id_${user.id}`,
      CacheTimes.ONE_DAY,
      async () => {
        return await this.userTopicRepository.findChildTopicByOption(
          user,
          parentTopic,
          option
        );
      }
    );
  }

  public async getUserTopicStage(user: User): Promise<{
    topLevelUserTopics: UserTopic[];
    currentUserTopic: UserTopic | null;
    userTopicStack: UserTopic[];
  } | null> {
    return await this.cacheService.get<{
      topLevelUserTopics: UserTopic[];
      currentUserTopic: UserTopic | null;
      userTopicStack: UserTopic[];
    }>(`get_user_topic_stage_by_user_id_${user.id}`);
  }

  public async setUserTopicStage(
    user: User,
    state: {
      topLevelUserTopics: UserTopic[];
      currentUserTopic: UserTopic | null;
      userTopicStack: UserTopic[];
    }
  ): Promise<void> {
    await this.cacheService.put(
      `get_user_topic_stage_by_user_id_${user.id}`,
      state,
      CacheTimes.THIRTY_MINUTES
    );
  }

  public async getUserTopicState(user: User): Promise<number> {
    return await this.cacheService.remember(
      `user_${user.id}_topic_state`,
      CacheTimes.ONE_DAY,
      async () => {
        return UserTopicState.DEFAULT;
      }
    );
  }

  public async setUserTopicState(
    user: User,
    userTopicState: UserTopicState
  ): Promise<void> {
    await this.cacheService.put(
      `user_${user.id}_topic_state`,
      userTopicState,
      CacheTimes.THIRTY_MINUTES
    );
  }

  public async setTemporaryUserTopic(
    user: User,
    userTopic: UserTopic
  ): Promise<void> {
    await this.cacheService.put(
      `temporary_user_topic_for_user_${user.id}`,
      userTopic,
      CacheTimes.THIRTY_MINUTES
    );
  }

  public async getTemporaryUserTopic(user: User): Promise<UserTopic | null> {
    return await await this.cacheService.get(
      `temporary_user_topic_for_user_${user.id}`
    );
  }

  public async finalizeTopicCreation(
    user: User,
    description: string
  ): Promise<UserTopic> {
    const temporaryUserTopic = await this.cacheService.get<UserTopic>(
      `temporary_user_topic_for_user_${user.id}`
    );
    if (!temporaryUserTopic) {
      throw new Error('Temporary user topic not found.');
    }

    const newUserTopic = new UserTopic(
      temporaryUserTopic.title,
      temporaryUserTopic.option,
      description,
      user,
      temporaryUserTopic.action
    );

    const createdTopic = await this.createUserTopic(newUserTopic);
    await this.cacheService.forget(`temporary_user_topic_for_user_${user.id}`);

    if (!createdTopic) {
      throw new Error('Failed to create the new user topic.');
    }

    return createdTopic;
  }
}
