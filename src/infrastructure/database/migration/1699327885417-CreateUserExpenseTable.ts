import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserExpenseTable1699327885417 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE user_expenses (
                id serial PRIMARY KEY,
                value decimal NOT NULL,
                description character varying,
                user_id integer REFERENCES users(id),
                created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
                updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
                deleted_at timestamp NULL
            )
        `);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE user_expenses`);
  }
}
