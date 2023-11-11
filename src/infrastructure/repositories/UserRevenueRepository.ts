import { DataSource, Repository } from 'typeorm';

import { inject, injectable } from 'tsyringe';
import { UserRevenue } from '../../entities/UserRevenue';

@injectable()
export class UserRevenueRepository extends Repository<UserRevenue> {
    constructor(@inject("DataSource") private dataSource: DataSource)
    {
        super(UserRevenue, dataSource.createEntityManager());
    }

    public async createUserRevenue(userTopic: UserRevenue): Promise<UserRevenue | null> {
        return await this.save(userTopic);
    }
}
