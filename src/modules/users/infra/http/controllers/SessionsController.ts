import { Request, Response } from 'express';
import { container } from 'tsyringe';

import AuthenticationUserService from '@modules/users/services/AuthenticateUserService';

export default class SessionsController {
    public async create(request: Request, response: Response): Promise<Response> {
        const { email, password } = request.body;

        const authenticateUser = container.resolve(AuthenticationUserService);

        // const response = await authenticateUser({
        // Dessa forma não ficaria claro, qual é o retorno.
        // Por isso fazemos a desestruturação e pegamos apenas USER.
        const { user, token } = await authenticateUser.execute({
            email,
            password,
        });

        // Boa práticanão não enciar a senha do usuário
        delete user.password;

        return response.json({ user, token });
    }
}
