import { MigrationInterface, QueryRunner } from "typeorm"

export class InserMenuData1697139715094 implements MigrationInterface {
    name = 'InserMenuData1697139715094';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            INSERT INTO menus (option, title, description)
            VALUES ('main', 'Menu Principal', 'Gestão Financeira')
        `);

        const insertedMenu = await queryRunner.query(`
            SELECT id FROM menus WHERE option = 'main'
        `);
        const mainMenuId = insertedMenu[0].id;

        await queryRunner.query(`
            INSERT INTO menus (option, title, description, parent_id)
            VALUES 
                ('1', 'Orçamentos', 'Gerencie seus orçamentos', ${mainMenuId}),
                ('2', 'Despesas', 'Acompanhe suas despesas', ${mainMenuId}),
                ('3', 'Receitas', 'Registre e monitore suas receitas', ${mainMenuId}),
                ('4', 'Relatórios', 'Obtenha relatórios financeiros', ${mainMenuId}),
                ('5', 'Investimentos', 'Monitore seus investimentos', ${mainMenuId});
        `);

        const insertedDespesasMenu = await queryRunner.query(`
            SELECT id FROM menus WHERE option = '2'
        `);
        const despesasMenuId = insertedDespesasMenu[0].id;

        await queryRunner.query(`
            INSERT INTO menus (option, title, description, parent_id)
            VALUES 
                ('2.1', 'Adicionar despesa', 'Adicione uma nova despesa', ${despesasMenuId}),
                ('2.2', 'Editar despesa', 'Modifique uma despesa existente', ${despesasMenuId}),
                ('2.3', 'Visualizar despesas', 'Veja todas as suas despesas', ${despesasMenuId}),
                ('2.4', 'Deletar despesa', 'Remova uma despesa', ${despesasMenuId});
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Removendo submenus de Despesas
        await queryRunner.query(`
            DELETE FROM menus WHERE option IN ('2.1', '2.2', '2.3', '2.4')
        `);

        // Removendo submenus
        await queryRunner.query(`
            DELETE FROM menus WHERE option IN ('1', '2', '3', '4', '5')
        `);

        // Removendo o menu principal
        await queryRunner.query(`
            DELETE FROM menus WHERE option = 'main'
        `);
    }
}
