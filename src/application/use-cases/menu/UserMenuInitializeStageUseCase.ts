import { MenuService } from '../../../infrastructure/services/MenuService';
import { User } from '../../entities/User';
import { UserMenuMessageDisplayUseCase } from './UserMenuMessageDisplayUseCase';
import { injectable } from 'tsyringe';

@injectable()
export class UserMenuInitializeStageUseCase {
  constructor(
    private menuService: MenuService,
    private userMenuMessageDisplayUseCase: UserMenuMessageDisplayUseCase
  ) {}

  async execute(user: User): Promise<void> {
    const userMainMenu = await this.menuService.getMainMenu();
    if (!userMainMenu) {
      throw new Error('Main menu not found in the database.');
    }

    const userMenuStage = {
      currentMenu: userMainMenu,
      menuStack: [],
    };
    await this.menuService.setUserMenuStage(user, userMenuStage);
    await this.userMenuMessageDisplayUseCase.execute(user);
  }
}
