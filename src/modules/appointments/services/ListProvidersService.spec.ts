import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import ListProvidersService from './ListProvidersService';

let fakeUsersRepository: FakeUsersRepository;
let listProviders: ListProvidersService;
let fakeCacheProvider: FakeCacheProvider;

describe('ListProviders', () => {
   beforeEach(() => {
      fakeUsersRepository = new FakeUsersRepository();
      fakeCacheProvider = new FakeCacheProvider();
      listProviders = new ListProvidersService(fakeUsersRepository, fakeCacheProvider);
   });

   it('should be able to list the providers', async () => {
      const user1 = await fakeUsersRepository.create({
         name: 'José',
         email: 'jose@gmail.com',
         password: '123456',
      });

      const user2 = await fakeUsersRepository.create({
         name: 'Maria',
         email: 'maria@gmail.com',
         password: '123456',
      });

      const loggedUser = await fakeUsersRepository.create({
         name: 'Eric',
         email: 'eric@gmail.com',
         password: '123456',
      });

      const providers = await listProviders.execute({
         user_id: loggedUser.id,
      });

      // esperar retornar um array que contenha user1 na prosicao 1 e user2 na 2.
      expect(providers).toEqual([user1, user2]);
    });
});
