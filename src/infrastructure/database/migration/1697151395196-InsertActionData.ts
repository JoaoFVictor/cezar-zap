import { MigrationInterface, QueryRunner } from 'typeorm';

export class InsertActionData1697151395196 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            INSERT INTO actions (description, action_type)
            VALUES 
                ('Start user topic', 'user-topic-init'),
                ('Start user expense', 'user-expense-init'),
                ('Start user revenue', 'user-revenue-init'),
                ('Get user expense data', 'get-user-expense-data-init'),
                ('Get user revenue data', 'get-user-revenue-data-init')
        `);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DELETE FROM actions 
            WHERE action_type IN ('user-topic-init', 'user-expense-init', 'user-revenue-init', get-user-expense-data-init, get-user-revenue-data-init)
        `);
  }
}
