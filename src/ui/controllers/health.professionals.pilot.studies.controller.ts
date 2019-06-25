import HttpStatus from 'http-status-codes'
import { inject } from 'inversify'
import { controller, httpGet, request, response } from 'inversify-express-utils'
import { Request, Response } from 'express'
import { Identifier } from '../../di/identifiers'
import { ApiExceptionManager } from '../exception/api.exception.manager'
import { Query } from '../../infrastructure/repository/query/query'
import { ApiException } from '../exception/api.exception'
import { ILogger } from '../../utils/custom.logger'
import { Strings } from '../../utils/strings'
import { IHealthProfessionalService } from '../../application/port/health.professional.service.interface'

@controller('/v1/healthprofessionals/:healthprofessional_id/pilotstudies')
export class HealthProfessionalsPilotStudiesController {
    constructor(
        @inject(Identifier.HEALTH_PROFESSIONAL_SERVICE)
        private readonly _healthProfessionalService: IHealthProfessionalService,
        @inject(Identifier.LOGGER) readonly _logger: ILogger
    ) {
    }

    @httpGet('/')
    public async getAllPilotStudiesFromHealthProfessional(@request() req: Request, @response() res: Response): Promise<Response> {
        try {
            const result: any =
                await this._healthProfessionalService
                    .getAllPilotStudies(req.params.healthprofessional_id, new Query().fromJSON(req.query))
            if (!result) return res.status(HttpStatus.NOT_FOUND).send(this.getMessageHealthProfessionalNotFound())

            const allPilots = await this._healthProfessionalService
                .getAllPilotStudies(req.params.healthprofessional_id, new Query())
            const count: number = allPilots!.length
            res.setHeader('X-Total-Count', count)
            return res.status(HttpStatus.OK).send(result)
        } catch (err) {
            const handlerError = ApiExceptionManager.build(err)
            return res.status(handlerError.code)
                .send(handlerError.toJson())
        }
    }

    private getMessageHealthProfessionalNotFound(): object {
        return new ApiException(
            HttpStatus.NOT_FOUND,
            Strings.HEALTH_PROFESSIONAL.NOT_FOUND,
            Strings.HEALTH_PROFESSIONAL.NOT_FOUND_DESCRIPTION
        ).toJson()
    }

}
