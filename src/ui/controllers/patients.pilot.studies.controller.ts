import HttpStatus from 'http-status-codes'
import { inject } from 'inversify'
import { controller, httpGet, request, response } from 'inversify-express-utils'
import { Request, Response } from 'express'
import { Identifier } from '../../di/identifiers'
import { ApiExceptionManager } from '../exception/api.exception.manager'
import { ILogger } from '../../utils/custom.logger'
import { Query } from '../../infrastructure/repository/query/query'
import { IPilotStudyService } from '../../application/port/pilot.study.service.interface'
import { PilotStudy } from '../../application/domain/model/pilot.study'

@controller('/v1/patients/:patient_id/pilotstudies')
export class HealthProfessionalsPilotStudiesController {
    constructor(
        @inject(Identifier.PILOT_STUDY_SERVICE) private readonly _pilotStudyService: IPilotStudyService,
        @inject(Identifier.LOGGER) readonly _logger: ILogger
    ) {
    }

    @httpGet('/')
    public async getAllPilotStudiesFromHealthProfessional(@request() req: Request, @response() res: Response): Promise<Response> {
        try {
            const query: Query = new Query().fromJSON(req.body)
            query.addFilter({ patients: req.params.patient_id })

            const result: Array<PilotStudy> = await this._pilotStudyService.getAll(query)
            const count: number =
                await this._pilotStudyService.count(new Query().fromJSON({ filters: { patients: req.params.patient_id } }))

            res.setHeader('X-Total-Count', count)
            return res.status(HttpStatus.OK).send(this.toJSONView(result))
        } catch (err) {
            const handlerError = ApiExceptionManager.build(err)
            return res.status(handlerError.code)
                .send(handlerError.toJson())
        }
    }

    private toJSONView(pilot: PilotStudy | Array<PilotStudy>): object {
        if (pilot instanceof Array) return pilot.map(item => this.toJSONView(item))
        const result = pilot.toJSON()
        delete result.patients
        delete result.health_professionals
        return result
    }
}
