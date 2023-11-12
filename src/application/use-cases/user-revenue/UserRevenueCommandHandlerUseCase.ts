import Commands from '../../entities/enums/CommandsEnum';
import { MessageService } from '../../../infrastructure/services/MessageService';
import { User } from '../../entities/User';
import { UserRevenueService } from '../../../infrastructure/services/UserRevenueService';
import UserRevenueState from '../../entities/enums/UserRevenueStateEnum';
import { UserTopic } from '../../entities/UserTopic';
import { UserTopicCommandHandlerUseCase } from '../user-topic/UserTopicCommandHandlerUseCase';
import { injectable } from 'tsyringe';

@injectable()
export class UserRevenueCommandHandlerUseCase {
    constructor(private userRevenueService: UserRevenueService, private messageService: MessageService, private userTopicCommandHandlerUseCase: UserTopicCommandHandlerUseCase) {}

    async processUserRevenueCommand(user: User, command: string): Promise<void> {
        switch (command) {
            case Commands.BACK:
                await this.goBack(user);
                return;
            case Commands.CREATE:
                await this.initializeUserRevenueStage(user);
                return;
        }

        const userRevenueState = await this.userRevenueService.getUserRevenueState(user);
        switch (userRevenueState) {
            case UserRevenueState.DEFAULT:
                await this.initializeUserRevenueStage(user);
                break;
            case UserRevenueState.AWAITING_REVENUE_VALUE:
                await this.handleRevenueValueCreation(user, parseFloat(command));
                break;
            case UserRevenueState.AWAITING_REVENUE_DESCRIPTION:
                await this.handleExpenseCreation(user, command);
                break;
        }
    }

    public async initializeUserRevenueStage(user: User): Promise<{ currentUserTopic: UserTopic, userTopicStack: UserTopic[] } | void> {
        await this.userRevenueService.setUserRevenueState(user, UserRevenueState.AWAITING_REVENUE_VALUE);
        await this.messageService.sendMessage(user.phone_number, "Por favor o valor da receita:", true, `Escreva ${Commands.CREATE} para criar novo tipo de receita`);
        return;
    }

    private async handleRevenueValueCreation(user: User, value: number): Promise<void> {
        await this.userRevenueService.setUserRevenueState(user, UserRevenueState.AWAITING_REVENUE_DESCRIPTION);
        await this.userRevenueService.createTemporaryUserRevenueValue(user, value);
        await this.messageService.sendMessage(user.phone_number, `Agora, insira uma descrição para a receita:`, true, `Escreva ${Commands.CREATE} para criar novo tipo de receita`);
    }

    private async handleExpenseCreation(user: User, description: string): Promise<void> {
        if (description === Commands.SKIP) {
            description = "";
        }

        await this.userRevenueService.finalizeUserRevenueCreation(user, description);
        await this.messageService.sendMessage(user.phone_number, 'Sua receita foi criada!', true, `Escreva ${Commands.CREATE} para criar novo tipo de receita`);
        await this.goBack(user);
    }

    private async goBack(user: User): Promise<void> {
        await this.userRevenueService.forgetUserRevenue(user);
        await this.userTopicCommandHandlerUseCase.displayUserTopic(user);
    }
}
