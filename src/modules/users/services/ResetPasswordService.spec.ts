import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokensRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import ResetPasswordService from './ResetPasswordService';

let fakeUsersRepository: FakeUsersRepository;
let fakeUserTokensRepository: FakeUserTokensRepository; 
let fakeHashProvider: FakeHashProvider;
let resetPassword: ResetPasswordService;

describe('ResetPassword', () => {
   beforeEach(() => {
      fakeUsersRepository = new FakeUsersRepository();
      fakeUserTokensRepository = new FakeUserTokensRepository();
      fakeHashProvider = new FakeHashProvider();
      resetPassword = new ResetPasswordService(
         fakeUsersRepository, 
         fakeUserTokensRepository,
         fakeHashProvider
      );
   });

   it('should be able to reset the password', async () => {
      const user = await fakeUsersRepository.create({
         name: 'John Doe',
         email: 'johndoe@email.com',
         password: '123456',
      });

      const userToken = await fakeUserTokensRepository.generate(user.id);

      const generateHash = jest.spyOn(fakeHashProvider, 'generateHash');

      await resetPassword.execute({
         password: '999777',
         token: userToken.token
      });

      const updatedUser = await fakeUsersRepository.findById(user.id);

      expect(generateHash).toHaveBeenCalledWith('999777');  //nova senha
      expect(updatedUser?.password).toBe('999777');
   });

   it('should be able to reset the password with non-existing token', async () => {
      await expect(
         resetPassword.execute({
            token: 'non-existing-token',
            password: '123456',
         })
      ).rejects.toBeInstanceOf(AppError);
   });

   it('should be able to reset the password with non-existing user', async () => {
      const { token } = await fakeUserTokensRepository.generate(
         'non-existing-user'
      );

      await expect(
         resetPassword.execute({
            token,
            password: '123456',
         })
      ).rejects.toBeInstanceOf(AppError);
   });

   it('should not be able to reset the password after 2 hours', async () => {
      const user = await fakeUsersRepository.create({
         name: 'John Doe',
         email: 'johndoe@email.com',
         password: '123456',
      });

      const { token } = await fakeUserTokensRepository.generate(user.id);

      // mockImplementation e mockImplementationOnce
      // modificam a funcionalidade da função, seja global ou não, qdo a mesma for chamada
      // usando a opção ONCE, isso é feito apenas na primeira chamada
      // Aqui, usamos a função DATE, porém setamos ela 3 horas a frente
      jest.spyOn(Date,'now').mockImplementationOnce(() => {
         const customDate = new Date();
         return customDate.setHours(customDate.getHours() + 3);
      });

      await expect(
         resetPassword.execute({
            password: '123456',
            token
      })).rejects.toBeInstanceOf(AppError);
   });
});