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

@controller('/v1/pilotstudies/:pilotstudy_id/healthprofessionals')
export class PilotStudiesHealthProfessionalsController {
    constructor(
        @inject(Identifier.PILOT_STUDY_SERVICE) private readonly _pilotStudyService: IPilotStudyService,
        @inject(Identifier.LOGGER) readonly _logger: ILogger
    ) {
    }

    @httpGet('/')
    public async getAllHealthprofessionalsFromPilotStudy(
        @request() req: Request, @response() res: Response): Promise<Response> {
        try {
            const result: any =
                await this._pilotStudyService.getAllHealthProfessionals(req.params.pilotstudy_id, new Query().fromJSON(req.query))
            const allHealth: any =
                await this._pilotStudyService.getAllHealthProfessionals(req.params.pilotstudy_id, new Query())
            const count: number = allHealth!.length
            res.setHeader('X-Total-Count', count)
            if (!result) return res.status(HttpStatus.NOT_FOUND).send(this.getMessagePilotStudyNotFound())
            return res.status(HttpStatus.OK).send(result)
        } catch (err) {
            const handleError = ApiExceptionManager.build(err)
            return res.status(handleError.code).send(handleError.toJson())
        }
    }

    @httpPost('/:healthprofessional_id')
    public async associateHealthprofessionalToPilotStudy(
        @request() req: Request, @response() res: Response): Promise<Response> {
        try {
            const result: any = await this._pilotStudyService.associateHealthProfessional(
                req.params.pilotstudy_id, req.params.healthprofessional_id
            )
            if (!result) return res.status(HttpStatus.NOT_FOUND).send(this.getMessagePilotStudyNotFound())
            return res.status(HttpStatus.CREATED).send(result)
        } catch (err) {
            const handleError = ApiExceptionManager.build(err)
            return res.status(handleError.code).send(handleError.toJson())
        }
    }

    @httpDelete('/:healthprofessional_id')
    public async disassociateHealthprofessionalFromPilotStudy(
        @request() req: Request, @response() res: Response): Promise<Response> {
        try {
            const result: any = await this._pilotStudyService.disassociateHealthProfessional(
                req.params.pilotstudy_id, req.params.healthprofessional_id
            )
            if (!result) return res.status(HttpStatus.NOT_FOUND).send(this.getMessagePilotStudyNotFound())
            return res.status(HttpStatus.NO_CONTENT).send()
        } catch (err) {
            const handleError = ApiExceptionManager.build(err)
            return res.status(handleError.code).send(handleError.toJson())
        }
    }

    private getMessagePilotStudyNotFound(): object {
        return new ApiException(
            HttpStatus.NOT_FOUND,
            Strings.PILOT_STUDY.NOT_FOUND,
            Strings.PILOT_STUDY.NOT_FOUND_DESCRIPTION
        ).toJson()
    }
}
