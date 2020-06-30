import HttpStatus from 'http-status-codes'
import { inject } from 'inversify'
import { controller, httpGet, httpPatch, httpPost, request, response } from 'inversify-express-utils'
import { Request, Response } from 'express'
import { Identifier } from '../../di/identifiers'
import { ApiExceptionManager } from '../exception/api.exception.manager'
import { Query } from '../../infrastructure/repository/query/query'
import { ApiException } from '../exception/api.exception'
import { ILogger } from '../../utils/custom.logger'
import { Strings } from '../../utils/strings'
import { IHealthProfessionalService } from '../../application/port/health.professional.service.interface'
import { HealthProfessional } from '../../application/domain/model/health.professional'
import { IQuery } from '../../application/port/query.interface'
import { UserType } from '../../application/domain/utils/user.type'

@controller('/v1/healthprofessionals')
export class HealthProfessionalsController {
    constructor(
        @inject(Identifier.HEALTH_PROFESSIONAL_SERVICE)
        private readonly _healthProfessionalService: IHealthProfessionalService,
        @inject(Identifier.LOGGER) readonly _logger: ILogger
    ) {
    }

    @httpPost('/')
    public async saveHealthProfessional(@request() req: Request, @response() res: Response): Promise<Response> {
        try {
            const health: HealthProfessional =
                new HealthProfessional().fromJSON({
                    ...req.body,
                    change_password: false,
                    email_verified: false
                })
            const result: HealthProfessional = await this._healthProfessionalService.add(health)
            return res.status(HttpStatus.CREATED).send(this.toJSONView(result))
        } catch (err) {
            const handlerError = ApiExceptionManager.build(err)
            return res.status(handlerError.code)
                .send(handlerError.toJSON())
        }
    }

    @httpGet('/')
    public async getAllHealthProfessionals(@request() req: Request, @response() res: Response): Promise<Response> {
        try {
            const query: IQuery = new Query().fromJSON(req.query)
            query.addFilter({ type: UserType.HEALTH_PROFESSIONAL })
            const result: Array<HealthProfessional> =
                await this._healthProfessionalService.getAll(query)
            const count: number = await this._healthProfessionalService.count(query)
            res.setHeader('X-Total-Count', count)
            return res.status(HttpStatus.OK).send(this.toJSONView(result))
        } catch (err) {
            const handlerError = ApiExceptionManager.build(err)
            return res.status(handlerError.code)
                .send(handlerError.toJSON())
        }
    }

    @httpGet('/:healthprofessional_id')
    public async getHealthProfessionalById(@request() req: Request, @response() res: Response): Promise<Response> {
        try {
            const result: HealthProfessional = await this._healthProfessionalService
                .getById(req.params.healthprofessional_id, new Query().fromJSON(req.query))
            if (!result) return res.status(HttpStatus.NOT_FOUND).send(this.getMessageHealthProfessionalNotFound())
            return res.status(HttpStatus.OK).send(this.toJSONView(result))
        } catch (err) {
            const handlerError = ApiExceptionManager.build(err)
            return res.status(handlerError.code)
                .send(handlerError.toJSON())
        }
    }

    @httpPatch('/:healthprofessional_id')
    public async updateHealthProfessionalById(@request() req: Request, @response() res: Response): Promise<Response> {
        try {
            const healthProfessional: HealthProfessional = new HealthProfessional().fromJSON(req.body)
            healthProfessional.id = req.params.healthprofessional_id
            const result: HealthProfessional = await this._healthProfessionalService.update(healthProfessional)
            if (!result) return res.status(HttpStatus.NOT_FOUND).send(this.getMessageHealthProfessionalNotFound())
            return res.status(HttpStatus.OK).send(this.toJSONView(result))
        } catch (err) {
            const handlerError = ApiExceptionManager.build(err)
            return res.status(handlerError.code)
                .send(handlerError.toJSON())
        }
    }

    private toJSONView(healthProfessional: HealthProfessional | Array<HealthProfessional>): object {
        if (healthProfessional instanceof Array) return healthProfessional.map(item => this.toJSONView(item))
        healthProfessional.type = undefined
        return healthProfessional.toJSON()
    }

    private getMessageHealthProfessionalNotFound(): object {
        return new ApiException(
            HttpStatus.NOT_FOUND,
            Strings.HEALTH_PROFESSIONAL.NOT_FOUND,
            Strings.HEALTH_PROFESSIONAL.NOT_FOUND_DESCRIPTION
        ).toJSON()
    }

}
