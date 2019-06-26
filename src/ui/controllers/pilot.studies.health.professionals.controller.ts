import { controller, httpDelete, httpGet, httpPost, request, response } from 'inversify-express-utils'
import HttpStatus from 'http-status-codes'
import { Identifier } from '../../di/identifiers'
import { IPilotStudyService } from '../../application/port/pilot.study.service.interface'
import { inject } from 'inversify'
import { ILogger } from '../../utils/custom.logger'
import { Request, Response } from 'express'
import { ApiException } from '../exception/api.exception'
import { Strings } from '../../utils/strings'
import { ApiExceptionManager } from '../exception/api.exception.manager'
import { Query } from '../../infrastructure/repository/query/query'
import { HealthProfessional } from '../../application/domain/model/health.professional'

@controller('/v1/pilotstudies/:pilot_studies/healthprofessionals')
export class PilotStudiesHealthProfessionalsController {
    constructor(
        @inject(Identifier.PILOT_STUDY_SERVICE) private readonly _pilotStudyService: IPilotStudyService,
        @inject(Identifier.LOGGER) readonly _logger: ILogger
    ) {
    }

    @httpGet('/')
    public async getAllHealthProfessionalsFromPilotStudy(
        @request() req: Request, @response() res: Response): Promise<Response> {
        try {
            const result: Array<HealthProfessional> =
                await this._pilotStudyService.getAllHealthProfessionals(req.params.pilot_studies, new Query().fromJSON(req.query))

            const allHealth: Array<HealthProfessional> =
                await this._pilotStudyService.getAllHealthProfessionals(req.params.pilot_studies, new Query())

            res.setHeader('X-Total-Count', allHealth.length)
            return res.status(HttpStatus.OK).send(this.toJSONView(result))
        } catch (err) {
            const handleError = ApiExceptionManager.build(err)
            return res.status(handleError.code).send(handleError.toJson())
        }
    }

    @httpPost('/:healthprofessional_id')
    public async associateHealthProfessionalToPilotStudy(
        @request() req: Request, @response() res: Response): Promise<Response> {
        try {
            const result: Array<HealthProfessional> = await this._pilotStudyService.associateHealthProfessional(
                req.params.pilot_studies, req.params.healthprofessional_id)
            if (!result) return res.status(HttpStatus.NOT_FOUND).send(this.getMessagePilotStudyNotFound())
            return res.status(HttpStatus.CREATED).send(this.toJSONView(result))
        } catch (err) {
            const handleError = ApiExceptionManager.build(err)
            return res.status(handleError.code).send(handleError.toJson())
        }
    }

    @httpDelete('/:healthprofessional_id')
    public async disassociateHealthProfessionalFromPilotStudy(
        @request() req: Request, @response() res: Response): Promise<Response> {
        try {
            await this._pilotStudyService.disassociateHealthProfessional(
                req.params.pilot_studies, req.params.healthprofessional_id)
            return res.status(HttpStatus.NO_CONTENT).send()
        } catch (err) {
            const handleError = ApiExceptionManager.build(err)
            return res.status(handleError.code).send(handleError.toJson())
        }
    }

    private toJSONView(healthProfessional: HealthProfessional | Array<HealthProfessional>): object {
        if (healthProfessional instanceof Array) return healthProfessional.map(item => this.toJSONView(item))
        healthProfessional.type = undefined
        return healthProfessional.toJSON()
    }

    private getMessagePilotStudyNotFound(): object {
        return new ApiException(
            HttpStatus.NOT_FOUND,
            Strings.PILOT_STUDY.NOT_FOUND,
            Strings.PILOT_STUDY.NOT_FOUND_DESCRIPTION
        ).toJson()
    }
}
