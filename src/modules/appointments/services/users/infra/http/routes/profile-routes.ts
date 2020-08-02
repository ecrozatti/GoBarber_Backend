import { Router } from 'express';

import ProfileController from '../controllers/ProfileController';

import ensureAuthenticated from '@modules/appointments/services/users/infra/http/middlewares/ensureAuthenticated';

const profileRouter = Router();
const profileController = new ProfileController();

// rotas acessiceis somente se o usuario estiver logado
// E se estiver logado, busca os dados do usuario
profileRouter.use(ensureAuthenticated);

profileRouter.get('/', profileController.show);
profileRouter.put('/', profileController.update);

export default profileRouter;
