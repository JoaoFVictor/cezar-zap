import 'dotenv/config'

import { sign, verify } from 'jsonwebtoken';

import { Session } from '../models/Session';
import { SessionRepository } from '../repositories/SessionRepository';

export class AuthenticationService {
    constructor(private sessionRepository: SessionRepository) {}

    findByPhoneNumber(phoneNumber: string): undefined | Session {
        return this.sessionRepository.findByPhoneNumber(phoneNumber);
    }

    generateOtp(phoneNumber: string): string {
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const session = new Session(phoneNumber, false, undefined, otp);
        this.sessionRepository.create(session);
        return otp;
    }

    authenticate(phoneNumber: string, otp: string): boolean {
        const session = this.findByPhoneNumber(phoneNumber);
        if (session && session.otp === otp) {
            session.isAuthenticated = true;
            session.otp = undefined;

            const payload = {
                phoneNumber: session.phoneNumber,
                timestamp: new Date().getTime()
            };

            const token = sign(payload as object, process.env.JWT_SECRET_KEY!, { expiresIn: process.env.JWT_SECRET_TIME });

            session.token = token;
            return true;
        }
        return false;
    }

    isTokenValid(token: string): boolean {
        try {
            const decoded = verify(token, process.env.JWT_SECRET_KEY!);
            return !!decoded;
        } catch (err) {
            return false;
        }
    }

    refreshToken(token: string): string | null {
        if (this.isTokenValid(token)) {
            const decoded: any = verify(token, process.env.JWT_SECRET_KEY!);
            const newToken = sign(decoded as object, process.env.JWT_SECRET_KEY!, { expiresIn: process.env.JWT_SECRET_TIME });

            const session = this.sessionRepository.findByPhoneNumber(decoded.phoneNumber);
            if (session) {
                session.token = newToken;
            }
            return newToken;
        }
        return null;
    }
}
