import { injectable, inject } from 'tsyringe';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import User from '@modules/users/infra/typeorm/entities/User';
import AppError from '@shared/errors/AppError';
import IUsersRepository from '../repositories/IUsersReopsitory';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';

interface IRequest {
   name: string;
   email: string;
   password: string;
}

@injectable()
class CreateUserService {
   // recebe o repositório como parâmetro (o serviço não sabe que tipo de BD (Deepndency Inversion))
   constructor(
      @inject('UsersRepository')
      private usersRepository: IUsersRepository,

      @inject('HashProvider')
      private hashProvider: IHashProvider,

      @inject('CacheProvider')
      private cacheProvider: ICacheProvider,
   ) {}

   public async execute({ name, email, password }: IRequest): Promise<User> {
      const checkUserExists = await this.usersRepository.findByEmail(email);

      if (checkUserExists) {
         throw new AppError('Email address already used.');
      }

      const hashedPassword = await this.hashProvider.generateHash(password);

      // aqui não é necessário await, pq está criando apenas uma instância.
      // const user = usersRepository.create({
      //    name,
      //    email,
      //    password: hashedPassword,
      // });
      // await usersRepository.save(user);

      // agora nosso create, cria e salva.
      const user = this.usersRepository.create({
         name,
         email,
         password: hashedPassword,
      });

      await this.cacheProvider.invalidatePrefix('providers-list');

      return user;
   }
}

export default CreateUserService;
