import { ActionFactory } from './factories/ActionFactory';
import { ActionService } from '../../infrastructure/services/ActionService';
import { injectable } from 'tsyringe';

@injectable()
export class ExecuteAction {
    constructor(
        private actionService: ActionService,
        private actionFactory: ActionFactory
    ) {}

    async execute(id: number): Promise<string | void> {
        const actionData = await this.actionService.findById(id);
        if (!actionData) return;
        const actionInstance = this.actionFactory.createAction(actionData);
        return actionInstance.execute();
    }
}
