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

   @Column('timestamp with time zone')
   date: Date;

   @CreateDateColumn()
   created_at: Date;

   @UpdateDateColumn()
   updated_at: Date;
}

export default Appointment;
