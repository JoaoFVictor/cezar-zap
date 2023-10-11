import { ActionService } from '../actions/services/ActionService';
import { Menu } from '../menu/models/Menu';
import { MenuFactory } from '../menu/models/factories/MenuFactory';

export class MenuProcessor {
    private userMenuStates: Map<string, { currentMenu: Menu, menuStack: Menu[] }> = new Map();
    private actionService: ActionService;

    constructor(actionService: ActionService) {
        this.actionService = actionService;
    }

    processMenuCommand(userId: string, command: string): string | undefined {
        let response = '';
        let userState = this.userMenuStates.get(userId);

        if (!userState) {
            const menuFactory = new MenuFactory(this.actionService);
            userState = {
                currentMenu: menuFactory.generate(),
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
                response = this.restartMenu(userState);
                break;
            default:
                response = this.processSelectedOption(userState, command);
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

    private restartMenu(userState: any): string {
        const menuFactory = new MenuFactory(this.actionService);
        userState.currentMenu = menuFactory.generate();
        userState.menuStack = [];
        return this.displayMenu(userState.currentMenu);
    }

    private processSelectedOption(userState: any, command: string): string {
        userState.menuStack.push(userState.currentMenu);
        const option = userState.currentMenu.children?.find((opt: Menu) => opt.option === command);

        if (!option) {
            return "Invalid option. Please select a valid one.";
        }

        if (option.action) {
            let response = this.actionService.executeActionById(option.action.id);
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
        let response = `${menu.title} - ${menu.description}\n`;
        menu.children?.forEach(option => response += `${option.option}. ${option.title}\n`);
        return response;
    }

    private getCommonActions(): string {
        return "BACK. Go back to the previous menu\nRESTART. Start from the main menu";
    }
}
