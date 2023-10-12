import 'dotenv/config'

import { sign, verify } from 'jsonwebtoken';

import { User } from '../models/User';
import { UserRepository } from '../repositories/UserRepository';

export class AuthenticationService {
    constructor(private userRepository: UserRepository) {}

    async findByPhoneNumber(phoneNumber: string): Promise<User | null> {
        return this.userRepository.findByPhoneNumber(phoneNumber);
    }    

    async generateOtp(phoneNumber: string): Promise<string> {
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const user = new User(phoneNumber, false, undefined, otp);
        await this.userRepository.createUser(user);
        return otp;
    }

    async authenticate(phoneNumber: string, otp: string): Promise<boolean> {
        const user = await this.findByPhoneNumber(phoneNumber);
        if (user && user.otp === otp) {
            user.is_authenticated = true;
            user.otp = undefined;

            const payload = {
                phoneNumber: user.phone_number,
                timestamp: new Date().getTime()
            };

            const token = sign(payload as object, process.env.JWT_SECRET_KEY!, { expiresIn: process.env.JWT_SECRET_TIME });
            user.token = token;
            await this.userRepository.updateUser(user);
            return true;
        }
        return false;
    }

    isTokenValid(token: string): boolean {
        try {
            const decoded: any = verify(token, process.env.JWT_SECRET_KEY!);
            return !!decoded;
        } catch (err) {
            return false;
        }
    }

    async refreshToken(token: string): Promise<string | null> {
        if (this.isTokenValid(token)) {
            const decoded: any = verify(token, process.env.JWT_SECRET_KEY!);
            const newToken = sign(decoded as object, process.env.JWT_SECRET_KEY!, { expiresIn: process.env.JWT_SECRET_TIME });

            const user = await this.userRepository.findByPhoneNumber(decoded.phoneNumber);
            if (user) {
                user.token = newToken;
                await this.userRepository.updateUser(user);
            }
            return newToken;
        }
        return null;
    }
}
