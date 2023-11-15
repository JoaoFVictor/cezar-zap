import { Action } from '../../../entities/Action';
import { CacheService } from '../../../../infrastructure/cache/CacheService';
import { DefaultAction } from '../DefaultAction';
import { UserExpenseInitAction } from '../UserExpenseInitAction';
import { UserRevenueInitAction } from '../UserRevenueInitAction';
import { UserTopicChatInitAction } from '../UserTopicChatInitAction';
import { injectable } from 'tsyringe';

@injectable()
export class ActionFactory {
    constructor(
        private cacheService: CacheService,
    ) {}

    execute(actionData: Action): Action {
        switch(actionData.action_type) {
            case null:
                return new DefaultAction(actionData.description, actionData.action_type, this.cacheService);
            case 'user-topic-init':
                return new UserTopicChatInitAction(actionData.description, actionData.action_type, this.cacheService);
            case 'user-expense-init':
                return new UserExpenseInitAction(actionData.description, actionData.action_type, this.cacheService);
            case 'user-revenue-init':
                return new UserRevenueInitAction(actionData.description, actionData.action_type, this.cacheService);
            default:
                return new DefaultAction(actionData.description, actionData.action_type, this.cacheService);
        }
    }
}
