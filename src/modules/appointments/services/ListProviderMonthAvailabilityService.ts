import { injectable, inject } from 'tsyringe';
import { getDaysInMonth, getDate, isAfter } from 'date-fns';

import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

interface IRequest {
   provider_id: string;
   month: number;
   year: number;
}

// IResponse será um array --> [{day: 1, available: true}, {day: 2, available: false}, ...]
// Nosso retorno da função EXECUTE, será um array pronto, não passamos [], dentro da PROMISE
// Para fazer isso, usar como abaixo. Funciona extamente como uma interface.
type IResponse = Array<{
   day: number;
   available: boolean;
}>

@injectable()
class ListProviderMonthAvailabilityService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,
  ) {}

   public async execute({ provider_id, month, year }: IRequest): Promise<IResponse> {
      const appointments = await this.appointmentsRepository.findAllInMonthFromProvider(
         {
            provider_id,
            year,
            month,
         },
      );

      const numberOfDaysInMonth = getDaysInMonth(new Date(year, month - 1));

      // monta um array com a qtde de n. dias do mês
      // Em cada posição o dia (sequencial). Lembrando que index inicia com 0, por isso index+1.
      const eachDayArray = Array.from(
         { length: numberOfDaysInMonth },
         // (value, index) => index + 1,
         (_, index) => index + 1,
      );

      const availability = eachDayArray.map(day => {
         const compareDate = new Date(year, month - 1, day, 23, 59, 59);

         const appointmentsInDay = appointments.filter(appointment => {
            return getDate(appointment.date) === day;
         });

         return {
            day,
            available:
               isAfter(new Date(), compareDate) && appointmentsInDay.length < 10,
         };
      });

      return availability;
  }
}

export default ListProviderMonthAvailabilityService;
