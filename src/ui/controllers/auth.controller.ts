import HttpStatus from 'http-status-codes'
import { inject } from 'inversify'
import { controller, httpPatch, httpPost, request, response } from 'inversify-express-utils'
import { Request, Response } from 'express'
import { Identifier } from '../../di/identifiers'
import { ApiExceptionManager } from '../exception/api.exception.manager'
import { IAuthService } from '../../application/port/auth.service.interface'
import { ApiException } from '../exception/api.exception'
import { Strings } from '../../utils/strings'

@controller('/v1/auth')
export class AuthController {
    constructor(
        @inject(Identifier.AUTH_SERVICE) private readonly _authService: IAuthService
    ) {
    }

    @httpPost('/')
    public async auth(@request() req: Request, @response() res: Response): Promise<Response> {
        try {
            const result: any = await this._authService.authenticate(req.body.email, req.body.password)
            if (result) return res.status(HttpStatus.OK).send(result)
            return res.status(HttpStatus.UNAUTHORIZED)
                .send(new ApiException(HttpStatus.UNAUTHORIZED, 'Invalid email or password!').toJson())
        } catch (err) {
            const handlerError = ApiExceptionManager.build(err)
            return res.status(handlerError.code)
                .send(handlerError.toJson())
        }
    }

    @httpPost('/forgot')
    public async resetPassword(@request() req: Request, @response() res: Response): Promise<Response> {
        try {
            return res.status(HttpStatus.ACCEPTED)
                .send({
                    message: 'If a matching account is found, an email has been sent ' +
                        `to ${req.body.email} to allow you to reset your password.`
                })
        } catch (err) {
            const handlerError = ApiExceptionManager.build(err)
            return res.status(handlerError.code)
                .send(handlerError.toJson())
        }
    }

    @httpPost('/verify-email')
    public async verifyEmail(@request() req: Request, @response() res: Response): Promise<Response> {
        try {
            return res.status(HttpStatus.NO_CONTENT).send()
        } catch (err) {
            const handlerError = ApiExceptionManager.build(err)
            return res.status(handlerError.code)
                .send(handlerError.toJson())
        }
    }

    @httpPatch('/password')
    public async changePassword(@request() req: Request, @response() res: Response): Promise<Response> {
        try {
            const result: boolean =
                await this._authService.changePassword(req.body.email, req.body.old_password, req.body.new_password)
            if (!result) return res.status(HttpStatus.BAD_REQUEST).send(this.getMessageInvalidOperation())
            return res.status(HttpStatus.NO_CONTENT).send()
        } catch (err) {
            const handlerError = ApiExceptionManager.build(err)
            return res.status(handlerError.code)
                .send(handlerError.toJson())
        }
    }

    private getMessageInvalidOperation(): object {
        return new ApiException(
            HttpStatus.BAD_REQUEST,
            Strings.ERROR_MESSAGE.OPERATION_CANT_BE_COMPLETED,
            Strings.ERROR_MESSAGE.OPERATION_CANT_BE_COMPLETED_DESC
        ).toJson()
    }

}
