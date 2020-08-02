import AppError from '@shared/errors/AppError';

import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import UpdateUserAvatar from './UpdateUserAvatarService';

let fakeUsersRepository: FakeUsersRepository;
let fakeStorageProvider: FakeStorageProvider;
let updateUserAvatar: UpdateUserAvatar;

describe('UpdateUserAvatar', () => {
   beforeEach(() => {
      fakeUsersRepository = new FakeUsersRepository();
      fakeStorageProvider = new FakeStorageProvider();
      updateUserAvatar = new UpdateUserAvatar(fakeUsersRepository, fakeStorageProvider);
   });

    it('should be able to create a new user', async () => {
        const user = await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@email.com',
            password: '123456',
        });

        await updateUserAvatar.execute({
            user_id: user.id,
            // O arquivo não precisa existir de vdd
            avatarFilename: 'avatar.jpg',
        });

        expect(user.avatar).toBe('avatar.jpg');
    });

    it('should not be able to update avatar from non existing user', async () => {
        await expect(
            updateUserAvatar.execute({
                user_id: 'non-existing-user',
                avatarFilename: 'avatar.jpg',
            })
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should be able to delete old avatar when updating new one', async () => {
        // definimos que o jest deve "espiar" a função deleteFile.
        // na variável é retornado a função deleteFile
        const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

        const user = await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@email.com',
            password: '123456',
        });

        await updateUserAvatar.execute({
            user_id: user.id,
            // upload do primeiro arquivo
            avatarFilename: 'avatar1.jpg',
        });

        await updateUserAvatar.execute({
            user_id: user.id,
            // upload do segundo arquivo
            avatarFilename: 'avatar2.jpg',
        });

        // espero que a função deleFile, tenha sido chamada com avatar1.jpg (arquivo antigo)
        expect(deleteFile).toHaveBeenCalledWith('avatar1.jpg');
        expect(user.avatar).toBe('avatar2.jpg');
    });
});