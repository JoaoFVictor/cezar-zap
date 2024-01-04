import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserTopicsTable1697336912858 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE user_topics (
                id serial PRIMARY KEY,
                title character varying NOT NULL,
                option character varying NOT NULL,
                description character varying,
                action_id integer REFERENCES actions(id),
                user_id integer REFERENCES users(id),
                created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
                updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
                deleted_at timestamp NULL
            )
        `);

    await queryRunner.query(`
            ALTER TABLE user_topics ADD COLUMN parent_id integer REFERENCES user_topics(id)
        `);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE user_topics`);
  }
}
