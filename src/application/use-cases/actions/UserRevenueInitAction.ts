import { container, injectable } from 'tsyringe';

import { Action } from '../../entities/Action';
import { CacheService } from '../../../infrastructure/cache/CacheService';
import { CacheTimes } from '../../../config/CacheTimes';
import { User } from '../../entities/User';
import { UserRevenueInitializeStageUseCase } from '../user-revenue/UserRevenueInitializeStageUseCase';

@injectable()
export class UserRevenueInitAction extends Action {
  private userRevenueInitializeStageUseCase: UserRevenueInitializeStageUseCase;

  constructor(
    description: string,
    action_type?: string,
    cacheService?: CacheService | null
  ) {
    super(description, action_type, cacheService);
    this.userRevenueInitializeStageUseCase = container.resolve(
      UserRevenueInitializeStageUseCase
    );
  }

  public async execute(user: User): Promise<string | void> {
    await this.cacheService?.put(
      `user_${user.id}_id_in_revenue`,
      true,
      CacheTimes.ONE_DAY
    );
    await this.userRevenueInitializeStageUseCase.execute(user);
  }
}
