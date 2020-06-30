import HttpStatus from 'http-status-codes'
import { inject } from 'inversify'
import { controller, httpGet, httpPatch, request, response } from 'inversify-express-utils'
import { Request, Response } from 'express'
import { Identifier } from '../../di/identifiers'
import { ApiExceptionManager } from '../exception/api.exception.manager'
import { ILogger } from '../../utils/custom.logger'
import { Query } from '../../infrastructure/repository/query/query'
import { Goal } from '../../application/domain/model/goal'
import { IGoalService } from '../../application/port/goal.service.interface'

@controller('/v1/patients/:patient_id/goals')
export class PatientsGoalsController {
    constructor(
        @inject(Identifier.GOAL_SERVICE) private readonly _goalService: IGoalService,
        @inject(Identifier.LOGGER) readonly _logger: ILogger
    ) {
    }

    @httpGet('/')
    public async getGoalsFromPatient(@request() req: Request, @response() res: Response): Promise<Response> {
        try {
            const result: Goal =
                await this._goalService.getFromPatient(req.params.patient_id, new Query().fromJSON(req.query))
            return res.status(HttpStatus.OK).send(result)
        } catch (err) {
            const handlerError = ApiExceptionManager.build(err)
            return res.status(handlerError.code)
                .send(handlerError.toJSON())
        }
    }

    @httpPatch('/')
    public async patchGoalsOfPatient(@request() req: Request, @response() res: Response): Promise<Response> {
        try {
            const goals: Goal = new Goal().fromJSON(req.body)
            const result: Goal = await this._goalService.updateFromPatient(req.params.patient_id, goals)
            return res.status(HttpStatus.OK).send(result)
        } catch (err) {
            const handlerError = ApiExceptionManager.build(err)
            return res.status(handlerError.code)
                .send(handlerError.toJSON())
        }
    }
}
