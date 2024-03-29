import express, { Request, Response, NextFunction } from 'express';
import 'express-async-errors';
import cors from 'cors';
import 'reflect-metadata';
import { errors } from 'celebrate';
import 'dotenv/config';

import routes from './routes';
import uploadConfig from '@config/upload';
import rateLimiter from '@shared/infra/middlewares/rateLimiter'
import AppError from '@shared/errors/AppError';

import '@shared/infra/typeorm';
import '@shared/container'

const app = express();

app.use(cors());
app.use(express.json());
app.use('/files', express.static(uploadConfig.uploadsFolder));
// rateLimiter -> colocamos aqui, pq nao deve aplicar nas rotas FILES (imagens), apenas para as rotas
app.use(rateLimiter);
app.use(routes);

// erros de validacao via Celebrate
app.use(errors());

app.use((err: Error, request: Request, response: Response, _: NextFunction) => {
   // se for um erro conhecido/originado pela aplicação,
   // retornar um erro amigável para o frontend
   if (err instanceof AppError) {
      return response.status(err.statusCode).json({
         status: 'error',
         message: err.message,
      });
   }

   console.error(err);

   // se não for um erro conhecido, retornar um erro genérico.
   return response.status(500).json({
      status: 'error',
      message: 'Inernal server error.',
   });
});

app.listen(3333, () => {
   console.log('🚀 Server started on port 3333!');
});
