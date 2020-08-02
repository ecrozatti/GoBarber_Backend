import nodemailer, { Transporter } from 'nodemailer';
import { injectable, inject } from 'tsyringe';

import IMailProvider from '../models/IMailProvider';
import ISendMailDTO from '../dtos/ISendMailDTO';
import IMailTemplateProvider from '@shared/container/providers/MailTemplateProvider/models/IMailTemplateProvider';
import { template } from 'handlebars';

@injectable()
// sera utilizado apenas em ambiente de desenvolvimento
export default class EtherealMailProvider implements IMailProvider {
   private client: Transporter;

   constructor(
      @inject('MailTemplateProvider')
      private mailTemplateProvider: IMailTemplateProvider,
   ) {
      // usamos THEN, pq nao async/await no constructor
      nodemailer.createTestAccount().then(account => {
         const transporter = nodemailer.createTransport({
            host: account.smtp.host,
            port: account.smtp.port,
            secure: account.smtp.secure,
            auth: {
               user: account.user,
               pass: account.pass
            }
         });
   
         this.client = transporter;
      });
   }

   public async sendMail({ from, to, subject, templateData }: ISendMailDTO): Promise<void> {
      const message = await this.client.sendMail({
         from: {
            // se nao existir usar o texto
            name: from?.name || 'Equipe GoBarber',
            address: from?.email || 'equipe@gobarber.com.br', 
         },
         to: {
            name: to.name,
            address: to.email,
         },
         subject,
         // text: await this.mailTemplateProvider.parse(templateData),
         html: await this.mailTemplateProvider.parse(templateData),
      });

      console.log('Message sent: %s', message.messageId);
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(message));
   }
}