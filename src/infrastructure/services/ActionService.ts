import { Action } from '../../application/entities/Action';
import { ActionRepository } from '../repositories/ActionRepository';
import { CacheService } from '../cache/CacheService';
import { CacheTimes } from '../../config/CacheTimes';
import { injectable } from 'tsyringe';

@injectable()
export class ActionService {
  constructor(
    private actionRepository: ActionRepository,
    private cacheService: CacheService
  ) {}

  async findById(id: number): Promise<Action | null> {
    return await this.cacheService.remember(`get_action_by_id_${id}`, CacheTimes.ONE_DAY, async () => {
      return await this.actionRepository.findById(id);
    });
  }

  async findByType(actionType: string): Promise<Action | null> {
    return await this.cacheService.remember(`get_action_by_type_${actionType}`, CacheTimes.ONE_DAY, async () => {
      return await this.actionRepository.findByType(actionType);
    });
  }
}
