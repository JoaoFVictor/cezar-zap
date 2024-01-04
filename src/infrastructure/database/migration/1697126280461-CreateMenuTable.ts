import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateMenuTable1697126280461 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE menus (
                id serial PRIMARY KEY,
                option character varying NOT NULL,
                title character varying NOT NULL,
                description character varying,
                action_id integer REFERENCES actions(id),
                created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
                updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
                deleted_at timestamp NULL
            )
        `);

    await queryRunner.query(`
            ALTER TABLE menus ADD COLUMN parent_id integer REFERENCES menus(id)
        `);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE menus`);
  }
}
