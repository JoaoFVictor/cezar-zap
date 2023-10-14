import { Action } from '../../entities/Action';
import { ActionRepository } from '../repositories/ActionRepository';
import { CacheService } from '../cache/CacheService';
import { injectable } from 'tsyringe';

@injectable()
export class ActionService {
    constructor(private actionRepository: ActionRepository, private cacheService: CacheService) {}

    async findById(id: number): Promise <Action | null> {
        return await this.cacheService.remember(`get_action_by_id_${id}`, 60, async () => {
            return await this.actionRepository.findById(id);
        })
    }
}
