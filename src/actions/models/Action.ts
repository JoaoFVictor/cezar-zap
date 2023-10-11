export class Action {
    constructor(
        public id: string,
        public description: string,
        public execute: () => string | void
    ) {}
}
