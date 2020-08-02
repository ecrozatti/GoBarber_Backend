import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { injectable, inject } from 'tsyringe';

import User from '@modules/users/infra/typeorm/entities/User';

import authConfig from '@config/auth';
import AppError from '@shared/errors/AppError';
import IUsersRepository from '../repositories/IUsersReopsitory';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';

interface IRequest {
   email: string;
   password: string;
}

interface IResponse {
   user: User;
   token: string;
}

@injectable()
class AuthenticationUserService {
   constructor(
      @inject('UsersRepository')
      private usersRepository: IUsersRepository,

      @inject('HashProvider')
      private hashProvider: IHashProvider,
   ) {}

   public async execute({ email, password }: IRequest): Promise<IResponse> {
      const user = await this.usersRepository.findByEmail(email);

      if (!user) {
         throw new AppError('Incorrect email/password combination.', 401);
      }

      // user.password -> é a senha criptografada do BD
      // password -> é a senha não criptografda informada no frontend
      // const passwordMatched = await compare(password, user.password);
      const passwordMatched = await this.hashProvider.compareHash(password, user.password);


      if (!passwordMatched) {
         throw new AppError('Incorrect email/password combination.', 401);
      }

      const { secret, expiresIn } = authConfig.jwt;

      // PAYLOAD - Sign()
      // 1o. param = quais informações iremos colocar no token (dados, permissões, etc)
      // 2o. param = é uma chave secreta, password (legal utilizar o site MD5). JAMAIS pode ir para frontend
      // 3o. param = configurações do nosso token
      const token = sign({}, secret, {
         // subject sempre será o id do usuário
         subject: user.id,
         // tempo para expiração do token
         expiresIn,
      });

      return {
         user,
         token,
      };
   }
}

export default AuthenticationUserService;
