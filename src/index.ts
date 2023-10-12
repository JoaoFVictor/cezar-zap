import 'reflect-metadata';

import { ActionFactory } from './actions/factory/ActionFactory';
import { ActionRepository } from './actions/repositories/ActionRepository';
import { ActionService } from './actions/services/ActionService';
import { AppDataSource } from './data-source';
import { AuthenticationService } from './auth/services/AuthenticationService';
import { MenuRepository } from './menu/repositories/MenuRepository';
import { MenuService } from './menu/services/MenuService';
import { MessageProcessor } from './core/MessageProcessor';
import { UserRepository } from './auth/repositories/UserRepository';
import { WhatsAppBot } from './core/Bot';

(async function main() {
    AppDataSource.initialize()
    .then(() => {
      console.log("Data Source has been initialized!");
    })
    .catch((err) => {
      console.error("Error during Data Source initialization:", err);
    });
    
    const actionRepository = new ActionRepository(AppDataSource);
    const actionFactory = new ActionFactory();
    const actionService = new ActionService(actionRepository, actionFactory);
    
    const userRepository = new UserRepository(AppDataSource);
    const authService = new AuthenticationService(userRepository);

    const menuRepository = new MenuRepository(AppDataSource);
    const menuService = new MenuService(menuRepository);
    
    const messageProcessor = new MessageProcessor(actionService, authService, menuService);
    
    const bot = new WhatsAppBot(messageProcessor);
    bot.initialize();
})().catch(error => {
    console.error("Error initializing the app:", error);
});