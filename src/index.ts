import 'reflect-metadata';
import 'dotenv/config';

import { Client, LocalAuth } from 'whatsapp-web.js';

import { AppDataSource } from './infrastructure/database/data-source';
import { DataSource } from 'typeorm';
import Redis from 'ioredis';
import { WhatsAppBot } from './infrastructure/web/Bot';
import { container } from 'tsyringe';

(async function main() {
  try {
    const dataSourceInstance = await AppDataSource.initialize();
    const redis = new Redis({
      host: process.env.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT!),
    });
    await redis.flushall();
    const client = new Client({
      puppeteer: {
        args: ['--no-sandbox'],
      },
      authStrategy: new LocalAuth(),
    });

    container.register<DataSource>('DataSource', {
      useValue: dataSourceInstance,
    });
    container.register<Redis>('RedisToken', { useValue: redis });
    container.register<Client>('ClientWhatsApp', { useValue: client });
    console.log('Data Source has been initialized!');

    const bot = container.resolve(WhatsAppBot);
    bot.initialize();
  } catch (error) {
    console.error('Error initializing the app:', error);
  }
})();
