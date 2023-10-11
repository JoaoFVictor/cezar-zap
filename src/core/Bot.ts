import { Client, LocalAuth } from 'whatsapp-web.js';

import { MessageProcessor } from './MessageProcessor';
import qrcode from 'qrcode-terminal';

export class WhatsAppBot {
    private client: Client;
    private messageProcessor: MessageProcessor;

    constructor(messageProcessor: MessageProcessor) {
        this.messageProcessor = messageProcessor;
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

        this.client.on('message', message => {
            console.log('Mensagem recebida de', message.from, message.body);
            const response = this.messageProcessor.processMessage(message.from, message.body);
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

