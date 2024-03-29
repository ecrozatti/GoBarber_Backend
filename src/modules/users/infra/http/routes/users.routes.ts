import { Router } from 'express';
import multer from 'multer';
import uploadConfig from '@config/upload';
import { celebrate, Segments, Joi } from 'celebrate';

import UsersController from '../controllers/UsersController';
import UserAvatarController from '../controllers/UserAvatarController';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';

const usersRouter = Router();
const upload = multer(uploadConfig.multer);
const usersController = new UsersController();
const userAvatarController = new UserAvatarController();

usersRouter.post('/', celebrate({
   [Segments.BODY]: {
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().required()
   }
}), usersController.create);

// PATCH - utilizado para atualizar uma informação.
// Passando o middleware, pq é uma rota privada.
usersRouter.patch(
   '/avatar',
   ensureAuthenticated,
   upload.single('avatar'),
   userAvatarController.update,
);

export default usersRouter;
