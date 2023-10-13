import { User } from "../../entities/User";
import { UserRepository } from "../../infrastructure/repositories/UserRepository";
import { injectable } from "tsyringe";

@injectable()
export class GenerateOtpUseCase {
    constructor(private userRepository: UserRepository) {}

    async execute(phoneNumber: string): Promise<string> {
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const user = new User(phoneNumber, false, undefined, otp);
        await this.userRepository.createUser(user);
        return otp;
    }
}
