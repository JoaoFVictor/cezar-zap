import { MigrationInterface, QueryRunner } from "typeorm"

export class InsertActionData1697151395196 implements MigrationInterface {
    name = 'InsertActionData1697151395196';

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Inserindo algumas ações de exemplo na tabela "actions"
        await queryRunner.query(`
            INSERT INTO actions (description)
            VALUES 
                ('Descrição da Ação 1'),
                ('Descrição da Ação 2'),
                ('Descrição da Ação 3'),
                ('Descrição da Ação 4')
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Removendo as ações inseridas pela função `up` desta migração.
        await queryRunner.query(`
            DELETE FROM actions 
            WHERE description IN ('Descrição da Ação 1', 'Descrição da Ação 2', 'Descrição da Ação 3', 'Descrição da Ação 4')
        `);
    }
}
