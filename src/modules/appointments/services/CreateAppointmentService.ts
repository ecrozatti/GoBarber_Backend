import { startOfHour, isBefore, getHours, format } from 'date-fns';
// import { getCustomRepository } from 'typeorm';
import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import Appointment from '../infra/typeorm/entities/Appointment';
// import AppointmentsRepository from '../infra/typeorm/repositories/AppointmentsRepository';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';
import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';

// requestDTO
interface IRequest {
   provider_id: string;
   user_id: string;
   date: Date;
}

// determina que a classe eh injetavel... que recebe injecao de dependencia
@injectable()
class CreateAppointmentService {
   constructor(
      @inject('AppointmentsRepository')
      private appointmentsRepository: IAppointmentsRepository,

      @inject('NotificationsRepository')
      private notificationsRepository: INotificationsRepository,

      @inject('CacheProvider')
      private cacheProvider: ICacheProvider,
   ) {}

   // Abaixo seria um hack typescript para o codigo acima,.
   // constructor(private appointmentsRepository: IAppointmentsRepository) {}

   public async execute({ provider_id, user_id, date }: IRequest): Promise<Appointment> {
      // const appointmentsRepository = getCustomRepository(
      //    AppointmentsRepository,
      // );

      const appointmentDate = startOfHour(date);

      // Date.now -> nas rotas seria o horario atual
      // Date.now -> nos testes seria a data mockada
      if (isBefore(appointmentDate, Date.now())) {
         throw new AppError("You can't create an appointment on a past date.");
      }

      if (user_id == provider_id) {
         throw new AppError("You can't create an appointment with yourself");
      }

      if (getHours(appointmentDate) < 8 || getHours(appointmentDate) > 17) {
         throw new AppError('You can only create an appointment between 8am and 5pm');
      }

      const findAppointmentInSameDate = await this.appointmentsRepository.findByDate(
         appointmentDate,
         provider_id,
      );

      if (findAppointmentInSameDate) {
         throw new AppError('This appointment is already booked');
      }

      // Cria a instância do agendamento, mas não salva no BD.
      const appointment = await this.appointmentsRepository.create({
         provider_id,
         user_id,
         date: appointmentDate,
      });

      // usar aspas duplas por fora e simples por dentro para diferenciar o que é texto
      const dateFormatted = format(appointmentDate, "dd/MM/yyyy 'às' HH:mm'h'");

      await this.notificationsRepository.create({
         recipient_id: provider_id,
         content: `Novo agendamento para o dia ${dateFormatted}`
      });

      // Para salvar no BD
      // await appointmentsRepository.save(appointment);
      // Unificamos CREATE e SAVE, no AppointmentsRepository

      // yyyy-M-d --> nao inclui zero a esquerda no mes e no dia
      await this.cacheProvider.invalidate(`provider-appointments:${provider_id}:${format(appointmentDate, 'yyyy-M-d')}`);

      return appointment;
   }
}

export default CreateAppointmentService;
