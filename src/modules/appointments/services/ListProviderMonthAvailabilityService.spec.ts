import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import ListProviderMonthAvailabilityService from './ListProviderMonthAvailabilityService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listProviderMonthAvailability: ListProviderMonthAvailabilityService;

describe('ListProviderMonthAvailability', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    listProviderMonthAvailability = new ListProviderMonthAvailabilityService(
      fakeAppointmentsRepository,
    );
  });

  it('should be able to list the month availability from provider', async () => {
     // lembrando que em "new Date()", o mês começa no ZERO.

      await fakeAppointmentsRepository.create({
         provider_id: 'user',
         // user_id: 'user',
         date: new Date(2020, 4, 20, 8, 0, 0),
      });

      await fakeAppointmentsRepository.create({
         provider_id: 'user',
         // user_id: 'user',
         date: new Date(2020, 4, 20, 9, 0, 0),
      });

      await fakeAppointmentsRepository.create({
         provider_id: 'user',
         // user_id: 'user',
         date: new Date(2020, 4, 20, 10, 0, 0),
      });

      await fakeAppointmentsRepository.create({
         provider_id: 'user',
         // user_id: 'user',
         date: new Date(2020, 4, 20, 11, 0, 0),
      });

      await fakeAppointmentsRepository.create({
         provider_id: 'user',
         // user_id: 'user',
         date: new Date(2020, 4, 20, 12, 0, 0),
      });

      await fakeAppointmentsRepository.create({
         provider_id: 'user',
         // user_id: 'user',
         date: new Date(2020, 4, 20, 13, 0, 0),
      });

      await fakeAppointmentsRepository.create({
         provider_id: 'user',
         // user_id: 'user',
         date: new Date(2020, 4, 20, 14, 0, 0),
      });

      await fakeAppointmentsRepository.create({
         provider_id: 'user',
         // user_id: 'user',
         date: new Date(2020, 4, 20, 15, 0, 0),
      });

      await fakeAppointmentsRepository.create({
         provider_id: 'user',
         // user_id: 'user',
         date: new Date(2020, 4, 20, 16, 0, 0),
      });

      await fakeAppointmentsRepository.create({
         provider_id: 'user',
         // user_id: 'user',
         date: new Date(2020, 4, 20, 17, 0, 0),
      });

      await fakeAppointmentsRepository.create({
         provider_id: 'user',
         // user_id: 'user',
         date: new Date(2020, 4, 21, 8, 0, 0),
      });

      // aqui passamos mês 5, como se fosse o usuário informando.
      const availability = await listProviderMonthAvailability.execute({
         provider_id: 'user',
         year: 2020,
         month: 5,
      });

      expect(availability).toEqual(
         expect.arrayContaining([
            { day: 19, available: true },
            { day: 20, available: false },
            { day: 21, available: true },
            { day: 22, available: true },
         ]),
      );
   });
});