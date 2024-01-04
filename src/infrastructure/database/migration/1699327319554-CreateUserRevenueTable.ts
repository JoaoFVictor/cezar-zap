import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserRevenueTable1699327319554 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE user_revenues (
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
    await queryRunner.query(`DROP TABLE user_revenues`);
  }
}
