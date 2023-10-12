import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Action } from '../../actions/models/Action';

@Entity('menus')
export class Menu {

    @PrimaryGeneratedColumn()
    public id!: string;

    @Column()
    public option: string;

    @Column()
    public title: string;

    @Column({ nullable: true })
    public description?: string;

    @ManyToOne(() => Action)
    @JoinColumn({ name: 'action_id' })
    public action?: Action;

    @OneToMany(() => Menu, menu => menu.parent)
    @JoinColumn({ name: 'parent_id' })
    public children?: Menu[];

    @ManyToOne(() => Menu)
    @JoinColumn({ name: 'parent_id' })
    public parent?: Menu;


    constructor(option: string, title: string, description?: string, action?: Action, children?: Menu[]) {
        this.option = option;
        this.title = title;
        this.description = description;
        this.action = action;
        this.children = children;
    }
}