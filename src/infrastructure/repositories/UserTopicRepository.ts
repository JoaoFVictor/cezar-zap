import { DataSource, Repository, IsNull } from 'typeorm';

import { UserTopic } from '../../entities/UserTopic';
import { inject, injectable } from 'tsyringe';
import { User } from '../../entities/User';

@injectable()
export class UserTopicRepository extends Repository<UserTopic> {
    constructor(@inject("DataSource") private dataSource: DataSource)
    {
        super(UserTopic, dataSource.createEntityManager());
    }

    public async createUserTopic(userTopic: UserTopic): Promise<UserTopic | null> {
        return await this.save(userTopic);
    }

    public async updateUserTopic(userTopic: UserTopic): Promise<UserTopic | null> {
        return await this.save(userTopic);
    }

    public async getMainUserTopics(user: User): Promise<UserTopic[]> {
        return await this.find({ 
            where: { 
                user: user,
                parent: IsNull()
            }, relations: ['children', 'action']
        });
    }

    public async findTopLevelTopicByOption(user:User, option: string): Promise<UserTopic | null> {
        return this.findOne({ 
            where: {
                user: user,
                option: option,
                parent: IsNull()
            },
            relations: ['action']
        });
    }

    public async findChildTopicByOption(user: User, parentTopic: UserTopic, option: string): Promise<UserTopic | null> {
        return this.findOne({ 
            where: {
                user: user,
                option: option,
                parent: { id: parentTopic.id }
            },
            relations: ['action']
        });
    }    
}
