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

@controller('/pilotstudies')
export class PilotStudyController {
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
            return res.status(HttpStatus.OK).send(this.toJSONView(result))
        } catch (err) {
            const handleError = ApiExceptionManager.build(err)
            return res.status(handleError.code).send(handleError.toJson())
        } finally {
            req.query = {}
        }
    }

    @httpGet('/:pilotstudy_id')
    public async getPilotStudyById(@request() req: Request, @response() res: Response): Promise<Response> {
        try {
            const result: PilotStudy =
                await this._pilotStudyService.getById(req.params.pilotstudy_id, new Query().fromJSON(req.query))
            if (!result) return res.status(HttpStatus.NOT_FOUND).send(this.getMessagePilotStudyNotFound())
            return res.status(HttpStatus.OK).send(this.toJSONView(result))
        } catch (err) {
            const handleError = ApiExceptionManager.build(err)
            return res.status(handleError.code).send(handleError.toJson())
        } finally {
            req.query = {}
        }
    }

    @httpPatch('/:pilotstudy_id')
    public async updatePilotStudy(@request() req: Request, @response() res: Response): Promise<Response> {
        try {
            const pilot: PilotStudy = new PilotStudy().fromJSON(req.body)
            pilot.id = req.params.pilotstudy_id
            const result: PilotStudy = await this._pilotStudyService.update(pilot)
            if (!result) return res.status(HttpStatus.NOT_FOUND).send(this.getMessagePilotStudyNotFound())
            return res.status(HttpStatus.OK).send(this.toJSONView(result))
        } catch (err) {
            const handleError = ApiExceptionManager.build(err)
            return res.status(handleError.code).send(handleError.toJson())
        }
    }

    @httpDelete('/:pilotstudy_id')
    public async deletePilotStudy(@request() req: Request, @response() res: Response): Promise<Response> {
        try {
            const result: any = await this._pilotStudyService.remove(req.params.pilotstudy_id)
            if (!result) return res.status(HttpStatus.NOT_FOUND).send(this.getMessagePilotStudyNotFound())
            return res.status(HttpStatus.NO_CONTENT).send()
        } catch (err) {
            const handleError = ApiExceptionManager.build(err)
            return res.status(handleError.code).send(handleError.toJson())
        }
    }

    @httpGet('/:pilotstudy_id/healthprofessionals')
    public async getAllHealthprofessionalsFromPilotStudy(
        @request() req: Request, @response() res: Response): Promise<Response> {
        try {
            const result: any =
                await this._pilotStudyService.getAllHealthProfessionals(
                    req.params.pilotstudy_id,
                    new Query().fromJSON(req.query))
            if (!result) return res.status(HttpStatus.NOT_FOUND).send(this.getMessagePilotStudyNotFound())
            return res.status(HttpStatus.OK).send(result)

        } catch (err) {
            const handleError = ApiExceptionManager.build(err)
            return res.status(handleError.code).send(handleError.toJson())
        }
    }

    @httpPost('/:pilotstudy_id/healthprofessionals/:healthprofessional_id')
    public async associateHealthprofessionalToPilotStudy(
        @request() req: Request, @response() res: Response): Promise<Response> {
        try {
            const result: any = await this._pilotStudyService.associateHealthProfessional(
                req.params.pilotstudy_id, req.params.healthprofessional_id
            )

            if (!result) return res.status(HttpStatus.NOT_FOUND).send(this.getMessagePilotStudyNotFound())
            return res.status(HttpStatus.NO_CONTENT).send()
        } catch (err) {
            const handleError = ApiExceptionManager.build(err)
            return res.status(handleError.code).send(handleError.toJson())
        }
    }

    @httpDelete('/:pilotstudy_id/healthprofessionals/:healthprofessional_id')
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

    private toJSONView(pilot: PilotStudy | Array<PilotStudy>): object {
        if (pilot instanceof Array) {
            return pilot.map(item => {
                return item.toJSON()
            })
        }
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
