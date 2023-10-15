import { CacheService } from '../infrastructure/cache/CacheService';
import { CacheTimes } from '../config/CacheTimes';
import { ExecuteAction } from '../use-cases/actions/ExecuteAction';
import { Menu } from '../entities/Menu';
import { MenuService } from '../infrastructure/services/MenuService';
import { injectable } from 'tsyringe';

@injectable()
export class MenuProcessor {
    constructor(
        private executeAction: ExecuteAction,
        private menuService: MenuService,
        private cacheService: CacheService,
    ) {}

    private async getUserMenuState(userId: string): Promise<{ currentMenu: Menu, menuStack: Menu[] } | null> {
        return await this.cacheService.get<{ currentMenu: Menu, menuStack: Menu[] }>(`menu_state_by_user_id_${userId}`);
    }

    private async setUserMenuState(userId: string, state: { currentMenu: Menu, menuStack: Menu[] }): Promise<void> {
        await this.cacheService.put(`menu_state_by_user_id_${userId}`, state, CacheTimes.THIRTY_MINUTES);
    }

    async processMenuCommand(userId: string, command: string): Promise<string> {
        let response = '';
        let userState = await this.getUserMenuState(userId);

        if (!userState) {
            const mainMenu = await this.menuService.getMainMenu();
            if (!mainMenu) {
                return 'Main menu not found in the database.';
            }
            userState = {
                currentMenu: mainMenu,
                menuStack: []
            };
            await this.setUserMenuState(userId, userState);
            return this.displayMenu(userState.currentMenu);
        }

        switch (command) {
            case "BACK":
                response = this.goBack(userState, userId);
                break;
            case "RESTART":
                response = await this.restartMenu(userState, userId);
                break;
            default:
                response = await this.processSelectedOption(userState, userId, command);
                break;
        }

        return `${response}\n\n${this.getCommonActions()}`;
    }

    private goBack(userState: { currentMenu: Menu, menuStack: Menu[] }, userId: string): string {
        if (userState.menuStack.length > 0) {
            userState.currentMenu = userState.menuStack.pop()!;
            this.setUserMenuState(userId, userState);
        }
        return this.displayMenu(userState.currentMenu);
    }

    private async restartMenu(userState: { currentMenu: Menu, menuStack: Menu[] }, userId: string): Promise<string> {
        const mainMenu = await await this.menuService.getMainMenu();
        if (!mainMenu) {
            throw new Error('Main menu not found in the database.');
        }

        userState.currentMenu = mainMenu;
        userState.menuStack = [];
        await this.setUserMenuState(userId, userState);
        return this.displayMenu(userState.currentMenu);
    }

    private async processSelectedOption(userState: { currentMenu: Menu, menuStack: Menu[] }, userId: string, command: string): Promise<string> {
        userState.menuStack.push(userState.currentMenu);
        await this.setUserMenuState(userId, userState);

        const option = await this.menuService.findByOptionAndParentMenuId(command, userState.currentMenu.id);

        if (!option) {
            return "Invalid option. Please select a valid one.";
        }

        if (option.action) {
            const response = await this.executeAction.execute(option.action.id);
            if (response) {
                return response;
            }
        }
        if (option.children && option.children.length > 0) {
            userState.currentMenu = option;
            await this.setUserMenuState(userId, userState);
            return this.displayMenu(userState.currentMenu);
        } else {
            return option.description || "Selected: " + option.title;
        }
    }

    private displayMenu(menu: Menu): string {
        let response = `${menu.title}\n${menu.description}\n\n`;
        menu.children?.forEach(option => response += `🔹 ${option.option}. ${option.title}\n`);
        return response.trim();
    }

    private getCommonActions(): string {
        return "\n\n🔙 Type 'BACK' to go to the previous menu.\n🔄 Type 'RESTART' to start from the main menu.";
    }
}
