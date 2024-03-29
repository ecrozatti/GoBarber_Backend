import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import AuthenticateUserService from './AuthenticateUserService';

let fakeUsersRepository: FakeUsersRepository;
let fakehashProvider: FakeHashProvider;
let authenticateUser: AuthenticateUserService;

describe('AuthenticateUser', () => {
   beforeEach(() => {
      fakeUsersRepository = new FakeUsersRepository();
      fakehashProvider = new FakeHashProvider();
      authenticateUser = new AuthenticateUserService(fakeUsersRepository, fakehashProvider);
   });

    it('should be able to authenticate', async () => {
        const user = await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@email.com',
            password: '123456',
        });

        const response = await authenticateUser.execute({
            email: 'johndoe@email.com',
            password: '123456',
        });

        expect(response).toHaveProperty('token');
        expect(response.user).toEqual(user);
    });

    it('should not be able to authenticate with non existing user', async () => {
        await expect(
            authenticateUser.execute({
                email: 'johndoe@email.com',
                password: '123456',
            })
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to authenticate with wrong password', async () => {
        await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@email.com',
            password: '123456',
        });

        await expect(
            authenticateUser.execute({
                email: 'johndoe@email.com',
                password: '888888',
            })
        ).rejects.toBeInstanceOf(AppError);
    });
});
