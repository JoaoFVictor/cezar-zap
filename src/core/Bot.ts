import { Client, LocalAuth } from 'whatsapp-web.js';

import { MessageProcessor } from './MessageProcessor';
import { injectable } from 'tsyringe';
import qrcode from 'qrcode-terminal';

@injectable()
export class WhatsAppBot {
    private client: Client;

    constructor(private messageProcessor: MessageProcessor) {
        this.client = new Client({
            puppeteer: {
                args: ['--no-sandbox'],
            },
            authStrategy: new LocalAuth()
        });
    }

    async initialize() {
        this.client.on('qr', qr => {
            qrcode.generate(qr, { small: true });
        });

        this.client.on('authenticated', (session) => {
            console.log('Autenticado com sucesso!', session);
        });

        this.client.on('ready', () => {
            console.log('Client está pronto para receber mensagens');
        });

        this.client.on('message', async (message) => {
            console.log('Mensagem recebida de', message.from, message.body);
            const response = await this.messageProcessor.processMessage(message.from, message.body);
            if (response) {
                message.reply(response);
            }
        });

        this.client.on('disconnected', (reason) => {
            console.log('Cliente foi desconectado', reason);
        });

        await this.client.initialize();
    }
}

