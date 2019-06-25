import HttpStatus from 'http-status-codes'
import { inject } from 'inversify'
import { controller, httpDelete, request, response } from 'inversify-express-utils'
import { Request, Response } from 'express'
import { Identifier } from '../../di/identifiers'
import { IUserService } from '../../application/port/user.service.interface'
import { ApiExceptionManager } from '../exception/api.exception.manager'
import { ILogger } from '../../utils/custom.logger'

@controller('/v1/users')
export class UsersController {
    constructor(
        @inject(Identifier.USER_SERVICE) private readonly _userService: IUserService,
        @inject(Identifier.LOGGER) readonly _logger: ILogger
    ) {
    }

    @httpDelete('/:user_id')
    public async removeUser(@request() req: Request, @response() res: Response): Promise<Response> {
        try {
            await this._userService.remove(req.params.user_id)
            return res.status(HttpStatus.NO_CONTENT).send()
        } catch (err) {
            const handlerError = ApiExceptionManager.build(err)
            return res.status(handlerError.code)
                .send(handlerError.toJson())
        }
    }
}
