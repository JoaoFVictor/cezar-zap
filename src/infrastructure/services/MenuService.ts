import { CacheService } from '../cache/CacheService';
import { CacheTimes } from '../../config/CacheTimes';
import { Menu } from '../../application/entities/Menu';
import { MenuRepository } from '../repositories/MenuRepository';
import { User } from '../../application/entities/User';
import { injectable } from 'tsyringe';

@injectable()
export class MenuService {
    constructor(private menuRepository: MenuRepository, private cacheService: CacheService) {}

    async getMainMenu(): Promise <Menu | null> {
        return await this.cacheService.remember(`get_all_menu`, CacheTimes.ONE_DAY, async () => {
            return await this.menuRepository.findByOption('main');
        });
    }

    async findByOptionAndParentMenuId(option: string, id: string): Promise <Menu | null> {
        return await this.cacheService.remember(`get_menu_by_option_${option}_and_parent_id_${id}`, CacheTimes.ONE_DAY, async () => {
            return await this.menuRepository.findByOptionAndParentMenuId(option, id);
        });
    }

    async getUserMenuStage(user: User): Promise<{ currentMenu: Menu, menuStack: Menu[] } | null> {
        return this.cacheService.get<{ currentMenu: Menu, menuStack: Menu[] }>(`get_menu_state_by_user_id_${user.id}`);
    }

    async setUserMenuStage(user: User, state: { currentMenu: Menu, menuStack: Menu[] }): Promise<void> {
        this.cacheService.put(`get_menu_state_by_user_id_${user.id}`, state, CacheTimes.THIRTY_MINUTES);
    }
}
