import { injectable, inject } from 'tsyringe';
import path from 'path';
import fs from 'fs'; // File System

import uploadConfig from '@config/upload';
import User from '@modules/users/infra/typeorm/entities/User';
import AppError from '@shared/errors/AppError';
import IUsersRepository from '../repositories/IUsersReopsitory';
import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';

interface IRequest {
   user_id: string;
   avatarFilename: string;
}

@injectable()
class UpdateUserAvatarService {
   constructor(
      @inject('UsersRepository')   
      private usersRepository: IUsersRepository,

      @inject('StorageProvider')   
      private storageProvider: IStorageProvider,
   ) {}

   public async execute({ user_id, avatarFilename }: IRequest): Promise<User> {
      const user = await this.usersRepository.findById(user_id);

      if (!user) {
         throw new AppError('Only authenticated users can change avatar.', 401);
      }

      if (user.avatar) {
         /*
         // deletar avatar anterior
         const userAvatarFilePath = path.join(
            uploadConfig.directory,
            user.avatar,
         );

         // Usamos função STAT do FILESYSTEM em formato de Promise.
         // Essa função traz o sttus de um arquivo, se ele existir.
         const userAvatarFileExists = await fs.promises.stat(
            userAvatarFilePath,
         );

         if (userAvatarFileExists) {
            // Deleta o arquivo
            await fs.promises.unlink(userAvatarFilePath);
         }*/

         await this.storageProvider.deleteFile(user.avatar);
      }

      const filename = await this.storageProvider.saveFile(avatarFilename);

      // user.avatar = avatarFilename;
      user.avatar = filename;

      // se tiver ID, atualiza o usuário existe.
      // se não tiver, cria um novo usuário.
      await this.usersRepository.save(user);

      return user;
   }
}

export default UpdateUserAvatarService;
