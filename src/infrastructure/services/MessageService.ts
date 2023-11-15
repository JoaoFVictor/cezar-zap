import { Message } from '../../application/entities/Message';
import Commands from '../../application/entities/enums/CommandsEnum';
import { CacheService } from '../cache/CacheService';
import { MessageRepository } from '../repositories/MessageRepository';
import { inject, injectable } from 'tsyringe';
import { Client } from 'whatsapp-web.js';

@injectable()
export class MessageService {
  constructor(
    @inject('ClientWhatsApp') private client: Client,
    private messageRepository: MessageRepository,
    private cacheService: CacheService
  ) {}

  async createMessage(message: Message): Promise<Message> {
    return await this.messageRepository.createMessage(message);
  }

  async sendMessage(
    phoneNumber: string,
    content: string,
    sendBaseCommands: boolean = true,
    additionalCommands: string | null = null
  ): Promise<void> {
    if (sendBaseCommands) {
      content = `${content}\n\nEscreva ${Commands.BACK} para voltar ao menu anterior\nEscreva ${Commands.RESTART} para voltar ao menu principal`;
    }
    if (additionalCommands) {
      content = `${content}\n${additionalCommands}`;
    }

    await this.client.sendMessage(phoneNumber, content);
  }
}
