import { Menu } from '../models/Menu';

export class MenuRepository {
    private menus: Menu[] = [];

    create(menu: Menu): void {
        this.menus.push(menu);
    }

    findById(id: string): Menu | undefined {
        return this.menus.find(menu => menu.id === id);
    }
}
