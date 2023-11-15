import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUsersTable1697080296534 implements MigrationInterface {
  name = 'CreateUsersTable1697080296534';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE users (
                id serial PRIMARY KEY,
                phone_number character varying NOT NULL,
                is_authenticated boolean NOT NULL DEFAULT false,
                token character varying,
                otp character varying
            )
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE users`);
  }
}
