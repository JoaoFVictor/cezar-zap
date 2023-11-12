import { Action } from '../../../entities/Action';
import { CacheService } from '../../../../infrastructure/cache/CacheService';
import { DefaultAction } from '../DefaultAction';
import { UserExpenseInitUseCase } from '../../user-expense/UserExpenseInitUseCase';
import { UserRevenueInitUseCase } from '../../user-revenue/UserRevenueInitUseCase';
import { UserTopicChatInitUseCase } from '../../user-topic/UserTopicChatInitUseCase';
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
                return new UserTopicChatInitUseCase(actionData.description, actionData.action_type, this.cacheService);
            case 'user-expense-init':
                return new UserExpenseInitUseCase(actionData.description, actionData.action_type, this.cacheService);
            case 'user-revenue-init':
                return new UserRevenueInitUseCase(actionData.description, actionData.action_type, this.cacheService);
            default:
                return new DefaultAction(actionData.description, actionData.action_type, this.cacheService);
        }
    }
}
