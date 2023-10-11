import { Action } from '../models/Action';
import { ActionRepository } from '../repositories/ActionRepository';

export class ActionService {
    constructor(private actionRepository: ActionRepository) {}

    executeActionById(id: string): string | undefined | void {
        const action = this.actionRepository.findById(id);
        return action?.execute();
    }

    findById(id: string): Action | undefined {
        return this.actionRepository.findById(id);
    }
}
