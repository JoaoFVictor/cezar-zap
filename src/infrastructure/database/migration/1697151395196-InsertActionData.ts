import { MigrationInterface, QueryRunner } from 'typeorm';

export class InsertActionData1697151395196 implements MigrationInterface {
  name = 'InsertActionData1697151395196';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Inserindo algumas ações de exemplo na tabela "actions"
    await queryRunner.query(`
            INSERT INTO actions (description, action_type)
            VALUES 
                ('Start user topic', 'user-topic-init'),
                ('Start user expense', 'user-expense-init'),
                ('Start user revenue', 'user-revenue-init')
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Removendo as ações inseridas pela função `up` desta migração.
    await queryRunner.query(`
            DELETE FROM actions 
            WHERE description IN ('Start user topic', 'Start user expense', 'Start user revenue')
        `);
  }
}
