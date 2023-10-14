import 'reflect-metadata';

import { AppDataSource } from './database/data-source';
import { DataSource } from 'typeorm';
import { MessageProcessor } from './core/MessageProcessor';
import Redis from 'ioredis';
import { WhatsAppBot } from './core/Bot';
import { container } from 'tsyringe';

(async function main() {
  try {
    const dataSourceInstance = await AppDataSource.initialize();
    container.register<DataSource>("DataSource", { useValue: dataSourceInstance });
    container.register<Redis>("RedisToken", { useValue: new Redis({
        port: 6379,
        host: "redis",
      })
    });
    console.log("Data Source has been initialized!");

    const messageProcessor = container.resolve(MessageProcessor);
    const bot = new WhatsAppBot(messageProcessor);
    bot.initialize();
  } catch (error) {
    console.error("Error initializing the app:", error);
  }
})();
