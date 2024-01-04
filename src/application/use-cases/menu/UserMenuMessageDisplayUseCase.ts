import { MenuService } from '../../../infrastructure/services/MenuService';
import { MessageService } from '../../../infrastructure/services/MessageService';
import { User } from '../../entities/User';
import { injectable } from 'tsyringe';

@injectable()
export class UserMenuMessageDisplayUseCase {
  constructor(
    private menuService: MenuService,
    private messageService: MessageService
  ) {}

  async execute(user: User): Promise<void> {
    const userMenuStage = await this.menuService.getUserMenuStage(user);
    if (!userMenuStage) {
      throw new Error('Menu stage not found.');
    }

    let response = `${userMenuStage.currentMenu.title}\n${userMenuStage.currentMenu.description}\n\n`;
    userMenuStage.currentMenu.children?.forEach((option) => (response += `🔹 ${option.option}. ${option.title}\n`));

    await this.messageService.sendMessage(user.phone_number, response.trim(), true);
  }
}
