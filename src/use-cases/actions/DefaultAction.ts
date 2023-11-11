import { Action } from "../../entities/Action";

export class DefaultAction extends Action {
    public async execute(): Promise<string | void> {
    }
}