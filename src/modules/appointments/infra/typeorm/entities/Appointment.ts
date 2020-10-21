import {
   Entity,
   Column,
   PrimaryGeneratedColumn,
   CreateDateColumn,
   UpdateDateColumn,
   ManyToOne,
   JoinColumn,
} from 'typeorm';

import User from '@modules/users/infra/typeorm/entities/User';

@Entity('appointments')
class Appointment {
   @PrimaryGeneratedColumn('uuid')
   id: string;

   @Column()
   provider_id: string;

   // criamos uma propriedade do tipo USER
   // muitos agendamentos para um usuário.
   // dessa maneira conseguimos acessaros dados do user, a partir de um agendameto
   @ManyToOne(() => User)
   @JoinColumn({ name: 'provider_id' })
   provider: User;
   // no model User poderíamos colocar o inverso (OneToMany), mas por hora não

   @Column()
   user_id: string;

   // {eager: true} --> Tras todos os dados do usuario, nao apenas o id.
   // Atencao, usar isso somente qdo fazer muito sentido, pq sempre carregara tudo
   // Por exemplo: peiddo de um e-commerce e os seus respectivos produtos (ao carregar um pedido, sempre trazer os produtos)
   // @ManyToOne(() => User, { eager: true })
   @ManyToOne(() => User)
   @JoinColumn({ name: 'user_id' })
   user: User;

   @Column('timestamp with time zone')
   date: Date;

   @CreateDateColumn()
   created_at: Date;

   @UpdateDateColumn()
   updated_at: Date;
}

export default Appointment;
