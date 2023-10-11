import { Action } from '../models/Action';

export class ActionRepository {
    private actions: Action[] = [];

    create(action: Action): void {
        this.actions.push(action);
    }

    findById(id: string): Action | undefined {
        return this.actions.find(action => action.id === id);
    }
}
