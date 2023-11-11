import { DataSource, Repository } from 'typeorm';

import { Message } from '../../entities/Message';
import { inject, injectable } from 'tsyringe';

@injectable()
export class MessageRepository extends Repository<Message> {
    constructor(@inject("DataSource") private dataSource: DataSource)
    {
        super(Message, dataSource.createEntityManager());
    }

    async createMessage(message: Message): Promise<Message> {
        return await this.save(message);
    }
}
