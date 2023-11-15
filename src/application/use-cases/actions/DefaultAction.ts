import { Action } from '../../entities/Action';

export class DefaultAction extends Action {
  async execute(): Promise<string | void> {}
}
