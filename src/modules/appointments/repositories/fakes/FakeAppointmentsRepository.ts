import { uuid } from 'uuidv4';
import { isEqual, getYear, getMonth, getDate } from 'date-fns';    // para comparacao de datas

import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';
import IFindAllInMonthFromProviderDTO from '@modules/appointments/dtos/IFindAllInMonthFromProviderDTO';
import IFindAllInDayFromProviderDTO from '@modules/appointments/dtos/IFindAllInDayFromProviderDTO';

import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';

class AppointmentsRepository implements IAppointmentsRepository {
   private appointments: Appointment[] = [];

   public async findByDate(date: Date): Promise<Appointment | undefined> {
      const findAppointment = this.appointments.find(
         // appointment => appointment.date == date
         appointment => isEqual(appointment.date, date)
      );

      return findAppointment;
   }

   public async findAllInMonthFromProvider({ provider_id, month, year }: IFindAllInMonthFromProviderDTO): Promise<Appointment[]> {
      const appointments = this.appointments.filter(appointment => {
         return (
           appointment.provider_id === provider_id &&
           getMonth(appointment.date) + 1 === month &&
           getYear(appointment.date) === year
         );
       });
   
       return appointments;
   }

   public async findAllInDayFromProvider({ provider_id, day, month, year }: IFindAllInDayFromProviderDTO): Promise<Appointment[]> {
      const appointments = this.appointments.filter(appointment => {
         return (
            appointment.provider_id === provider_id &&
            getDate(appointment.date) === day &&
            getMonth(appointment.date) + 1 === month &&
            getYear(appointment.date) === year
         );
      });

      return appointments;
   }
	  
   public async create({ provider_id, date }: ICreateAppointmentDTO): Promise<Appointment> {
      const appointment = new Appointment(); 

      // appointment.id = uuid();
      // appointment.date = date;
      // appointment.provider_id = provider_id;

      // Está linha tem a mesma função das linhas acima, assinando o objeto.
      Object.assign(appointment, { id: uuid(), date, provider_id });

      // armazenamos o agendamento em memória (vetor)
      this.appointments.push(appointment);

      return appointment;
   }
}

export default AppointmentsRepository;
