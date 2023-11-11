import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { CacheService } from '../infrastructure/cache/CacheService';
import { User } from './User';

@Entity('actions')
export class Action {

    @PrimaryGeneratedColumn()
    public id!: number;

    @Column()
    public description: string;

    @Column({ nullable: true })
    public action_type?: string;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public async execute(user: User): Promise<string | void> {
        throw new Error("Action not implemented.");
    }

    protected cacheService: CacheService | null;

    constructor(description: string, action_type?: string, cacheService?: CacheService | null) {
        this.description = description;
        this.action_type = action_type;
        this.cacheService = cacheService ?? null;
        console.log(action_type);
    }
}
