import HttpStatus from 'http-status-codes'
import { controller, httpGet, httpPatch, httpPost, request, response } from 'inversify-express-utils'
import { Request, Response } from 'express'
import { inject } from 'inversify'
import { Identifier } from '../../di/identifiers'
import { ApiExceptionManager } from '../exception/api.exception.manager'
import { ApiException } from '../exception/api.exception'
import { Strings } from '../../utils/strings'
import { Query } from '../../infrastructure/repository/query/query'
import { ILogger } from '../../utils/custom.logger'
import { IPatientService } from '../../application/port/patient.service.interface'
import { Patient } from '../../application/domain/model/patient'

@controller('/v1/patients')
export class PatientsController {
    constructor(
        @inject(Identifier.PATIENT_SERVICE) private readonly _patientService: IPatientService,
        @inject(Identifier.LOGGER) readonly _logger: ILogger
    ) {
    }

    @httpPost('/')
    public async addPatientUser(@request() req: Request, @response() res: Response): Promise<Response> {
        try {
            const patient: Patient = new Patient().fromJSON({ ...req.body, change_password: false, email_verified: false })
            const result: Patient = await this._patientService.add(patient)
            return res.status(HttpStatus.CREATED).send(this.toJSONView(result))
        } catch (err) {
            const handleError = ApiExceptionManager.build(err)
            return res.status(handleError.code).send(handleError.toJson())
        }
    }

    @httpGet('/')
    public async getAllPatients(@request() req: Request, @response() res: Response): Promise<Response> {
        try {
            const result: Array<Patient> = await this._patientService.getAll(new Query().fromJSON(req.query))
            const count: number = await this._patientService.count()
            res.setHeader('X-Total-Count', count)
            return res.status(HttpStatus.OK).send(this.toJSONView(result))
        } catch (err) {
            const handlerError = ApiExceptionManager.build(err)
            return res.status(handlerError.code)
                .send(handlerError.toJson())
        } finally {
            req.query = {}
        }
    }

    @httpGet('/:patient_id')
    public async getPatientById(@request() req: Request, @response() res: Response): Promise<Response> {
        try {
            const result: Patient = await this._patientService.getById(req.params.patient_id, new Query().fromJSON(req.query))
            if (!result) return res.status(HttpStatus.NOT_FOUND).send(this.getMessagePatientNotFound())
            return res.status(HttpStatus.OK).send(this.toJSONView(result))
        } catch (err) {
            const handlerError = ApiExceptionManager.build(err)
            return res.status(handlerError.code)
                .send(handlerError.toJson())
        } finally {
            req.query = {}
        }
    }

    @httpPatch('/:patient_id')
    public async updatePatientById(@request() req: Request, @response() res: Response): Promise<Response> {
        try {
            const patient: Patient = new Patient().fromJSON(req.body)
            patient.id = req.params.patient_id
            const result: Patient = await this._patientService.update(patient)
            if (!result) return res.status(HttpStatus.NOT_FOUND).send(this.getMessagePatientNotFound())
            return res.status(HttpStatus.OK).send(this.toJSONView(result))
        } catch (err) {
            const handlerError = ApiExceptionManager.build(err)
            return res.status(handlerError.code)
                .send(handlerError.toJson())
        }
    }

    private toJSONView(patient: Patient | Array<Patient>): object {
        if (patient instanceof Array) return patient.map(item => this.toJSONView(item))
        patient.type = undefined
        return patient.toJSON()
    }

    private getMessagePatientNotFound(): object {
        return new ApiException(
            HttpStatus.NOT_FOUND,
            Strings.PATIENT.NOT_FOUND,
            Strings.PATIENT.NOT_FOUND_DESCRIPTION
        ).toJson()
    }
}
