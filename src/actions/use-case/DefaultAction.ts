import { Action } from "../models/Action";

export class DefaultAction extends Action {
    execute(): string | void{
        console.log('test');
    }
}