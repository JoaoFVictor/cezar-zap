import { DataSource, EntityRepository, Repository } from 'typeorm';

import { Menu } from '../models/Menu';

export class MenuRepository extends Repository<Menu> {
    constructor(private dataSource: DataSource)
    {
        super(Menu, dataSource.createEntityManager());
    }

    async findByOption(option: string): Promise<Menu | null> {
        return await this.findOne({ where: { option: option }, relations: ['children', 'action'] });
    }

    async findByOptionAndParentMenuId(option: string, id: string): Promise<Menu | null> {
        return await this.findOne({ where: { parent: { id: id }, option: option}, relations: ['children', 'action'] });
    }
}
