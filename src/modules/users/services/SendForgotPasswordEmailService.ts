import { injectable, inject } from 'tsyringe';
import path from 'path';

// import User from '@modules/users/infra/typeorm/entities/User';
import AppError from '@shared/errors/AppError';
import IUsersRepository from '../repositories/IUsersReopsitory';
import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider';
import IUserTokensRepository from '../repositories/IUserTokensRepository';

interface IRequest {
   email: string;
}

@injectable()
class SendForgotPasswordEmailService {
   // recebe o repositório como parâmetro (o serviço não sabe que tipo de BD (Deepndency Inversion))
   constructor(
      @inject('UsersRepository')
      private usersRepository: IUsersRepository,

      @inject('MailProvider')
      private mailProvider: IMailProvider,

      @inject('UserTokensRepository')
      private UserTokensRepository : IUserTokensRepository,
   ) {}

   public async execute({ email }: IRequest): Promise<void> {
      const user = await this.usersRepository.findByEmail(email);

      if (!user) {
         throw new AppError('User does not exists.');
      }

      const { token } = await this.UserTokensRepository.generate(user.id);

      const forgotPasswordTemplate = path.resolve(__dirname, '..', 'views', 'forgot-password.hbs');

      await this.mailProvider.sendMail({
         to: {
            name: user.name,
            email: user.email,
         },
         subject: '[GoBarber] Recuperação de senha',
         templateData: {
            file: forgotPasswordTemplate,
            variables: {
               name: user.name,
               link: `http://localhost:3000/reset-password?token=${token}`,
            }
         }
      });
   }
}

export default SendForgotPasswordEmailService;
