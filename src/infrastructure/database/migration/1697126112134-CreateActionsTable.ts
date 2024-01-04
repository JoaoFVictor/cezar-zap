import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateActionsTable1697126112134 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE actions (
                id serial PRIMARY KEY,
                description character varying NOT NULL,
                action_type character varying,
                created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
                updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
                deleted_at timestamp NULL
            )
        `);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE actions`);
  }
}
