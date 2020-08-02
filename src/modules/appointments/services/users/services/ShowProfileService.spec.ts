import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import ShowProfileService from './ShowProfileService';

let fakeUsersRepository: FakeUsersRepository;
let showProfile: ShowProfileService;

describe('ShowProfile', () => {
   beforeEach(() => {
      fakeUsersRepository = new FakeUsersRepository();
      showProfile = new ShowProfileService(fakeUsersRepository);
   });

   it('should be able to show the profile', async () => {
      const user = await fakeUsersRepository.create({
        name: 'Eric',
        email: 'eric@gmail.com',
        password: '112113',
      });
  
      const profile = await showProfile.execute({
        user_id: user.id,
      });
  
      expect(profile.name).toBe('Eric');
      expect(profile.email).toBe('eric@gmail.com');
    });

   it('should not  be able to show the profile from non-existing user.', async () => {
      await expect(
         showProfile.execute({
            user_id: 'non-existing-user-id',
         })
      ).rejects.toBeInstanceOf(AppError);
   });
});