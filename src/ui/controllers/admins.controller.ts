import HttpStatus from 'http-status-codes'
import { controller, httpGet, httpPatch, httpPost, request, response } from 'inversify-express-utils'
import { Request, Response } from 'express'
import { inject } from 'inversify'
import { Identifier } from '../../di/identifiers'
import { IAdminService } from '../../application/port/admin.service.interface'
import { ApiExceptionManager } from '../exception/api.exception.manager'
import { Admin } from '../../application/domain/model/admin'
import { ApiException } from '../exception/api.exception'
import { Strings } from '../../utils/strings'
import { Query } from '../../infrastructure/repository/query/query'
import { ILogger } from '../../utils/custom.logger'
import { IQuery } from '../../application/port/query.interface'
import { UserType } from '../../application/domain/utils/user.type'

@controller('/v1/admins')
export class AdminsController {
    constructor(
        @inject(Identifier.ADMIN_SERVICE) private readonly _adminService: IAdminService,
        @inject(Identifier.LOGGER) readonly _logger: ILogger
    ) {
    }

    @httpPost('/')
    public async addAdminUser(@request() req: Request, @response() res: Response): Promise<Response> {
        try {
            const admin: Admin = new Admin().fromJSON({ ...req.body, change_password: false, email_verified: false })
            const result: Admin = await this._adminService.add(admin)
            return res.status(HttpStatus.CREATED).send(this.toJSONView(result))
        } catch (err) {
            const handleError = ApiExceptionManager.build(err)
            return res.status(handleError.code).send(handleError.toJSON())
        }
    }

    @httpGet('/')
    public async getAllAdmins(@request() req: Request, @response() res: Response): Promise<Response> {
        try {
            const query: IQuery = new Query().fromJSON(req.query)
            query.addFilter({ type: UserType.ADMIN })
            const result: Array<Admin> = await this._adminService.getAll(query)
            const count: number = await this._adminService.count(query)
            res.setHeader('X-Total-Count', count)
            return res.status(HttpStatus.OK).send(this.toJSONView(result))
        } catch (err) {
            const handlerError = ApiExceptionManager.build(err)
            return res.status(handlerError.code)
                .send(handlerError.toJSON())
        } finally {
            req.query = {}
        }
    }

    @httpGet('/:admin_id')
    public async getAdminById(@request() req: Request, @response() res: Response): Promise<Response> {
        try {
            const result: Admin = await this._adminService.getById(req.params.admin_id, new Query().fromJSON(req.query))
            if (!result) return res.status(HttpStatus.NOT_FOUND).send(this.getMessageAdminNotFound())
            return res.status(HttpStatus.OK).send(this.toJSONView(result))
        } catch (err) {
            const handlerError = ApiExceptionManager.build(err)
            return res.status(handlerError.code)
                .send(handlerError.toJSON())
        } finally {
            req.query = {}
        }
    }

    @httpPatch('/:admin_id')
    public async updateAdminById(@request() req: Request, @response() res: Response): Promise<Response> {
        try {
            const admin: Admin = new Admin().fromJSON(req.body)
            admin.id = req.params.admin_id
            const result: Admin = await this._adminService.update(admin)
            if (!result) return res.status(HttpStatus.NOT_FOUND).send(this.getMessageAdminNotFound())
            return res.status(HttpStatus.OK).send(this.toJSONView(result))
        } catch (err) {
            const handlerError = ApiExceptionManager.build(err)
            return res.status(handlerError.code)
                .send(handlerError.toJSON())
        }
    }

    private toJSONView(admin: Admin | Array<Admin>): object {
        if (admin instanceof Array) {
            return admin.map(item => {
                item.type = undefined
                return item.toJSON()
            })
        }
        admin.type = undefined
        return admin.toJSON()
    }

    private getMessageAdminNotFound(): object {
        return new ApiException(
            HttpStatus.NOT_FOUND,
            Strings.ADMIN.NOT_FOUND,
            Strings.ADMIN.NOT_FOUND_DESCRIPTION
        ).toJSON()
    }
}
