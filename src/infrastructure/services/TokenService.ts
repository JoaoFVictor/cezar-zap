import 'dotenv/config';

import { sign, verify } from 'jsonwebtoken';

import { injectable } from 'tsyringe';

@injectable()
export class TokenService {
    generateToken(payload: object): string {
        return sign(payload as object, process.env.JWT_SECRET_KEY!, { expiresIn: process.env.JWT_SECRET_TIME! });
    }

    isTokenValid(token: string): boolean {
        try {
            verify(token, process.env.JWT_SECRET_KEY!);
            return true;
        } catch (err) {
            return false;
        }
    }

    decodeToken<T = any>(token: string): T {
        return verify(token, process.env.JWT_SECRET_KEY!) as T;
    }
}
