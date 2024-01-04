import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
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

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date = new Date();

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date = new Date();

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deleted_at?: Date;

  constructor(phoneNumber: string, user: User, content: string) {
    this.phone_number = phoneNumber;
    this.user = user;
    this.content = content;
  }
}
