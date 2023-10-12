import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('users')
export class User {

    @PrimaryColumn()
    public phone_number: string;
    
    @Column({ default: false })
    public is_authenticated: boolean;

    @Column({ nullable: true })
    public token?: string;

    @Column({ nullable: true })
    public otp?: string;

    constructor(phoneNumber: string, isAuthenticated: boolean, token?: string, otp?: string) {
        this.phone_number = phoneNumber;
        this.is_authenticated = isAuthenticated;
        this.token = token;
        this.otp = otp;
    }
}
