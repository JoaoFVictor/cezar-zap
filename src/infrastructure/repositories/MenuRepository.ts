import { DataSource, Repository } from 'typeorm';

import { inject, injectable } from 'tsyringe';
import { Menu } from '../../application/entities/Menu';

@injectable()
export class MenuRepository extends Repository<Menu> {
  constructor(@inject('DataSource') private dataSource: DataSource) {
    super(Menu, dataSource.createEntityManager());
  }

  async findByOption(option: string): Promise<Menu | null> {
    return await this.findOne({
      where: { option: option },
      relations: ['children', 'action'],
    });
  }

  async findByOptionAndParentMenuId(option: string, id: string): Promise<Menu | null> {
    return await this.findOne({
      where: { parent: { id: id }, option: option },
      relations: ['children', 'action'],
    });
  }
}
