import { container, injectable } from "tsyringe";

import { Action } from "../../entities/Action";
import { CacheService } from "../../infrastructure/cache/CacheService";
import { CacheTimes } from "../../config/CacheTimes";
import { User } from "../../entities/User";
import { UserExpenseProcessor } from "../../core/UserExpenseProcessor";

@injectable()
export class UserExpenseInit extends Action {
    private userExpenseProcessor: UserExpenseProcessor;

    constructor(description: string, action_type?: string, cacheService?: CacheService | null)
    {
        super(description, action_type, cacheService);
        this.userExpenseProcessor = container.resolve(UserExpenseProcessor);
    }

    public async execute(user: User): Promise<string | void> {
        await this.cacheService?.put(`user_${user.id}_id_in_expensive`, true, CacheTimes.ONE_DAY);
        await this.userExpenseProcessor.initializeUserExpenseStage(user);
    }
}