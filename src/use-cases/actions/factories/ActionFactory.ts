import { Action } from '../../../entities/Action';
import { DefaultAction } from '../DefaultAction';

export class ActionFactory {
    createAction(actionData: Action): Action {
        switch(actionData.action_type) {
            case null:
                return new DefaultAction(actionData.description, actionData.action_type);
            case 'teste':
                return new DefaultAction(actionData.description, actionData.action_type);
            default:
                return new DefaultAction(actionData.description, actionData.action_type);
        }
    }
}
