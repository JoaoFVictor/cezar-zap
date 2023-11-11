import { DataSource, Repository } from 'typeorm';

import { inject, injectable } from 'tsyringe';
import { Action } from '../../application/entities/Action';

@injectable()
export class ActionRepository extends Repository<Action> {
    constructor(@inject("DataSource")  private dataSource: DataSource)
    {
        super(Action, dataSource.createEntityManager());
    }

    async findById(id: number): Promise <Action | null> {
        return await this.findOneBy({id: id});
    }

    async findByType(actionType: string): Promise <Action | null> {
        return await this.findOneBy({action_type: actionType});
    }
}
