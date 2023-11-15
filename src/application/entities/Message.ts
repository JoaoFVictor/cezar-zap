import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { User } from './User';

@Entity('user_messages')
export class Message {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column()
  public phone_number: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  public user: User;

  @Column()
  public content: string;

  constructor(phoneNumber: string, user: User, content: string) {
    this.phone_number = phoneNumber;
    this.user = user;
    this.content = content;
  }
}
