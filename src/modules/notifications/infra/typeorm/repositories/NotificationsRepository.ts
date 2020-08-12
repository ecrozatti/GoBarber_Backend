// ao inves de usarmos getRepository e Repository, usamos como abaixo.
import { getMongoRepository, MongoRepository } from 'typeorm';

import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';
import ICreateNotificationDTO from '@modules/notifications/dtos/ICreateNotificationDTO';

import Notification from '../schemas/Notification';

class NotificationsRepository implements INotificationsRepository {
   private ormRepository: MongoRepository<Notification>;

   constructor() {
      // getMongoRepository - e um metodo para BD nao relacional
      // 2. parametro e o nome da conexao, se em branco, usa a conexao default (postgres)
      this.ormRepository = getMongoRepository(Notification, 'mongo');
   }

   public async create({ content, recipient_id }: ICreateNotificationDTO): Promise<Notification> {
      const notification = this.ormRepository.create({
         content,
         recipient_id,
      });

      await this.ormRepository.save(notification);

      return notification;
   }
}

export default NotificationsRepository;
