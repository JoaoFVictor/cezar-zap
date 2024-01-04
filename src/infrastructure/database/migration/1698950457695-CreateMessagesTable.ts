import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateMessagesTable1698950457695 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE user_messages (
                id serial PRIMARY KEY,
                phone_number character varying NOT NULL,
                user_id integer REFERENCES users(id),
                content character varying NOT NULL,
                created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
                updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
                deleted_at timestamp NULL
            )
        `);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE user_messages`);
  }
}
