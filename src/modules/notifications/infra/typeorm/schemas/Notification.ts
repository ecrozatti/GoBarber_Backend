import {
  ObjectID,
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ObjectIdColumn,
} from 'typeorm';

@Entity('notifications')
class Notification {
   // aqui nao usamos UUID do postgres e sim ObjectID do Mongo
   @ObjectIdColumn()
   id: ObjectID;

   @Column()
   content: string;

   @Column('uuid')
   recipient_id: string;

   // como nao temos as migrations no Mongo,
   // definimos os valores padrao aqui.
   @Column({ default: false })
   read: boolean;

   @CreateDateColumn()
   created_at: Date;

   @UpdateDateColumn()
   updated_at: Date;
}

export default Notification;
