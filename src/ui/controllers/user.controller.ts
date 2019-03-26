import HttpStatus from 'http-status-codes'
import { inject } from 'inversify'
import { controller, httpDelete, httpPatch, request, response } from 'inversify-express-utils'
import { Request, Response } from 'express'
import { Identifier } from '../../di/identifiers'
import { IUserService } from '../../application/port/user.service.interface'
import { ApiExceptionManager } from '../exception/api.exception.manager'
import { ApiException } from '../exception/api.exception'
import { ILogger } from '../../utils/custom.logger'
import { ChangePasswordException } from '../../application/domain/exception/change.password.exception'
import { Strings } from '../../utils/strings'

/**
 * Controller that implements User feature operations.
 *
 * @remarks To define paths, we use library inversify-express-utils.
 * @see {@link https://github.com/inversify/inversify-express-utils} for further information.
 */
@controller('/users')
export class UserController {

    /**
     * Creates an instance of UserController.
     *
     * @param {IUserService} _userService
     * @param {ILogger} _logger
     */
    constructor(
        @inject(Identifier.USER_SERVICE) private readonly _userService: IUserService,
        @inject(Identifier.LOGGER) readonly _logger: ILogger
    ) {
    }

    /**
     * Change user password.
     *
     * @param req
     * @param res
     */
    @httpPatch('/:user_id/password')
    public async changeUserPassword(@request() req: Request, @response() res: Response): Promise<Response> {
        try {
            const result: boolean = await this._userService
                .changePassword(req.params.user_id, req.body.old_password, req.body.new_password)
            if (!result) {
                return res.status(HttpStatus.NOT_FOUND)
                    .send(this.getMessageNotFoundUser())
            }
            return res.status(HttpStatus.NO_CONTENT).send()
        } catch (err) {
            if (err instanceof ChangePasswordException) {
                return res.status(HttpStatus.BAD_REQUEST)
                    .send(new ApiException(HttpStatus.BAD_REQUEST, err.message, err.description).toJson())
            }
            const handlerError = ApiExceptionManager.build(err)
            return res.status(handlerError.code)
                .send(handlerError.toJson())
        }
    }

    /**
     * Remove user by id.
     *
     * @param {Request} req
     * @param {Response} res
     */
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

    private getMessageNotFoundUser(): object {
        return new ApiException(
            HttpStatus.NOT_FOUND,
            Strings.USER.NOT_FOUND,
            Strings.USER.NOT_FOUND_DESCRIPTION
        ).toJson()
    }
}
