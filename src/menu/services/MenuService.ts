import { Menu } from '../models/Menu';
import { MenuRepository } from '../repositories/MenuRepository';

export class MenuService {
    constructor(private menuRepository: MenuRepository) {}

    getMainMenu(): Menu | undefined {
        return this.menuRepository.findById('main');
    }

    getMenuById(id: string): Menu | undefined {
        return this.menuRepository.findById(id);
    }
}
