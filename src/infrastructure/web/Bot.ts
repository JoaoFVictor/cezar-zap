import { Client } from 'whatsapp-web.js';
import { inject, injectable } from 'tsyringe';
import qrcode from 'qrcode-terminal';
import { MessageCommandHandlerUseCase } from '../../application/use-cases/message/MessageCommandHandlerUseCase';

@injectable()
export class WhatsAppBot {
    constructor(private messageCommandHandlerUseCase: MessageCommandHandlerUseCase, @inject("ClientWhatsApp") private client: Client) {}

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
            await this.messageCommandHandlerUseCase.execute(message.from, message.body);
        });

        this.client.on('disconnected', (reason) => {
            console.log('Cliente foi desconectado', reason);
        });

        await this.client.initialize();
    }
}

