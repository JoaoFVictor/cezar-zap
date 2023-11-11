import { container, injectable } from "tsyringe";

import { Action } from "../../entities/Action";
import { CacheService } from "../../../infrastructure/cache/CacheService";
import { CacheTimes } from "../../../config/CacheTimes";
import { User } from "../../entities/User";
import { UserRevenueCommandHandler } from "./UserRevenueCommandHandler";

@injectable()
export class UserRevenueInit extends Action {
    private userRevenueCommand: UserRevenueCommandHandler;

    constructor(description: string, action_type?: string, cacheService?: CacheService | null)
    {
        super(description, action_type, cacheService);
        this.userRevenueCommand = container.resolve(UserRevenueCommandHandler);
    }

    public async execute(user: User): Promise<string | void> {
        await this.cacheService?.put(`user_${user.id}_id_in_revenue`, true, CacheTimes.ONE_DAY);
        await this.userRevenueCommand.initializeUserRevenueStage(user);
    }
}