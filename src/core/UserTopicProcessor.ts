import { container, injectable } from 'tsyringe';

import { ActionService } from '../infrastructure/services/ActionService';
import Actions from '../entities/enums/Actions';
import Commands from '../entities/enums/Commands';
import { ExecuteAction } from '../use-cases/actions/ExecuteAction';
import { MenuProcessor } from './MenuProcessor';
import { MessageService } from '../infrastructure/services/MessageService';
import { User } from '../entities/User';
import { UserTopic } from '../entities/UserTopic';
import { UserTopicService } from '../infrastructure/services/UserTopicService';
import UserTopicState from '../entities/enums/UserTopicState';

@injectable()
export class UserTopicProcessor {
    private menuProcessor: MenuProcessor;
    private executeAction: ExecuteAction;
    private actionService: ActionService;

    constructor(private userTopicService: UserTopicService, private messageService: MessageService) {
        this.menuProcessor = container.resolve(MenuProcessor);
        this.executeAction = container.resolve(ExecuteAction);
        this.actionService = container.resolve(ActionService);
    }

    async processUserTopicCommand(user: User, command: string): Promise<void> {
        const userTopicState = await this.userTopicService.getUserTopicState(user);
        switch (userTopicState) {
            case UserTopicState.AWAITING_TOPIC_TITLE:
                await this.handleTopicTitleInput(user, command);
                break;
            case UserTopicState.AWAITING_TOPIC_OPTION:
                await this.handleTopicOptionInput(user, command);
                break;
            case UserTopicState.AWAITING_TOPIC_ACTION:
                await this.handleTopicActionInput(user, command);
                break;
            case UserTopicState.AWAITING_TOPIC_DESCRIPTION:
                await this.handleTopicDescriptionInput(user, command);
                break;
            default:
                await this.handleOtherCommands(user, command);
                break;
        }
    }

    public async initializeUserTopicStage(user: User): Promise<void> {
        const topLevelUserTopics = await this.userTopicService.getMainUserTopics(user);
        const userTopicStage = {
            topLevelUserTopics: topLevelUserTopics,
            currentUserTopic: topLevelUserTopics.length > 0 ? topLevelUserTopics[0] : null,
            userTopicStack: []
        };
        await this.userTopicService.setUserTopicStage(user, userTopicStage);
        if (!userTopicStage.currentUserTopic) {
            await this.promptUserToCreateTopic(user);
            return;
        }
        await this.displayUserTopic(user);
    }

    private async handleTopicTitleInput(user: User, title: string): Promise<void> {
        const userTopic = new UserTopic(title, 'temp');
        await this.userTopicService.setTemporaryUserTopic(user, userTopic);
        await this.userTopicService.setUserTopicState(user, UserTopicState.AWAITING_TOPIC_OPTION);
        await this.messageService.sendMessage(user.phone_number, `Insira a opção para o seu tópico:`, true, `Escreva ${Commands.CREATE} para criar um novo tópico`);
    }

    private async handleTopicOptionInput(user: User, option: string): Promise<void> {
        const userTopic = await this.userTopicService.getTemporaryUserTopic(user);
        if (!userTopic) {
            throw new Error('Temporary user topic not found.');
        }
        userTopic.option = option;
        await this.userTopicService.setTemporaryUserTopic(user, userTopic);
        await this.userTopicService.setUserTopicState(user, UserTopicState.AWAITING_TOPIC_ACTION);
        await this.messageService.sendMessage(user.phone_number, `Seu tópico vai ser de despesa ou receita? (Escreva '${Actions.REVENUE}' para despesa ou '${Actions.EXPENSE}' para receita)`);
    }

    private async handleTopicActionInput(user: User, option: string): Promise<void> {
        const userTopic = await this.userTopicService.getTemporaryUserTopic(user);
        if (!userTopic) {
            throw new Error('Temporary user topic not found.');
        }

        const action = option == Actions.REVENUE ? await this.actionService.findByType('user-revenue-init') : await this.actionService.findByType('user-expense-init');
        if (!action) {
            await this.messageService.sendMessage(user.phone_number, `Insira uma opção valida.`, true, `Escreva ${Commands.CREATE} para criar um novo tópico`);
            return;
        }

        userTopic.action = action;
        await this.userTopicService.setTemporaryUserTopic(user, userTopic);
        await this.userTopicService.setUserTopicState(user, UserTopicState.AWAITING_TOPIC_DESCRIPTION);
        await this.messageService.sendMessage(user.phone_number, `Insira uma descrição para o seu tópico (ou digite '${Commands.SKIP}' se quiser pular a descrição):`, true, `Escreva ${Commands.CREATE} para criar um novo tópico`);
    }

