import { Action } from '../../actions/models/Action';

export class Menu {
    constructor(
        public id: string,
        public option: string,
        public title: string,
        public description?: string,
        public action?: Action,
        public children?: Menu[]
    ) {}
}
