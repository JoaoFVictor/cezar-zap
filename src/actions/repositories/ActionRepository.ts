import { DataSource, Repository } from 'typeorm';

import { Action } from '../models/Action';

export class ActionRepository extends Repository<Action> {
    constructor(private dataSource: DataSource)
    {
        super(Action, dataSource.createEntityManager());
    }

    async findById(id: number): Promise <Action | null> {
        return await this.findOneBy({id: id});
    }
}