    private async handleTopicDescriptionInput(user: User, description: string): Promise<void> {
        if (description.toUpperCase() === Commands.SKIP) {
            description = "";
        }
        const topic = await this.userTopicService.finalizeTopicCreation(user, description);
        await this.userTopicService.setUserTopicState(user, UserTopicState.DEFAULT);
        await this.messageService.sendMessage(user.phone_number, `Seu tópico "${topic.title}" foi criado!`, true, `Escreva ${Commands.CREATE} para criar um novo tópico`);
        await this.initializeUserTopicStage(user);
    }

    private async handleOtherCommands(user: User, command: string): Promise<void> {
        const userTopicStage = await this.userTopicService.getUserTopicStage(user);
        if (!userTopicStage) {
            await this.initializeUserTopicStage(user);
            return;
        }

        switch (command.toUpperCase()) {
            case Commands.BACK:
                await this.goBack(user);
                break;
            case Commands.RESTART:
                await this.initializeUserTopicStage(user);
                await this.menuProcessor.initializeUserMenuStage(user);
                break;
            case Commands.CREATE:
                await this.promptUserToCreateTopic(user);
                break;
            default:
                await this.processSelectedOption(user, command);
                break;
        }
    }

    private async promptUserToCreateTopic(user: User): Promise<void> {
        await this.userTopicService.setUserTopicState(user, UserTopicState.AWAITING_TOPIC_TITLE);
        await this.messageService.sendMessage(user.phone_number, 'Por favor, insira um título para o seu novo tópico:', true, `Escreva ${Commands.CREATE} para criar um novo tópico`);
    }

    private async goBack(user: User): Promise<void> {
        const userTopicStage = await this.userTopicService.getUserTopicStage(user);
        if (!userTopicStage || userTopicStage.userTopicStack.length === 0) {
            await this.messageService.sendMessage(user.phone_number, 'Você já está no início.', true, `Escreva ${Commands.CREATE} para criar um novo tópico`);
            return;
        }
        userTopicStage.currentUserTopic = userTopicStage.userTopicStack.pop()!;
        await this.userTopicService.setUserTopicStage(user, userTopicStage);
        await this.displayUserTopic(user);
    }

    private async processSelectedOption(user: User, command: string): Promise<void> {
        const userTopicStage = await this.userTopicService.getUserTopicStage(user);
        if (!userTopicStage) {
            await this.messageService.sendMessage(user.phone_number, 'Opção inválida. Selecione uma opção válida.', true, `Escreva ${Commands.CREATE} para criar um novo tópico`);
            return;
        }

        const selectedTopic = userTopicStage.userTopicStack.length === 0
            ? await this.userTopicService.findTopLevelTopicByOption(user, command)
            : await this.userTopicService.findChildTopicByOption(user, userTopicStage.currentUserTopic!, command);

        if (!selectedTopic) {
            await this.messageService.sendMessage(user.phone_number, 'Opção inválida. Selecione uma opção válida.', true, `Escreva ${Commands.CREATE} para criar um novo tópico`);
            return;
        }

        userTopicStage.userTopicStack.push(userTopicStage.currentUserTopic!);
        userTopicStage.currentUserTopic = selectedTopic;
        await this.userTopicService.setUserTopicStage(user, userTopicStage);
        await this.displayUserTopic(user);

        if (!selectedTopic.action) return;

        const actionResponse = await this.executeAction.execute(selectedTopic.action.id, user);
        if (actionResponse) {
            await this.messageService.sendMessage(user.phone_number, actionResponse, true, `Escreva ${Commands.CREATE} para criar um novo tópico`);
        }
    }

    public async displayUserTopic(user: User): Promise<void> {
        const userTopicStage = await this.userTopicService.getUserTopicStage(user);
        if (!userTopicStage) return;

        const response = userTopicStage.userTopicStack.length === 0
            ? userTopicStage.topLevelUserTopics.map(topic => `${topic.option} - ${topic.title}`).join('\n')
            : `${userTopicStage.currentUserTopic!.title}\n${userTopicStage.currentUserTopic!.description}\n\n` + 
              userTopicStage.currentUserTopic!.children?.map(child => `- ${child.option}. ${child.title}`).join('\n');

        await this.messageService.sendMessage(user.phone_number, response.trim(), true, `Escreva ${Commands.CREATE} para criar um novo tópico`);
    }
}
