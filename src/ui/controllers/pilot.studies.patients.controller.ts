import { controller, httpDelete, httpGet, httpPost, request, response } from 'inversify-express-utils'
import HttpStatus from 'http-status-codes'
import { Identifier } from '../../di/identifiers'
import { IPilotStudyService } from '../../application/port/pilot.study.service.interface'
import { inject } from 'inversify'
import { ILogger } from '../../utils/custom.logger'
import { Request, Response } from 'express'
import { ApiExceptionManager } from '../exception/api.exception.manager'
import { Query } from '../../infrastructure/repository/query/query'
import { Patient } from '../../application/domain/model/patient'
import { ApiException } from '../exception/api.exception'
import { Strings } from '../../utils/strings'

@controller('/v1/pilotstudies/:pilotstudy_id/patients')
export class PilotStudiesPatientsController {
    constructor(
        @inject(Identifier.PILOT_STUDY_SERVICE) private readonly _pilotStudyService: IPilotStudyService,
        @inject(Identifier.LOGGER) readonly _logger: ILogger
    ) {
    }

    @httpGet('/')
    public async getAllPatientsFromPilotStudy(
        @request() req: Request, @response() res: Response): Promise<Response> {
        try {
            const result: any =
                await this._pilotStudyService.getAllPatients(req.params.pilotstudy_id, new Query().fromJSON(req.query))
            const allPatients: any =
                await this._pilotStudyService.getAllPatients(req.params.pilotstudy_id, new Query())
            const count: number = allPatients!.length
            res.setHeader('X-Total-Count', count)
            return res.status(HttpStatus.OK).send(result)
        } catch (err) {
            const handleError = ApiExceptionManager.build(err)
            return res.status(handleError.code).send(handleError.toJson())
        }
    }

    @httpPost('/:patient_id')
    public async associateHealthProfessionalToPilotStudy(@request() req: Request, @response() res: Response): Promise<Response> {
        try {
            const result: Array<Patient> = await this._pilotStudyService.associatePatient(
                req.params.pilotstudy_id, req.params.patient_id)
            if (!result) return res.status(HttpStatus.NOT_FOUND).send(this.getMessagePilotStudyNotFound())
            return res.status(HttpStatus.CREATED).send(this.toJSONView(result))
        } catch (err) {
            const handleError = ApiExceptionManager.build(err)
            return res.status(handleError.code).send(handleError.toJson())
        }
    }

    @httpDelete('/:patient_id')
    public async disassociateHealthProfessionalFromPilotStudy(
        @request() req: Request, @response() res: Response): Promise<Response> {
        try {
            await this._pilotStudyService.disassociatePatient(
                req.params.pilotstudy_id, req.params.patient_id)
            return res.status(HttpStatus.NO_CONTENT).send()
        } catch (err) {
            const handleError = ApiExceptionManager.build(err)
            return res.status(handleError.code).send(handleError.toJson())
        }
    }

    private toJSONView(patient: Patient | Array<Patient>): object {
        if (patient instanceof Array) return patient.map(item => this.toJSONView(item))
        patient.type = undefined
        return patient.toJSON()
    }

    private getMessagePilotStudyNotFound(): object {
        return new ApiException(
            HttpStatus.NOT_FOUND,
            Strings.PILOT_STUDY.NOT_FOUND,
            Strings.PILOT_STUDY.NOT_FOUND_DESCRIPTION
        ).toJson()
    }
}
