import { Action } from './actions/models/Action';
import { ActionRepository } from './actions/repositories/ActionRepository';
import { ActionService } from './actions/services/ActionService';
import { AuthenticationService } from './auth/services/AuthenticationService';
import { MessageProcessor } from './core/MessageProcessor';
import { SessionRepository } from './auth/repositories/SessionRepository';
import { WhatsAppBot } from './core/Bot';

const actionRepo = new ActionRepository();
populateActionRepository(actionRepo);
const actionService = new ActionService(actionRepo);

const sessionRepo = new SessionRepository();
const authService = new AuthenticationService(sessionRepo);

const messageProcessor = new MessageProcessor(actionService, authService);

const bot = new WhatsAppBot(messageProcessor);
bot.initialize();

function populateActionRepository(repo: ActionRepository) {
    repo.create(new Action("SEND_REPORT", "Send a report", () => {
        console.log('action foi');
    }));
}