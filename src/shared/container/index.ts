import { container } from 'tsyringe';

import '@modules/appointments/services/users/providers';
import './providers';

import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import AppointmentsRepository from '@modules/appointments/infra/typeorm/repositories/AppointmentsRepository';

import IUsersRepository from '@modules/appointments/services/users/repositories/IUsersReopsitory';
import UsersRepository from '@modules/appointments/services/users/infra/typeorm/repositories/UsersRepository';

import IUserTokensRepository from '@modules/appointments/services/users/repositories/IUserTokensRepository';
import UserTokensRepository from '@modules/appointments/services/users/infra/typeorm/repositories/UserTokensRepository';

// container.register --> toda vez que usado, cria uma instancia da classe.
// container/registerSingleton --> cria uma unica instacia da classe, durante a vida da aplicacao.

container.registerSingleton<IAppointmentsRepository>(
    'AppointmentsRepository',
    AppointmentsRepository,
);

container.registerSingleton<IUsersRepository>(
    'UsersRepository',
    UsersRepository,
);

container.registerSingleton<IUserTokensRepository>(
   'UserTokensRepository',
   UserTokensRepository,
);