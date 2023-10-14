import { CacheService } from '../cache/CacheService';
import { Menu } from '../../entities/Menu';
import { MenuRepository } from '../repositories/MenuRepository';
import { injectable } from 'tsyringe';

@injectable()
export class MenuService {
    constructor(private menuRepository: MenuRepository, private cacheService: CacheService) {}

    async getMainMenu(): Promise <Menu | null> {
        return await this.cacheService.remember(`get_all_menu`, 60, async () => {
            return await this.menuRepository.findByOption('main');
        })
    }

    async findByOptionAndParentMenuId(option: string, id: string): Promise <Menu | null> {
        return await this.cacheService.remember(`get_menu_by_option_${option}_and_id_${id}`, 60, async () => {
            return await this.menuRepository.findByOptionAndParentMenuId(option, id);
        })
    }
}
