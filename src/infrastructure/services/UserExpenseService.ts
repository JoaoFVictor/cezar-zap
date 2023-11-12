import { CacheService } from '../cache/CacheService';
import { CacheTimes } from '../../config/CacheTimes';
import { User } from '../../application/entities/User';
import { UserExpense } from '../../application/entities/UserExpense';
import { UserExpenseRepository } from '../repositories/UserExpenseRepository';
import UserExpenseState from '../../application/entities/enums/UserExpenseStateEnum';
import { injectable } from 'tsyringe';

@injectable()
export class UserExpenseService {
    constructor(private userExpenseRepository: UserExpenseRepository, private cacheService: CacheService) {}

    public async createUserExpense(userExpense: UserExpense): Promise<UserExpense | null> {
        return await this.cacheService.remember(`get_user_expense_by_id_${userExpense.id}`, CacheTimes.ONE_DAY, async () => {
            return await this.userExpenseRepository.createUserExpense(userExpense);
        });
    }

    public async getUserExpenseState(user: User): Promise<number> {
        return await this.cacheService.remember(`user_${user.id}_expense_state`, CacheTimes.ONE_DAY, async () => {
            return UserExpenseState.DEFAULT;
        });
    }

    public async setUserExpenseState(user: User, userExpenseState: UserExpenseState): Promise<void> {
        await this.cacheService.put(`user_${user.id}_expense_state`, userExpenseState, CacheTimes.THIRTY_MINUTES);
    }

    public async forgetUserExpenseState(user: User): Promise<void> {
        await this.cacheService.forget(`user_${user.id}_expense_state`);
    }

    public async forgetUserExpense(user: User): Promise<void> {
        await this.cacheService.forget(`user_${user.id}_id_in_expensive`);
    }

    public async createTemporaryUserExpenseValue(user: User, value: number): Promise<void> {
        await this.cacheService.put(`temporary_user_expense_value_for_user_${user.id}`, value, CacheTimes.THIRTY_MINUTES);
    }

    public async finalizeUserExpenseCreation(user: User, description: string): Promise<UserExpense> {
        const temporaryValue = await this.cacheService.get<number>(`temporary_user_expense_value_for_user_${user.id}`);
        if (!temporaryValue) {
            throw new Error('Temporary user expense value not found.');
        }

        const newUserExpense = new UserExpense(
            temporaryValue,
            user,
            description
        );

        const createdUserExpense = await this.createUserExpense(newUserExpense);
        await this.cacheService.forget(`temporary_user_expense_value_for_user_${user.id}`);
        await this.forgetUserExpenseState(user);

        if (!createdUserExpense) {
            throw new Error('Failed to create the new user expense.');
        }

        return createdUserExpense;
    }
}
