import AppError from '@shared/errors/AppError';

import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import FakeNotificationsRepository from '@modules/notifications/repositories/fakes/FakeNotificationsRepository';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import CreateAppointmentService from './CreateAppointmentService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let fakeNotificationsRepository: FakeNotificationsRepository;
let fakeCacheProvider: FakeCacheProvider;
let createAppointment: CreateAppointmentService;

describe('CreateAppointment', () => {
   beforeEach(() => {
      fakeAppointmentsRepository = new FakeAppointmentsRepository
      fakeNotificationsRepository = new FakeNotificationsRepository
      fakeCacheProvider = new FakeCacheProvider
      // Nos testes não usamos a injeção de dependência, por isso passo fakeRepository como parâmetro
      createAppointment = new CreateAppointmentService(
         fakeAppointmentsRepository,
         fakeNotificationsRepository,
         fakeCacheProvider,
      );
   });

   it('should be able to create a new appointment', async () => {
      jest.spyOn(Date, 'now').mockImplementationOnce(() => {
         return new Date(2020, 4, 10, 12).getTime();
      });

      // como é um repositório fake, passamos qualquer valor
      const appointment = await createAppointment.execute({
         date: new Date(2020, 4, 10, 13),
         user_id: '777777',
         provider_id: '123456'
      });

      expect(appointment).toHaveProperty('id');
      expect(appointment.provider_id).toBe('123456');
   });

   it('should not be able to create two appointments on the same time.', async () => {
      jest.spyOn(Date, 'now').mockImplementation(() => {
         return new Date(2020, 4, 10, 12).getTime();
      });

      const appointmentDate = new Date(2020, 4, 10, 13);

      await createAppointment.execute({
         date: appointmentDate,
         user_id: '777777',
         provider_id: '123456'
      });

      // espera que tente incluir o agendamento na mesma data (sem o AWAIT)
      // que seja rejeitado e retorne um erro do tipo AppError
      await expect(createAppointment.execute({
         date: appointmentDate,
         user_id: '777777',
         provider_id: '123456'
      })).rejects.toBeInstanceOf(AppError);
   });

   it('should not be able to create an appointment on a past date', async () => {
      jest.spyOn(Date, 'now').mockImplementationOnce(() => {
         return new Date(2020, 4, 10, 12).getTime();
      });

      await expect(createAppointment.execute({
         date: new Date(2020, 4, 10, 11),
         provider_id: 'provider-id',
         user_id: 'user-id',
      })).rejects.toBeInstanceOf(AppError);
   });

   it('should not be able to create an appointment with same user as provider', async () => {
      jest.spyOn(Date, 'now').mockImplementationOnce(() => {
         return new Date(2020, 4, 10, 12).getTime();
      });

      await expect(createAppointment.execute({
         date: new Date(2020, 4, 10, 13),
         provider_id: 'user-id',
         user_id: 'user-id',
      })).rejects.toBeInstanceOf(AppError);
   });

   it('should not be able to create an appointment before 8am and after 5pm', async () => {
      jest.spyOn(Date, 'now').mockImplementationOnce(() => {
         return new Date(2020, 4, 10, 12).getTime();
      });

      await expect(createAppointment.execute({
         date: new Date(2020, 4, 11, 7),
         provider_id: 'user-id',
         user_id: 'provider-id',
      })).rejects.toBeInstanceOf(AppError);

      await expect(createAppointment.execute({
         date: new Date(2020, 4, 11, 18),
         provider_id: 'provider-id',
         user_id: 'user-id',
      })).rejects.toBeInstanceOf(AppError);
   });
});
