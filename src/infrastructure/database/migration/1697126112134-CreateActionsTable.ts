import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateActionsTable1697126112134 implements MigrationInterface {
  name = 'CreateActionsTable1697126112134';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE actions (
                id serial PRIMARY KEY,
                description character varying NOT NULL,
                action_type character varying
            )
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE actions`);
  }
}
