import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddActionInMenuTable1701024111954 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        UPDATE menus SET action_id = 1 WHERE option = '1'
    `);

    await queryRunner.query(`
        UPDATE menus SET action_id = 2 WHERE option = '1.1'
    `);

    await queryRunner.query(`
        UPDATE menus SET action_id = 3 WHERE option = '1.2'
    `);

    await queryRunner.query(`
        UPDATE menus SET action_id = 4 WHERE option = '1.3'
    `);

    await queryRunner.query(`
        UPDATE menus SET action_id = 5 WHERE option = '1.4'
    `);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        UPDATE menus SET action_id = NULL WHERE option IN ('1', '1.1', '1.2', '1.3', '1.4')
    `);
  }
}
