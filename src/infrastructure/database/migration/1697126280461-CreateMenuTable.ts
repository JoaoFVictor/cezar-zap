import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateMenuTable1697126280461 implements MigrationInterface {
    name = 'CreateMenuTable1697126280461';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE menus (
                id serial PRIMARY KEY,
                option character varying NOT NULL,
                title character varying NOT NULL,
                description character varying,
                action_id integer REFERENCES actions(id)
            )
        `);

        await queryRunner.query(`
            ALTER TABLE menus ADD COLUMN parent_id integer REFERENCES menus(id)
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE menus`);
    }
}