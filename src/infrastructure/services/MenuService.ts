import { Menu } from '../../entities/Menu';
import { MenuRepository } from '../repositories/MenuRepository';
import { injectable } from 'tsyringe';

@injectable()
export class MenuService {
    constructor(private menuRepository: MenuRepository) {}

    async getMainMenu(): Promise <Menu | null> {
        return await this.menuRepository.findByOption('main');
    }

    async findByOptionAndParentMenuId(option: string, id: string): Promise <Menu | null> {
        return await this.menuRepository.findByOptionAndParentMenuId(option, id);
    }
}
