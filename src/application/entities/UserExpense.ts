import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';

import { User } from './User';

@Entity('user_expenses')
export class UserExpense {
    @PrimaryGeneratedColumn()
    public id!: number;

    @Column()
    public value: number;

    @Column({ nullable: true })
    public description?: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    public user: User;

    constructor(value: number, user: User, description?: string) {
        this.value = value;
        this.description = description;
        this.user = user;
    }
}
