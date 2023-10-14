import { ExecuteAction } from '../use-cases/actions/ExecuteAction';
import { Menu } from '../entities/Menu';
import { MenuService } from '../infrastructure/services/MenuService';
import { injectable } from 'tsyringe';

@injectable()
export class MenuProcessor {
    private userMenuStates: Map<string, { currentMenu: Menu, menuStack: Menu[] }> = new Map();

    constructor(private executeAction: ExecuteAction, private menuService: MenuService) {}

    async processMenuCommand(userId: string, command: string): Promise <string> {
        let response = '';
        let userState = this.userMenuStates.get(userId);

        if (!userState) {
            const mainMenu = await this.menuService.getMainMenu();

            if (!mainMenu) {
                return 'Main menu not found in the database.';
            }

            userState = {
                currentMenu: mainMenu,
                menuStack: []
            };
            this.userMenuStates.set(userId, userState);
            return this.displayMenu(userState.currentMenu);
        }

        switch (command) {
            case "BACK":
                response = this.goBack(userState);
                break;
            case "RESTART":
                response = await this.restartMenu(userState);
                break;
            default:
                response = await this.processSelectedOption(userState, command);
                break;
        }

        return `${response}\n\n${this.getCommonActions()}`;
    }

    private goBack(userState: any): string {
        if (userState.menuStack.length > 0) {
            userState.currentMenu = userState.menuStack.pop()!;
        }
        return this.displayMenu(userState.currentMenu);
    }

    private async restartMenu(userState: any): Promise <string> {
        userState.currentMenu = await this.menuService.getMainMenu();
        userState.menuStack = [];
        return this.displayMenu(userState.currentMenu);
    }

    private async processSelectedOption(userState: any, command: string): Promise <string> {
        userState.menuStack.push(userState.currentMenu);
        const option = await this.menuService.findByOptionAndParentMenuId(command, userState.currentMenu.id);

        if (!option) {
            return "Invalid option. Please select a valid one.";
        }

        if (option.action) {
            let response = await this.executeAction.execute(option.action.id);
            if (response) {
                return response;
            }
        } if (option.children && option.children.length > 0) {
            userState.currentMenu = option;
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
