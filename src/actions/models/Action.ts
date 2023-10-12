import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('actions')
export class Action {

    @PrimaryGeneratedColumn()
    public id!: number;

    @Column()
    public description: string;

    @Column({ nullable: true, type: 'varchar', length: 255 })
    public action_type?: string | null;

    execute(): string | void {
        throw new Error("Action not implemented.");
    }

    constructor(description: string, action_type?: string | null) {
        this.description = description;
        this.action_type = action_type ?? null;
    }
}
