import { Action } from '../models/Action';
import { ActionFactory } from '../factory/ActionFactory';
import { ActionRepository } from '../repositories/ActionRepository';

export class ActionService {
    constructor(private actionRepository: ActionRepository, private actionFactory: ActionFactory) {}

    async executeActionById(id: number): Promise <string | void> {
        const actionData = await this.actionRepository.findById(id);
        if (!actionData) return;
        const actionInstance = this.actionFactory.createAction(actionData);

        return actionInstance.execute();
    }

    async findById(id: number): Promise <Action | null> {
        return await this.actionRepository.findById(id);
    }
}
