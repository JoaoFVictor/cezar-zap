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

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date = new Date();

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date = new Date();

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deleted_at?: Date;

  constructor(value: number, user: User, description?: string) {
    this.value = value;
    this.description = description;
    this.user = user;
  }
}
