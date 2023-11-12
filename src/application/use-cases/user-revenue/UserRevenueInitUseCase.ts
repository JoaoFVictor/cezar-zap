import { container, injectable } from "tsyringe";

import { Action } from "../../entities/Action";
import { CacheService } from "../../../infrastructure/cache/CacheService";
import { CacheTimes } from "../../../config/CacheTimes";
import { User } from "../../entities/User";
import { UserRevenueCommandHandlerUseCase } from "./UserRevenueCommandHandlerUseCase";

@injectable()
export class UserRevenueInitUseCase extends Action {
    private userRevenueCommandHandlerUseCase: UserRevenueCommandHandlerUseCase;

    constructor(description: string, action_type?: string, cacheService?: CacheService | null)
    {
        super(description, action_type, cacheService);
        this.userRevenueCommandHandlerUseCase = container.resolve(UserRevenueCommandHandlerUseCase);
    }

    public async execute(user: User): Promise<string | void> {
        await this.cacheService?.put(`user_${user.id}_id_in_revenue`, true, CacheTimes.ONE_DAY);
        await this.userRevenueCommandHandlerUseCase.initializeUserRevenueStage(user);
    }
}