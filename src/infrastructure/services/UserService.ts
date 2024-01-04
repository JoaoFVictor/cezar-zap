import { CacheService } from '../cache/CacheService';
import { CacheTimes } from '../../config/CacheTimes';
import { User } from '../../application/entities/User';
import { UserRepository } from '../repositories/UserRepository';
import { injectable } from 'tsyringe';

@injectable()
export class UserService {
  constructor(
    private userRepository: UserRepository,
    private cacheService: CacheService
  ) {}

  async findByPhoneNumber(phoneNumber: string): Promise<User | null> {
    return await this.cacheService.remember(`get_user_by_phone_number_${phoneNumber}`, CacheTimes.ONE_DAY, async () => {
      return await this.userRepository.findByPhoneNumber(phoneNumber);
    });
  }

  async createUser(user: User): Promise<User | null> {
    await this.cacheService.forget(`get_user_by_phone_number_${user.phone_number}`);
    return await this.userRepository.createUser(user);
  }

  async updateUser(user: User): Promise<User | null> {
    await this.cacheService.forget(`get_user_by_phone_number_${user.phone_number}`);
    return await this.userRepository.updateUser(user);
  }
}
