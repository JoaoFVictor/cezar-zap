import { Action } from '../../../entities/Action';
import { CacheService } from '../../../../infrastructure/cache/CacheService';
import { DefaultAction } from '../DefaultAction';
import { UserExpenseInit } from '../../user-expense/UserExpenseInit';
import { UserRevenueInit } from '../../user-revenue/UserRevenueInit';
import { UserTopicChatInit } from '../../user-topic/UserTopicChatInit';
import { injectable } from 'tsyringe';

@injectable()
export class ActionFactory {
    constructor(
        private cacheService: CacheService,
    ) {}

    createAction(actionData: Action): Action {
        switch(actionData.action_type) {
            case null:
                return new DefaultAction(actionData.description, actionData.action_type, this.cacheService);
            case 'user-topic-init':
                return new UserTopicChatInit(actionData.description, actionData.action_type, this.cacheService);
            case 'user-expense-init':
                return new UserExpenseInit(actionData.description, actionData.action_type, this.cacheService);
            case 'user-revenue-init':
                return new UserRevenueInit(actionData.description, actionData.action_type, this.cacheService);
            default:
                return new DefaultAction(actionData.description, actionData.action_type, this.cacheService);
        }
    }
}
