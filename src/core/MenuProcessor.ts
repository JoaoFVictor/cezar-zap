import Commands from '../entities/enums/Commands';
import { ExecuteAction } from '../use-cases/actions/ExecuteAction';
import { MenuService } from '../infrastructure/services/MenuService';
import { MessageService } from '../infrastructure/services/MessageService';
import { User } from '../entities/User';
import { injectable } from 'tsyringe';

@injectable()
export class MenuProcessor {
    constructor(
        private executeAction: ExecuteAction,
        private menuService: MenuService,
        private messageService: MessageService,
    ) {}

    async processMenuCommand(user: User, command: string): Promise<void> {
        const userMenuStage = await this.menuService.getUserMenuStage(user);
        if (!userMenuStage) {
            await this.initializeUserMenuStage(user);
            return;
        }

        switch (command.toUpperCase()) {
            case Commands.BACK:
                await this.goBack( user);
                break;
            case Commands.RESTART:
                await this.initializeUserMenuStage(user);
                break;
            default:
                await this.processSelectedOption(user, command);
                break;
        }
    }

    public async initializeUserMenuStage(user: User): Promise<void> {
        const userMainMenu = await this.menuService.getMainMenu();
        if (!userMainMenu) {
            throw new Error('Main menu not found in the database.');
        }

        const userMenuStage = {
            currentMenu: userMainMenu,
            menuStack: []
        };
        await this.menuService.setUserMenuStage(user, userMenuStage);
        await this.displayMenu(user);
    }

    private async goBack(user: User): Promise<void> {
        const userMenuStage = await this.menuService.getUserMenuStage(user);
        if (!userMenuStage) {
            throw new Error('Menu stage not found.');
        }

        if (userMenuStage.menuStack.length > 0) {
            userMenuStage.currentMenu = userMenuStage.menuStack.pop()!;
            this.menuService.setUserMenuStage(user, userMenuStage);
        }

        await this.displayMenu(user);
    }

    private async processSelectedOption(user: User, command: string): Promise<void> {
        const userMenuStage = await this.menuService.getUserMenuStage(user);
        if (!userMenuStage) {
            throw new Error('Menu stage not found.');
        }

        userMenuStage.menuStack.push(userMenuStage.currentMenu);
        await this.menuService.setUserMenuStage(user, userMenuStage);

        const option = await this.menuService.findByOptionAndParentMenuId(command, userMenuStage.currentMenu.id);
        if (!option) {
            await this.messageService.sendMessage(user.phone_number, "Opição inválida. Por Favor selecione uma opção valida.", true);
            return;
        }

        if (option.children?.length) {
            userMenuStage.currentMenu = option;
            await this.menuService.setUserMenuStage(user, userMenuStage);
            await this.displayMenu(user);

            if (option.action) {
                const response = await this.executeAction.execute(option.action.id, user);
                if (response) {
                    await this.messageService.sendMessage(user.phone_number, response, true);
                }
            }
            return;
        }

        const response = option.description || `Selecionado: ${option.title}`;
        await this.messageService.sendMessage(user.phone_number, response, true);
        if (option.action) {
            const response = await this.executeAction.execute(option.action.id, user);
            if (response) {
                await this.messageService.sendMessage(user.phone_number, response, true);
            }
        }
    }

    private async displayMenu(user:User): Promise<void> {
        const userMenuStage = await this.menuService.getUserMenuStage(user);
        if (!userMenuStage) {
            throw new Error('Menu stage not found.');
        }

        let response = `${userMenuStage.currentMenu.title}\n${userMenuStage.currentMenu.description}\n\n`;
        userMenuStage.currentMenu.children?.forEach(option => response += `🔹 ${option.option}. ${option.title}\n`);

        await this.messageService.sendMessage(user.phone_number, response.trim(), true);
    }
}
