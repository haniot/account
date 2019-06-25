import { controller, httpDelete, httpGet, httpPatch, httpPost, request, response } from 'inversify-express-utils'
import HttpStatus from 'http-status-codes'
import { Identifier } from '../../di/identifiers'
import { IPilotStudyService } from '../../application/port/pilot.study.service.interface'
import { inject } from 'inversify'
import { ILogger } from '../../utils/custom.logger'
import { Request, Response } from 'express'
import { PilotStudy } from '../../application/domain/model/pilot.study'
import { ApiException } from '../exception/api.exception'
import { Strings } from '../../utils/strings'
import { ApiExceptionManager } from '../exception/api.exception.manager'
import { Query } from '../../infrastructure/repository/query/query'

@controller('/v1/pilotstudies')
export class PilotStudiesController {
    constructor(
        @inject(Identifier.PILOT_STUDY_SERVICE) private readonly _pilotStudyService: IPilotStudyService,
        @inject(Identifier.LOGGER) readonly _logger: ILogger
    ) {
    }

    @httpPost('/')
    public async addPilotStudy(@request() req: Request, @response() res: Response): Promise<Response> {
        try {
            const pilotStudy: PilotStudy = new PilotStudy().fromJSON(req.body)
            const result = await this._pilotStudyService.add(pilotStudy)
            return res.status(HttpStatus.CREATED).send(this.toJSONView(result))
        } catch (err) {
            const handleError = ApiExceptionManager.build(err)
            return res.status(handleError.code).send(handleError.toJson())
        }
    }

    @httpGet('/')
    public async getAllPilotStudies(@request() req: Request, @response() res: Response): Promise<Response> {
        try {
            const result: Array<PilotStudy> = await this._pilotStudyService.getAll(new Query().fromJSON(req.query))
            const count: number = await this._pilotStudyService.count(new Query())
            res.setHeader('X-Total-Count', count)
            return res.status(HttpStatus.OK).send(this.toJSONView(result))
        } catch (err) {
            const handleError = ApiExceptionManager.build(err)
            return res.status(handleError.code).send(handleError.toJson())
        } finally {
            req.query = {}
        }
    }

    @httpGet('/:pilot_studies')
    public async getPilotStudyById(@request() req: Request, @response() res: Response): Promise<Response> {
        try {
            const result: PilotStudy =
                await this._pilotStudyService.getById(req.params.pilot_studies, new Query().fromJSON(req.query))
            if (!result) return res.status(HttpStatus.NOT_FOUND).send(this.getMessagePilotStudyNotFound())
            return res.status(HttpStatus.OK).send(this.toJSONView(result))
        } catch (err) {
            const handleError = ApiExceptionManager.build(err)
            return res.status(handleError.code).send(handleError.toJson())
        } finally {
            req.query = {}
        }
    }

    @httpPatch('/:pilot_studies')
    public async updatePilotStudy(@request() req: Request, @response() res: Response): Promise<Response> {
        try {
            const pilot: PilotStudy = new PilotStudy().fromJSON(req.body)
            pilot.id = req.params.pilot_studies
            const result: PilotStudy = await this._pilotStudyService.update(pilot)
            if (!result) return res.status(HttpStatus.NOT_FOUND).send(this.getMessagePilotStudyNotFound())
            return res.status(HttpStatus.OK).send(this.toJSONView(result))
        } catch (err) {
            const handleError = ApiExceptionManager.build(err)
            return res.status(handleError.code).send(handleError.toJson())
        }
    }

    @httpDelete('/:pilot_studies')
    public async deletePilotStudy(@request() req: Request, @response() res: Response): Promise<Response> {
        try {
            await this._pilotStudyService.remove(req.params.pilot_studies)
            return res.status(HttpStatus.NO_CONTENT).send()
        } catch (err) {
            const handleError = ApiExceptionManager.build(err)
            return res.status(handleError.code).send(handleError.toJson())
        }
    }

    private toJSONView(pilot: PilotStudy | Array<PilotStudy>): object {
        if (pilot instanceof Array) return pilot.map(item => item.toJSON())
        return pilot.toJSON()
    }

    private getMessagePilotStudyNotFound(): object {
        return new ApiException(
            HttpStatus.NOT_FOUND,
            Strings.PILOT_STUDY.NOT_FOUND,
            Strings.PILOT_STUDY.NOT_FOUND_DESCRIPTION
        ).toJson()
    }
}
