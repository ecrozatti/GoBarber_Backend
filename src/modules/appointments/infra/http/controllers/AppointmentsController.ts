import { Request, Response } from 'express';
// import { parseISO } from 'date-fns';
import { container } from 'tsyringe';

import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService';

export default class AppointmentsController {
   public async create(request: Request, response: Response): Promise<Response> {
      // pegamos esse request no middleware de autenticacao
      const user_id = request.user.id;
      const { provider_id, date } = request.body;


      // const parsedDate = parseISO(date);

      // Com a injecao de dependencia, nao eh mais necessario criar appointmentsRepositoru e envia por parametro.
      //const appointmentsRepository = new AppointmentsRepository();
      //const createAppointment = new CreateAppointmentService(appointmentsRepository);

      // Usano a injecao de dependencia, isso subtitui o codigo acima.
      // retorna uma instancia da classe AppointmentsRepository
      const createAppointment = container.resolve(CreateAppointmentService);

      const appointment = await createAppointment.execute({
         provider_id,
         user_id,
         // date: parsedDate,
         date,
      });

      return response.json(appointment);
   }
}
