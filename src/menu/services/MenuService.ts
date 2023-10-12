import { Menu } from '../models/Menu';
import { MenuRepository } from '../repositories/MenuRepository';

export class MenuService {
    constructor(private menuRepository: MenuRepository) {}

    async getMainMenu(): Promise <Menu | null> {
        return await this.menuRepository.findByOption('main');
    }

    async findByOptionAndParentMenuId(option: string, id: string): Promise <Menu | null> {
        return await this.menuRepository.findByOptionAndParentMenuId(option, id);
    }
}
