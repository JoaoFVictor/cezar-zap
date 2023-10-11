import { ActionService } from '../../../actions/services/ActionService';
import { Menu } from '../Menu';

export class MenuFactory {
    private actionService: ActionService;

    constructor(actionService: ActionService) {
        this.actionService = actionService;
    }

    generate(): Menu {
        const sendReportAction = this.actionService.findById("SEND_REPORT");

        const subSubMenu = new Menu(
            '6',
            "SUBSUB",
            "Sub-Sub Menu",
            "Choose an option:",
            sendReportAction,
            [
                new Menu('7', "OPT1", "Option 1 in Sub-Sub Menu"),
                new Menu('8', "OPT2", "Option 2 in Sub-Sub Menu")
            ]
        );

        const subMenu = new Menu(
            '3',
            "SUB",
            "Sub Menu",
            "Choose an option:",
            undefined,
            [
                new Menu('4', "OPT1", "Option 1 in Sub Menu", undefined, undefined, [subSubMenu]),
                new Menu('5', "OPT2", "Option 2 in Sub Menu")
            ]
        );

        return new Menu(
            '1',
            "MAIN",
            "Main Menu",
            "Choose an option:",
            undefined,
            [
                subMenu,
                new Menu('2', "OPT2", "Another option in Main Menu"),
            ]
        );
    }
}
