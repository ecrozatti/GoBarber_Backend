import { getRepository, Repository, Raw } from 'typeorm';
// Raw --> comando diretamente para o BD.

import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';
import IFindAllInMonthFromProviderDTO from '@modules/appointments/dtos/IFindAllInMonthFromProviderDTO';
import IFindAllInDayFromProviderDTO from '@modules/appointments/dtos/IFindAllInDayFromProviderDTO';

import Appointment from '../entities/Appointment';

// Extende para classe REPOSITORY, passando o MODEL (parâmetro de tipagem)
// @EntityRepository(Appointment)
// class AppointmentsRepository extends Repository<Appointment> implements IAppointmentsRepository {
class AppointmentsRepository implements IAppointmentsRepository {
   // Definimos o tipo da variavel ORM, no caso um repositorio de appointments
   private ormRepository: Repository<Appointment>;

   constructor() {
      // Criamos de fato o repositorio de appointments e passa a ter todos os metodos.
      this.ormRepository = getRepository(Appointment);
   }

   public async findByDate(date: Date): Promise<Appointment | undefined> {
      const findAppointment = await this.ormRepository.findOne({
         where: { date },
      });

      return findAppointment;
   }

   public async findAllInMonthFromProvider({ provider_id, month, year }: IFindAllInMonthFromProviderDTO): Promise<Appointment[]> {
      // preenche com zeros a esquerda
      const parsedMonth = String(month).padStart(2, '0');
  
      const appointments = await this.ormRepository.find({
        where: {
          provider_id,
          date: Raw(
            dateFieldName =>
              `to_char(${dateFieldName}, 'MM-YYYY') = '${parsedMonth}-${year}'`,
          ),
        },
      });
  
      return appointments;
    }

   public async findAllInDayFromProvider({ provider_id, day, month, year }: IFindAllInDayFromProviderDTO): Promise<Appointment[]> {
      const parsedDay = String(day).padStart(2, '0');
      const parsedMonth = String(month).padStart(2, '0');

      const appointments = await this.ormRepository.find({
         where: {
            provider_id,
            date: Raw(
               dateFieldName =>
                  `to_char(${dateFieldName}, 'DD-MM-YYYY') = '${parsedDay}-${parsedMonth}-${year}'`,
            ),
         },
         relations: ['user'],
      });

      return appointments;
   }

   // Criamos e salvamos o agendamento no BD, em um unico metodo.
   // diferente da forma que faziamos no SERVICE onde tinhamos um metodo CREATE e outro SAVE.
   public async create({ provider_id, date }: ICreateAppointmentDTO): Promise<Appointment> {
      const appointment = this.ormRepository.create({ provider_id, date });

      await this.ormRepository.save(appointment);

      return appointment;
   }
}

export default AppointmentsRepository;
