import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { CacheService } from '../../infrastructure/cache/CacheService';
import { User } from './User';

@Entity('actions')
export class Action {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column()
  public description: string;

  @Column({ nullable: true })
  public action_type?: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date = new Date();

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date = new Date();

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deleted_at?: Date;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async execute(user: User): Promise<string | void> {
    throw new Error('Action not implemented.');
  }

  protected cacheService: CacheService | null;

  constructor(description: string, action_type?: string, cacheService?: CacheService | null) {
    this.description = description;
    this.action_type = action_type;
    this.cacheService = cacheService ?? null;
  }
}
