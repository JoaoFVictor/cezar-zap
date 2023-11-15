import { container, injectable } from 'tsyringe';

import { Action } from '../../entities/Action';
import { CacheService } from '../../../infrastructure/cache/CacheService';
import { CacheTimes } from '../../../config/CacheTimes';
import { User } from '../../entities/User';
import { UserExpenseInitializeStageUseCase } from '../user-expense/UserExpenseInitializeStageUseCase';

@injectable()
export class UserExpenseInitAction extends Action {
  private userExpenseInitializeStageUseCase: UserExpenseInitializeStageUseCase;

  constructor(
    description: string,
    action_type?: string,
    cacheService?: CacheService | null
  ) {
    super(description, action_type, cacheService);
    this.userExpenseInitializeStageUseCase = container.resolve(
      UserExpenseInitializeStageUseCase
    );
  }

  public async execute(user: User): Promise<string | void> {
    await this.cacheService?.put(
      `user_${user.id}_id_in_expensive`,
      true,
      CacheTimes.ONE_DAY
    );
    await this.userExpenseInitializeStageUseCase.execute(user);
  }
}
