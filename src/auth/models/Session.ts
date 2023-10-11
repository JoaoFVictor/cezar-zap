export class Session {
    constructor(
        public phoneNumber: string,
        public isAuthenticated: boolean,
        public token?: string,
        public otp?: string
    ) {}
}
