import { container, injectable } from "tsyringe";

import { Action } from "../../entities/Action";
import { CacheService } from "../../../infrastructure/cache/CacheService";
import { CacheTimes } from "../../../config/CacheTimes";
import { User } from "../../entities/User";
import { UserExpenseCommandHandler } from "./UserExpenseCommandHandler";

@injectable()
export class UserExpenseInit extends Action {
    private userExpenseCommand: UserExpenseCommandHandler;

    constructor(description: string, action_type?: string, cacheService?: CacheService | null)
    {
        super(description, action_type, cacheService);
        this.userExpenseCommand = container.resolve(UserExpenseCommandHandler);
    }

    public async execute(user: User): Promise<string | void> {
        await this.cacheService?.put(`user_${user.id}_id_in_expensive`, true, CacheTimes.ONE_DAY);
        await this.userExpenseCommand.initializeUserExpenseStage(user);
    }
}