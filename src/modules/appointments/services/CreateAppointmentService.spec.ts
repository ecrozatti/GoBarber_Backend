import AppError from '@shared/errors/AppError';

import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import CreateAppointmentService from './CreateAppointmentService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let createAppointmentService: CreateAppointmentService;

describe('CreateAppointment', () => {
   beforeEach(() => {
      fakeAppointmentsRepository = new FakeAppointmentsRepository
      // Nos testes não usamos a injeção de dependência, por isso passo fakeRepository como parâmetro
      createAppointmentService = new CreateAppointmentService(fakeAppointmentsRepository);
   });

    it('should be able to create a new appointment', async () => {
        // como é um repositório fake, passamos qualquer valor
        const appointment = await createAppointmentService.execute({
            date: new Date(),
            provider_id: '123456'
        });

        expect(appointment).toHaveProperty('id');
        expect(appointment.provider_id).toBe('123456');
    });

    it('should not be able to create two appointments on the same time.', async () => {
        const appointmentDate = new Date();

        await createAppointmentService.execute({
            date: appointmentDate,
            provider_id: '123456'
        });

        // espera que tente incluir o agendamento na mesma data (sem o AWAIT)
        // que seja rejeitado e retorne um erro do tipo AppError
        await expect(createAppointmentService.execute({
            date: appointmentDate,
            provider_id: '123456'
        })).rejects.toBeInstanceOf(AppError);
    });
});