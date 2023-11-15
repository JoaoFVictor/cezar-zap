import { DataSource, Repository, IsNull } from 'typeorm';

import { inject, injectable } from 'tsyringe';
import { UserTopic } from '../../application/entities/UserTopic';
import { User } from '../../application/entities/User';

@injectable()
export class UserTopicRepository extends Repository<UserTopic> {
  constructor(@inject('DataSource') private dataSource: DataSource) {
    super(UserTopic, dataSource.createEntityManager());
  }

  async createUserTopic(userTopic: UserTopic): Promise<UserTopic | null> {
    return await this.save(userTopic);
  }

  async updateUserTopic(userTopic: UserTopic): Promise<UserTopic | null> {
    return await this.save(userTopic);
  }

  async getMainUserTopics(user: User): Promise<UserTopic[]> {
    return await this.find({
      where: {
        user: user,
        parent: IsNull(),
      },
      relations: ['children', 'action'],
    });
  }

  async findTopLevelTopicByOption(
    user: User,
    option: string
  ): Promise<UserTopic | null> {
    return this.findOne({
      where: {
        user: user,
        option: option,
        parent: IsNull(),
      },
      relations: ['action'],
    });
  }

  async findChildTopicByOption(
    user: User,
    parentTopic: UserTopic,
    option: string
  ): Promise<UserTopic | null> {
    return this.findOne({
      where: {
        user: user,
        option: option,
        parent: { id: parentTopic.id },
      },
      relations: ['action'],
    });
  }
}
