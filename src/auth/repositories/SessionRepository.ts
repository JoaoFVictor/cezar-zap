import { Session } from '../models/Session';

export class SessionRepository {
    private sessions: Session[] = [];

    create(session: Session): void {
        this.sessions.push(session);
    }

    findByPhoneNumber(phoneNumber: string): Session | undefined {
        return this.sessions.find(session => session.phoneNumber === phoneNumber);
    }
}
