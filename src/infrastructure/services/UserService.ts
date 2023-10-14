import { CacheService } from '../cache/CacheService';
import { User } from '../../entities/User';
import { UserRepository } from '../repositories/UserRepository';
import { injectable } from 'tsyringe';

@injectable()
export class UserService {
    constructor(private userRepository: UserRepository, private cacheService: CacheService) {}

    async findByPhoneNumber(phoneNumber: string): Promise<User | null> {
        return await this.cacheService.remember(`get_user_by_phone_number_${phoneNumber}`, 60, async () => {
            return await this.userRepository.findByPhoneNumber(phoneNumber);
        })
    }

    async createUser(user: User): Promise<User | null> {
        return await this.userRepository.save(user);
    }

    async updateUser(user: User): Promise<User | null> {
        return await this.userRepository.save(user);
    }
}
