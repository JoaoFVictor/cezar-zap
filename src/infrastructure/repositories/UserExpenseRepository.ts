import { DataSource, Repository } from 'typeorm';

import { inject, injectable } from 'tsyringe';
import { UserExpense } from '../../application/entities/UserExpense';

@injectable()
export class UserExpenseRepository extends Repository<UserExpense> {
  constructor(@inject('DataSource') private dataSource: DataSource) {
    super(UserExpense, dataSource.createEntityManager());
  }

  async createUserExpense(userTopic: UserExpense): Promise<UserExpense | null> {
    return await this.save(userTopic);
  }
}
