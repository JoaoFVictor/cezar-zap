import { container, injectable } from "tsyringe";

import { Action } from "../../entities/Action";
import { CacheService } from "../../infrastructure/cache/CacheService";
import { CacheTimes } from "../../config/CacheTimes";
import { User } from "../../entities/User";
import { UserRevenueProcessor } from "../../core/UserRevenueProcessor";

@injectable()
export class UserRevenueInit extends Action {
    private userRevenueProcessor: UserRevenueProcessor;

    constructor(description: string, action_type?: string, cacheService?: CacheService | null)
    {
        super(description, action_type, cacheService);
        this.userRevenueProcessor = container.resolve(UserRevenueProcessor);
    }

    public async execute(user: User): Promise<string | void> {
        await this.cacheService?.put(`user_${user.id}_id_in_revenue`, true, CacheTimes.ONE_DAY);
        await this.userRevenueProcessor.initializeUserRevenueStage(user);
    }
}