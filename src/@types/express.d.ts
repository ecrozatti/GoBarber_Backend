// Aqui adicionamos o tipo USER.ID a biblioteca do EXPRESS REQUEST.
// Assim em nos requests feitos na aplicação, sempre teremos essa informação.
// Valor setado no middleware ensureAuthenticated.

declare namespace Express {
   export interface Request {
      user: {
         id: string;
      };
   }
}
