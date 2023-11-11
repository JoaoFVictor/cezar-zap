import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';

import { Action } from './Action';
import { User } from './User';

@Entity('user_topics')
export class UserTopic {

    @PrimaryGeneratedColumn()
    public id!: number;

    @Column()
    public title: string;

    @Column()
    public option: string;

    @Column({ nullable: true })
    public description?: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    public user?: User;

    @ManyToOne(() => Action)
    @JoinColumn({ name: 'action_id' })
    public action?: Action;

    @OneToMany(() => UserTopic, userTopic => userTopic.parent)
    @JoinColumn({ name: 'parent_id' })
    public children?: UserTopic[];

    @ManyToOne(() => UserTopic)
    @JoinColumn({ name: 'parent_id' })
    public parent?: UserTopic;

    constructor(title: string, option: string, description?: string, user?: User, action?: Action, children?: UserTopic[]) {
        this.title = title;
        this.option = option;
        this.description = description;
        this.user = user;
        this.action = action;
        this.children = children;
    }
}
