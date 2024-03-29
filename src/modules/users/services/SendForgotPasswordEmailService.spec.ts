import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokensRepository';
import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider';
import SendForgotPasswordEmailService from './SendForgotPasswordEmailService';

let fakeUsersRepository: FakeUsersRepository;
let fakeUserTokensRepository: FakeUserTokensRepository;
let fakeMailProvider: FakeMailProvider;
let sendForgotPasswordEmail: SendForgotPasswordEmailService;

describe('SendForgotPasswordEmail', () => {
   beforeEach(() => {
      fakeUsersRepository = new FakeUsersRepository();
      fakeUserTokensRepository = new FakeUserTokensRepository();
      fakeMailProvider = new FakeMailProvider();
      sendForgotPasswordEmail = new SendForgotPasswordEmailService(
         fakeUsersRepository, 
         fakeMailProvider, 
         fakeUserTokensRepository
      );
   });

    it('should be able to recover the password using the email', async () => {
        const sendMail = jest.spyOn(fakeMailProvider, 'sendMail');

        // antes de enviar o email, criamos o usuário
        await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@email.com',
            password: '123456',
        });

        await sendForgotPasswordEmail.execute({
            email: 'johndoe@email.com',
        });

        expect(sendMail).toHaveBeenCalled();
    });

    it('should not be able to recover a non-existing user password', async () => {
      await expect(
         sendForgotPasswordEmail.execute({
            email: 'johndoe@email.com',
         })
      ).rejects.toBeInstanceOf(AppError);
    });

    it('should generate a forgot password token', async () => {
        const generateToken = jest.spyOn(fakeUserTokensRepository, 'generate');

        const user = await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@email.com',
            password: '123456',
        });

        await sendForgotPasswordEmail.execute({
            email: 'johndoe@email.com',
        });

        expect(generateToken).toHaveBeenCalledWith(user.id);
  });
});