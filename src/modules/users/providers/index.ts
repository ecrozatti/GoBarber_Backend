import { container } from 'tsyringe';

import IHashProvider from './HashProvider/models/IHashProvider';
import BCryptHashProvider from './HashProvider/implementations/BCryptHashProvider';

// toda vez que tiver uma dependencia chamada HashProvider, 
// retorna uma instancia da classe BCryptHashProvider
container.registerSingleton<IHashProvider>('HashProvider', BCryptHashProvider);