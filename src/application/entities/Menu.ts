import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Action } from './Action';

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

  @OneToMany(() => Menu, (menu) => menu.parent)
  @JoinColumn({ name: 'parent_id' })
  public children?: Menu[];

  @ManyToOne(() => Menu)
  @JoinColumn({ name: 'parent_id' })
  public parent?: Menu;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date = new Date();

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date = new Date();

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deleted_at?: Date;

  constructor(option: string, title: string, description?: string, action?: Action, children?: Menu[]) {
    this.option = option;
    this.title = title;
    this.description = description;
    this.action = action;
    this.children = children;
  }
}
