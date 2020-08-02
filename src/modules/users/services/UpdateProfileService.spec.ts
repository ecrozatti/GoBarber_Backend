import AppError from '@shared/errors/AppError';

import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import UpdateProfileService from './UpdateProfileService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let updateProfile: UpdateProfileService;

describe('UpdateProfile', () => {
   beforeEach(() => {
      fakeUsersRepository = new FakeUsersRepository();
      fakeHashProvider = new FakeHashProvider();
      updateProfile = new UpdateProfileService(fakeUsersRepository, fakeHashProvider);
   });

    it('should be able to update the profile.', async () => {
        const user = await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@email.com',
            password: '123456',
        });

        const updatedUser = await updateProfile.execute({
            user_id: user.id,
            name: 'Eric',
            email: 'eric@gmail.com',
        });

        expect(updatedUser.name).toBe('Eric');
        expect(updatedUser.email).toBe('eric@gmail.com');
    });

    it('should not be able to update the profile from non-existing user.', async () => {
      await expect(
         updateProfile.execute({
            user_id: 'non-existing-user-id',
            name: 'Test',
            email: 'test@email.com',
         })
      ).rejects.toBeInstanceOf(AppError);
   });

    it('should not be able to change to another user email.', async () => {
      await fakeUsersRepository.create({
         name: 'John Doe',
         email: 'johndoe@email.com',
         password: '123456',
     });

     const user = await fakeUsersRepository.create({
      name: 'Eric',
      email: 'eric@gmail.com',
      password: '123',
  });

      await expect(
         updateProfile.execute({
            user_id: user.id,
            name: 'Eric Crozatti',
            email: 'johndoe@email.com',   // mesmo email
         })
      ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to update the password.', async () => {
      const user = await fakeUsersRepository.create({
         name: 'John Doe',
         email: 'johndoe@email.com',
         password: '123456',
      });

      const updatedUser = await updateProfile.execute({
         user_id: user.id,
         name: 'Eric',
         email: 'eric@gmail.com',
         old_password: '123456',
         password: '123123',
      });

      expect(updatedUser.password).toBe('123123');
   });

   it('should not be able to update the password without old password.', async () => {
      const user = await fakeUsersRepository.create({
         name: 'John Doe',
         email: 'johndoe@email.com',
         password: '123456',
      });

      await expect(updateProfile.execute({
         user_id: user.id,
         name: 'Eric',
         email: 'eric@gmail.com',
         password: '123123',
      })).rejects.toBeInstanceOf(AppError);
   });

   it('should not be able to update the password with wrong old password.', async () => {
      const user = await fakeUsersRepository.create({
         name: 'John Doe',
         email: 'johndoe@email.com',
         password: '123456',
      });

      await expect(updateProfile.execute({
         user_id: user.id,
         name: 'Eric',
         email: 'eric@gmail.com',
         old_password: '999999',
         password: '123123',
      })).rejects.toBeInstanceOf(AppError);
   });
});