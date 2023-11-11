import { DataSource, Repository } from 'typeorm';

import { inject, injectable } from 'tsyringe';
import { Message } from '../../application/entities/Message';

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
