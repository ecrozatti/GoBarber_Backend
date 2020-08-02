import { startOfHour } from 'date-fns';
// import { getCustomRepository } from 'typeorm';
import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import Appointment from '../infra/typeorm/entities/Appointment';
// import AppointmentsRepository from '../infra/typeorm/repositories/AppointmentsRepository';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

// requestDTO
interface IRequest {
   provider_id: string;
   date: Date;
}

// determina que a classe eh injetavel... que recebe injecao de dependencia
@injectable()
class CreateAppointmentService {
   constructor(
      @inject('AppointmentsRepository')
      private appointmentsRepository: IAppointmentsRepository
   ) {}

   // Abaixo seria um hack typescript para o codigo acima,.
   // constructor(private appointmentsRepository: IAppointmentsRepository) {}

   public async execute({ provider_id, date }: IRequest): Promise<Appointment> {
      // const appointmentsRepository = getCustomRepository(
      //    AppointmentsRepository,
      // );

      const appointmentDate = startOfHour(date);

      const findAppointmentInSameDate = await this.appointmentsRepository.findByDate(
         appointmentDate,
      );

      if (findAppointmentInSameDate) {
         throw new AppError('This appointment is already booked');
      }

      // Cria a instância do agendamento, mas não salva no BD.
      const appointment = this.appointmentsRepository.create({
         provider_id,
         date: appointmentDate,
      });

      // Para salvar no BD
      // await appointmentsRepository.save(appointment);
      // Unificamos CREATE e SAVE, no AppointmentsRepository

      return appointment;
   }
}

export default CreateAppointmentService;
