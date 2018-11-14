import HttpStatus from 'http-status-codes'
import { inject } from 'inversify'
import { controller, httpDelete, httpGet, httpPatch, httpPost, request, response } from 'inversify-express-utils'
import { Request, Response } from 'express'
import { Identifier } from '../../di/identifiers'
import { User } from '../../application/domain/model/user'
import { IUserService } from '../../application/port/user.service.interface'
import { ApiExceptionManager } from '../exceptions/api.exception.manager'
import { Query } from '../../infrastructure/repository/query/query'
import { ApiException } from '../exceptions/api.exception'
import { ILogger } from '../../utils/custom.logger'
import { UserType } from '../../application/domain/utils/user.type'

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
     * Add new user as admin.
     *
     * @param {Request} req
     * @param {Response} res
     */
    @httpPost('/auth')
    public async authUser(@request() req: Request, @response() res: Response): Promise<Response> {
        // TODO implementar rota de autenticação
        return res.status(201).send({ token: 'validtoken' })
    }

    /**
     * Add new user as admin.
     *
     * @param {Request} req
     * @param {Response} res
     */
    @httpPost('/admin')
    public async addAdminUser(@request() req: Request, @response() res: Response): Promise<Response> {
        try {
            const result: User = await this._userService
                .add(new User(req.body.email, req.body.password, UserType.ADMIN))
            return res.status(HttpStatus.CREATED).send(result)
        } catch (err) {
            const handlerError = ApiExceptionManager.build(err)
            return res.status(handlerError.code)
                .send(handlerError.toJson())
        }
    }

    /**
     * Add new user as admin.
     *
     * @param {Request} req
     * @param {Response} res
     */
    @httpPost('/caregiver')
    public async addCaregiverUser(@request() req: Request, @response() res: Response): Promise<Response> {
        try {
            const result: User = await this._userService
                .add(new User(req.body.email, req.body.password, UserType.CAREGIVER))
            return res.status(HttpStatus.CREATED).send(result)
        } catch (err) {
            const handlerError = ApiExceptionManager.build(err)
            return res.status(handlerError.code)
                .send(handlerError.toJson())
        }
    }

    @httpPatch('/:user_id/password')
    public async changeUserPassword(@request() req: Request, @response() res: Response): Promise<Response> {
        try {
            const result: boolean = await this._userService
                .changePassword(req.params.user_id, req.body.old_password, req.body.new_password)
            if (!result) {
                return res.status(HttpStatus.BAD_REQUEST)
                    .send(this.getMessageNotChangePassword())
            }
            return res.status(HttpStatus.NO_CONTENT).send()
        } catch (err) {
            const handlerError = ApiExceptionManager.build(err)
            return res.status(handlerError.code)
                .send(handlerError.toJson())
        }
    }

    /**
     * Get all users.
     * For the query strings, the query-strings-parser middleware was used.
     * @see {@link https://www.npmjs.com/package/query-strings-parser} for further information.
     *
     * @param {Request} req
     * @param {Response} res
     */
    @httpGet('/')
    public async getAllUsers(@request() req: Request, @response() res: Response) {
        try {
            const result: Array<User> = await this._userService.getAll(new Query().deserialize(req.query))
            return res.status(HttpStatus.OK).send(result)
        } catch (err) {
            const handlerError = ApiExceptionManager.build(err)
            return res.status(handlerError.code)
                .send(handlerError.toJson())
        }
    }

    /**
     * Get user by id.
     * For the query strings, the query-strings-parser middleware was used.
     * @see {@link https://www.npmjs.com/package/query-strings-parser} for further information.
     *
     * @param {Request} req
     * @param {Response} res
     */
    @httpGet('/:user_id')
    public async getUserById(@request() req: Request, @response() res: Response): Promise<Response> {
        try {
            const result: User = await this._userService
                .getById(req.params.user_id, new Query().deserialize(req.query))
            if (!result) return res.status(HttpStatus.NOT_FOUND)
                .send(this.getMessageNotFoundUser())
            return res.status(HttpStatus.OK).send(result)
        } catch (err) {
            const handlerError = ApiExceptionManager.build(err)
            return res.status(handlerError.code)
                .send(handlerError.toJson())
        }
    }

    /**
     * Update user by id.
     *
     * @param {Request} req
     * @param {Response} res
     */
    @httpPatch('/:user_id')
    public async updateUser(@request() req: Request, @response() res: Response): Promise<Response> {
        try {
            const user: User = new User().deserialize(req.body)
            user.setId(req.params.user_id)
            const result = await this._userService.update(user)
            if (!result) return res.status(HttpStatus.NOT_FOUND).send(this.getMessageNotFoundUser())
            return res.status(HttpStatus.OK).send(result)
        } catch (err) {
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
            const result: boolean = await this._userService.remove(req.params.user_id)
            if (!result) return res.status(HttpStatus.NOT_FOUND).send(this.getMessageNotFoundUser())
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
            'User not found!',
            'User not found or already removed. A new operation for the same resource is not required!'
        ).toJson()
    }

    private getMessageNotChangePassword(): object {
        return new ApiException(
            HttpStatus.BAD_REQUEST,
            'Password could not be updated',
            'The password could not be updated. Probably, ' +
            'the params are syntactically incorrect.'
        ).toJson()
    }

}
