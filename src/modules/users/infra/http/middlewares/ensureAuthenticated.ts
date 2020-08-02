import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

import authConfig from '@config/auth';
import AppError from '@shared/errors/AppError';

// estrutura do retorno da variável DECOTED (ver abaixo)
interface TokenPayload {
   iat: number;
   exp: number;
   sub: string;
}

export default function ensureAuthenticated(
   request: Request,
   response: Response,
   next: NextFunction,
): void {
   // validação do token JWT

   const authHeader = request.headers.authorization;

   if (!authHeader) {
      throw new AppError('JWT token is missing.', 401);
   }

   // split -> criar uma posição no array a cada espaço
   // como o token é (Bearer 3478f7834f), ele retorna 2 posições.
   // A primeira se chama TYPE e a segunda TOKEN.
   // Como vamos utilizar somente o TOKEN, usamos [, token].
   // Se fosse usar as duas informações usariamos [type, token]
   const [, token] = authHeader.split(' ');

   try {
      const decoted = verify(token, authConfig.jwt.secret);

      // console.log(decoted);
      // {
      //    iat: 1593271681,
      //    exp: 1593358081,
      //    sub: '2804c4df-8ce3-4fda-aaf8-96431b0c765d'
      // }

      // DEOCTED pode ser uma string ou um object.
      // Para forçar um tipo, utilizar AS. (hack do TypeScript)
      const { sub } = decoted as TokenPayload;

      request.user = {
         id: sub,
      };

      return next();
   } catch {
      throw new AppError('Invalid JWT token.', 401);
   }
}
