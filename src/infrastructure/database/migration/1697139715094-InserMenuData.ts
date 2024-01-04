import { MigrationInterface, QueryRunner } from 'typeorm';

export class InserMenuData1697139715094 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            INSERT INTO menus (option, title, description)
            VALUES ('main', 'Menu Principal', 'Menu base')
        `);

    const insertedMenu = await queryRunner.query(`
            SELECT id FROM menus WHERE option = 'main'
        `);
    const mainMenuId = insertedMenu[0].id;

    await queryRunner.query(`
            INSERT INTO menus (option, title, description, parent_id)
            VALUES 
                ('1', 'Gestão Financeira', 'Gerencie suas despesas e receitas', ${mainMenuId});
        `);

    const insertedFinancialManagement = await queryRunner.query(`
            SELECT id FROM menus WHERE option = '1'
        `);
    const financialManagement = insertedFinancialManagement[0].id;

    await queryRunner.query(`
            INSERT INTO menus (option, title, description, parent_id)
            VALUES 
                ('1.1', 'Adicionar despesa', 'Adicione uma nova despesa', ${financialManagement}),
                ('1.2', 'Adicionar receita', 'Adicione uma nova receita', ${financialManagement}),
                ('1.3', 'Consultar despesa', 'Adicione uma nova receita', ${financialManagement}),
                ('1.4', 'Consultar receita', 'Adicione uma nova receita', ${financialManagement})
        `);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DELETE FROM menus WHERE option IN ('1.1', '1.2')
        `);

    await queryRunner.query(`
            DELETE FROM menus WHERE option IN ('1')
        `);

    await queryRunner.query(`
            DELETE FROM menus WHERE option = 'main'
        `);
  }
}
