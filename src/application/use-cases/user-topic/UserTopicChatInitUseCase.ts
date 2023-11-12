import { container, injectable } from "tsyringe";

import { Action } from "../../entities/Action";
import { CacheService } from "../../../infrastructure/cache/CacheService";
import { CacheTimes } from "../../../config/CacheTimes";
import { User } from "../../entities/User";
import { UserTopicCommandHandlerUseCase } from "./UserTopicCommandHandlerUseCase";

@injectable()
export class UserTopicChatInitUseCase extends Action {
    private userTopicCommandHandlerUseCase: UserTopicCommandHandlerUseCase;

    constructor(description: string, action_type?: string, cacheService?: CacheService | null)
    {
        super(description, action_type, cacheService);
        this.userTopicCommandHandlerUseCase = container.resolve(UserTopicCommandHandlerUseCase);
    }

    public async execute(user: User): Promise<string | void> {
        await this.cacheService?.put(`user_${user.id}_id_in_topic_chat`, true, CacheTimes.ONE_DAY);
        await this.userTopicCommandHandlerUseCase.initializeUserTopicStage(user);
    }
}