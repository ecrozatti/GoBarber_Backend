import { getRepository, Repository } from 'typeorm';

import IUserTokensRepository from '@modules/users/repositories/IUserTokensRepository';

import UserToken from '../entities/UserToken';

class UserTokensRepository implements IUserTokensRepository {
   private ormRepository: Repository<UserToken>;

   constructor() {
      this.ormRepository = getRepository(UserToken);
   }

    public async findByToken(token: string): Promise<UserToken | undefined> {
        const userToken = await this.ormRepository.findOne({
           where: { token }
        });

        return userToken;
    }

    public async generate(user_id: string): Promise<UserToken> {
       // cria apenas uma instancia, por isso nao precisa do await
       const userToken = this.ormRepository.create({
          user_id,
       })

       // Salva no BD, por isso precisa do await
       await this.ormRepository.save(userToken);

       return userToken;
    }
}

export default UserTokensRepository;
