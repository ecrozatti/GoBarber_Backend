import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import AuthenticateUserService from './AuthenticateUserService';
import CreateUserService from './CreateUserService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let createUser: CreateUserService;
let authenticateUser: AuthenticateUserService;

describe('AuthenticateUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    createUser = new CreateUserService(fakeUsersRepository, fakeHashProvider);

    authenticateUser = new AuthenticateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });

  it('should be able to authenticate', async () => {
    await createUser.execute({
      name: 'McLovin',
      email: 'mvlovin@gmail.com',
      password: '112113',
    });

    const response = await authenticateUser.execute({
      email: 'mvlovin@gmail.com',
      password: '112113',
    });

    expect(response).toHaveProperty('token');
  });

  it('should not be able authenticate with non existing user', async () => {
    await expect(
      authenticateUser.execute({
        email: 'mvlovin@gmail.com',
        password: '112113',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able authenticate with wrong password', async () => {
    await createUser.execute({
      name: 'McLovin',
      email: 'mvlovin@gmail.com',
      password: '112113',
    });

    await expect(
      authenticateUser.execute({
        email: 'mvlovin@gmail.com',
        password: 'wrong-password',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
