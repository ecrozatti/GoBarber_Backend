import { container } from 'tsyringe';

import IStorageProvider from './StorageProvider/models/IStorageProvider';
import DiskStorageProvider from './StorageProvider/implementations/DiskStorageProvider';

import IMailProvider from './MailProvider/models/IMailProvider';
import EtherealMailProvider from './MailProvider/implementations/EtherealMailProvider';

import IMailTemplateProvider from './MailTemplateProvider/models/IMailTemplateProvider';
import HandlebarsMailTemplateProvider from './MailTemplateProvider/implementations/HandlebarsMailTemplateProvider';

// Hoje isso está estático.
// Em breve trataremos se é ambiente de produção, ambiente de teste, etc
container.registerSingleton<IStorageProvider>(
   'StorageProvider', 
   DiskStorageProvider
);

// Para o node isso continua sendo SINGLETON
// Pq ele trata os objetos dessa forma, executa apenas uma vez
// container.registerInstance<IMailProvider>(
//    'MailProvider', 
//    new EtherealMailProvider()
// );

container.registerSingleton<IMailTemplateProvider>(
   'MailTemplateProvider', 
   HandlebarsMailTemplateProvider
);

// mudamos aqui para baixo, depois de MailTemplateProvider
container.registerInstance<IMailProvider>(
   'MailProvider', 
   // como usamos injecao de dependencia, usamos dessa forma.
   container.resolve(EtherealMailProvider),
);