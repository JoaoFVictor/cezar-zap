import { Action } from '../../entities/Action';
import { ActionRepository } from '../repositories/ActionRepository';
import { injectable } from 'tsyringe';

@injectable()
export class ActionService {
    constructor(private actionRepository: ActionRepository) {}

    async findById(id: number): Promise <Action | null> {
        return await this.actionRepository.findById(id);
    }
}
