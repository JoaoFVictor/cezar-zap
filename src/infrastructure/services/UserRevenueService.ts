import { CacheService } from '../cache/CacheService';
import { CacheTimes } from '../../config/CacheTimes';
import { User } from '../../application/entities/User';
import { UserRevenue } from '../../application/entities/UserRevenue';
import { UserRevenueRepository } from '../repositories/UserRevenueRepository';
import UserRevenueState from '../../application/entities/enums/UserRevenueStateEnum';
import { injectable } from 'tsyringe';

@injectable()
export class UserRevenueService {
    constructor(private userRevenueRepository: UserRevenueRepository, private cacheService: CacheService) {}

    public async createUserRevenue(userRevenue: UserRevenue): Promise<UserRevenue | null> {
        return await this.cacheService.remember(`get_user_revenue_by_id_${userRevenue.id}`, CacheTimes.ONE_DAY, async () => {
            return await this.userRevenueRepository.createUserRevenue(userRevenue);
        });
    }

    public async getUserRevenueState(user: User): Promise<number> {
        return await this.cacheService.remember(`user_${user.id}_revenue_state`, CacheTimes.ONE_DAY, async () => {
            return UserRevenueState.DEFAULT;
        });
    }

    public async setUserRevenueState(user: User, userRevenueState: UserRevenueState): Promise<void> {
        await this.cacheService.put(`user_${user.id}_revenue_state`, userRevenueState, CacheTimes.THIRTY_MINUTES);
    }

    public async forgetUserRevenueState(user: User): Promise<void> {
        await this.cacheService.forget(`user_${user.id}_revenue_state`);
    }

    public async forgetUserRevenue(user: User): Promise<void> {
        await this.cacheService.forget(`user_${user.id}_id_in_expensive`);
    }

    public async createTemporaryUserRevenueValue(user: User, value: number): Promise<void> {
        await this.cacheService.put(`temporary_user_revenue_value_for_user_${user.id}`, value, CacheTimes.THIRTY_MINUTES);
    }

    public async finalizeUserRevenueCreation(user: User, description: string): Promise<UserRevenue> {
        const temporaryValue = await this.cacheService.get<number>(`temporary_user_revenue_value_for_user_${user.id}`);
        if (!temporaryValue) {
            throw new Error('Temporary user revenue value not found.');
        }

        const newUserRevenue = new UserRevenue(
            temporaryValue,
            user,
            description
        );

        const createdUserRevenue = await this.createUserRevenue(newUserRevenue);
        await this.cacheService.forget(`temporary_user_revenue_value_for_user_${user.id}`);
        await this.forgetUserRevenueState(user);

        if (!createdUserRevenue) {
            throw new Error('Failed to create the new user Revenue.');
        }

        return createdUserRevenue;
    }
}
