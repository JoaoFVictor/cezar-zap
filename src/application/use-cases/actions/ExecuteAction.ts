import { ActionFactory } from './factories/ActionFactory';
import { ActionService } from '../../../infrastructure/services/ActionService';
import { User } from '../../entities/User';
import { injectable } from 'tsyringe';

@injectable()
export class ExecuteAction {
    constructor(
        private actionService: ActionService,
        private actionFactory: ActionFactory
    ) {}

    public async execute(id: number, user: User): Promise<string | void> {
        const actionData = await this.actionService.findById(id);
        if (!actionData) return;
        const actionInstance = this.actionFactory.execute(actionData);
        return await actionInstance.execute(user);
    }
}
