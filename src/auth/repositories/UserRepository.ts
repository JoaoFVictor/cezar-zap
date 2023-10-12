import { DataSource, Repository } from 'typeorm';

import { User } from '../models/User';

export class UserRepository extends Repository<User> {
    constructor(private dataSource: DataSource)
    {
        super(User, dataSource.createEntityManager());
    }

    async findByPhoneNumber(phoneNumber: string): Promise<User | null> {
        return await this.findOneBy({phone_number: phoneNumber});
    }

    async createUser(user: User): Promise<User | null> {
        return await this.save(user);
    }

    async updateUser(user: User): Promise<User | null> {
        return await this.save(user);
    }
}
