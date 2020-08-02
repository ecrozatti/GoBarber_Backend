import IMailProvider from '../models/IMailProvider';
import ISendMailDTO from '../dtos/ISendMailDTO';


class FakeMailProvider implements IMailProvider {
    private messages: ISendMailDTO[] = [];

    // Envio de email fake, apenas armazena no vetor
    public async sendMail(message: ISendMailDTO): Promise<void> {
        this.messages.push(message);
    }
}

export default FakeMailProvider;