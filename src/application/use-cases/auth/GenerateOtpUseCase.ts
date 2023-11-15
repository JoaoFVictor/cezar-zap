import { User } from '../../entities/User';
import { UserService } from '../../../infrastructure/services/UserService';
import { injectable } from 'tsyringe';

@injectable()
export class GenerateOtpUseCase {
  constructor(private userService: UserService) {}

  async execute(phoneNumber: string): Promise<string> {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const user = new User(phoneNumber, false, undefined, otp);
    await this.userService.createUser(user);
    return otp;
  }
}
