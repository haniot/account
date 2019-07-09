import { inject, injectable } from 'inversify'
import { IPilotStudyService } from '../port/pilot.study.service.interface'
import { PilotStudy } from '../domain/model/pilot.study'
import { IQuery } from '../port/query.interface'
import { Identifier } from '../../di/identifiers'
import { IPilotStudyRepository } from '../port/pilot.study.repository.interface'
import { CreatePilotStudyValidator } from '../domain/validator/create.pilot.study.validator'
import { UpdatePilotStudyValidator } from '../domain/validator/update.pilot.study.validator'
import { IHealthProfessionalRepository } from '../port/health.professional.repository.interface'
import { ValidationException } from '../domain/exception/validation.exception'
import { Strings } from '../../utils/strings'
import { HealthProfessional } from '../domain/model/health.professional'
import { ObjectIdValidator } from '../domain/validator/object.id.validator'
import { Patient } from '../domain/model/patient'
import { IPatientRepository } from '../port/patient.repository.interface'
import { UserType } from '../domain/utils/user.type'

@injectable()
export class PilotStudyService implements IPilotStudyService {
    constructor(
        @inject(Identifier.PILOT_STUDY_REPOSITORY) private readonly _pilotStudyRepository: IPilotStudyRepository,
        @inject(Identifier.HEALTH_PROFESSIONAL_REPOSITORY)
        private readonly _healthProfessionalRepository: IHealthProfessionalRepository,
        @inject(Identifier.PATIENT_REPOSITORY) private readonly _patientRepository: IPatientRepository) {
    }

    public async add(item: PilotStudy): Promise<PilotStudy> {
        try {
            if (item.patients) item.patients = undefined
            CreatePilotStudyValidator.validate(item)
            if (item.health_professionals) {
                const validateHealthList =
                    await this._healthProfessionalRepository.checkExists(item.health_professionals)
                if (validateHealthList instanceof ValidationException) {
                    throw new ValidationException(
                        Strings.HEALTH_PROFESSIONAL.HEALTH_PROFESSIONAL_REGISTER_REQUIRED,
                        Strings.HEALTH_PROFESSIONAL.IDS_WITHOUT_REGISTER.concat(' ').concat(validateHealthList.message)
                    )
                }
            }
            const result: PilotStudy = await this._pilotStudyRepository.create(item)
            return Promise.resolve(this.addReadOnlyInformation(result))
        } catch (err) {
            return Promise.reject(err)
        }
    }

    public async getAll(query: IQuery): Promise<Array<PilotStudy>> {
        const result: Array<PilotStudy> = await this._pilotStudyRepository.find(query)
        return Promise.resolve(this.addMultipleReadOnlyInformation(result))
    }

    public async getById(id: string, query: IQuery): Promise<PilotStudy> {
        try {
            ObjectIdValidator.validate(id)
            query.addFilter({ _id: id })
            const result: PilotStudy = await this._pilotStudyRepository.findOne(query)
            return Promise.resolve(this.addReadOnlyInformation(result))
        } catch (err) {
            return Promise.reject(err)
        }
    }

    public async remove(id: string): Promise<boolean> {
        try {
            ObjectIdValidator.validate(id)
            return this._pilotStudyRepository.delete(id)
        } catch (err) {
            return Promise.reject(err)
        }
    }

    public async update(item: PilotStudy): Promise<PilotStudy> {
        try {
            UpdatePilotStudyValidator.validate(item)
            const result: PilotStudy = await this._pilotStudyRepository.update(item)
            return Promise.resolve(this.addReadOnlyInformation(result))
        } catch (err) {
            return Promise.reject(err)
        }
    }

    public count(): Promise<number> {
        return this._pilotStudyRepository.count()
    }

    public async getAllPilotStudiesFromHealthProfessional(healthId: string, query: IQuery): Promise<Array<PilotStudy>> {
        try {
            ObjectIdValidator.validate(healthId)
        } catch (err) {
            return Promise.reject(err)
        }
        query.addFilter({ health_professionals: healthId })
        return this.getAll(query)
    }

    public async getAllPilotStudiesFromPatient(patientId: string, query: IQuery): Promise<Array<PilotStudy>> {
        try {
            ObjectIdValidator.validate(patientId)
        } catch (err) {
            return Promise.reject(err)
        }
        query.addFilter({ patients: patientId })
        return this.getAll(query)
    }

    public async associateHealthProfessional(pilotId: string, healthId: string): Promise<boolean> {
        try {
            ObjectIdValidator.validate(pilotId)
            ObjectIdValidator.validate(healthId)

            const pilotExist: boolean = await this._pilotStudyRepository.checkExists(new PilotStudy().fromJSON(pilotId))
            if (!pilotExist) throw new ValidationException(Strings.PILOT_STUDY.ASSOCIATION_FAILURE)

            const healthExists = await this._healthProfessionalRepository.checkExists(new HealthProfessional().fromJSON(healthId))
            if (!healthExists) throw new ValidationException(Strings.HEALTH_PROFESSIONAL.ASSOCIATION_FAILURE)

            const result: PilotStudy =
                await this._pilotStudyRepository.associateUser(pilotId, healthId, UserType.HEALTH_PROFESSIONAL)
            return Promise.resolve(!!result)
        } catch (err) {
            return Promise.reject(err)
        }
    }

    public async disassociateHealthProfessional(pilotId: string, healthId: string): Promise<boolean> {
        try {
            ObjectIdValidator.validate(pilotId)
            ObjectIdValidator.validate(healthId)

            const result: PilotStudy =
                await this._pilotStudyRepository.disassociateUser(pilotId, healthId, UserType.HEALTH_PROFESSIONAL)
            return Promise.resolve(!!result)
        } catch (err) {
            return Promise.reject(err)
        }
    }

    public async getAllHealthProfessionals(pilotId: string, query: IQuery): Promise<Array<HealthProfessional>> {
        try {
            ObjectIdValidator.validate(pilotId)
            query.addFilter({ _id: pilotId })

            const result: PilotStudy = await this._pilotStudyRepository.findOneAndPopulate(query)
            return Promise.resolve(result && result.health_professionals ? result.health_professionals : [])
        } catch (err) {
            return Promise.reject(err)
        }
    }

    public async associatePatient(pilotId: string, patientId: string): Promise<boolean> {
        try {
            ObjectIdValidator.validate(pilotId)
            ObjectIdValidator.validate(patientId)

            const pilotExist: boolean = await this._pilotStudyRepository.checkExists(new PilotStudy().fromJSON(pilotId))
            if (!pilotExist) throw new ValidationException(Strings.PILOT_STUDY.ASSOCIATION_FAILURE)

            const patientExists = await this._patientRepository.checkExists(new Patient().fromJSON(patientId))
            if (!patientExists) throw new ValidationException(Strings.PATIENT.ASSOCIATION_FAILURE)

            const result: PilotStudy = await this._pilotStudyRepository.associateUser(pilotId, patientId, UserType.PATIENT)
            return Promise.resolve(!!result)
        } catch (err) {
            return Promise.reject(err)
        }
    }

    public async disassociatePatient(pilotId: string, patientId: string): Promise<boolean> {
        try {
            ObjectIdValidator.validate(pilotId)
            ObjectIdValidator.validate(patientId)

            const result: PilotStudy = await this._pilotStudyRepository.disassociateUser(pilotId, patientId, UserType.PATIENT)
            return Promise.resolve(!!result)
        } catch (err) {
            return Promise.reject(err)
        }
    }

    public async getAllPatients(pilotId: string, query: IQuery): Promise<Array<Patient>> {
        try {
            ObjectIdValidator.validate(pilotId)
            query.addFilter({ _id: pilotId })

            const result: PilotStudy = await this._pilotStudyRepository.findOneAndPopulate(query)
            return Promise.resolve(result && result.patients ? result.patients : [])
        } catch (err) {
            return Promise.reject(err)
        }
    }

    public countPilotStudiesFromHealthProfessional(healthId: string): Promise<number> {
        return this._pilotStudyRepository.countPilotStudiesFromHealthProfessional(healthId)
    }

    public countPilotStudiesFromPatient(patientId: string): Promise<number> {
        return this._pilotStudyRepository.countPilotStudiesFromPatient(patientId)
    }

    private async addMultipleReadOnlyInformation(item: Array<PilotStudy>): Promise<Array<PilotStudy>> {
        if (item && item.length) {
            try {
                for (let i = 0; i < item.length; i++) item[i] = await this.addReadOnlyInformation(item[i])
            } catch (err) {
                return Promise.reject(err)
            }
        }
        return Promise.resolve(item)
    }

    private async addReadOnlyInformation(item: PilotStudy): Promise<PilotStudy> {
        if (item) {
            try {
                item.total_health_professionals =
                    item.health_professionals && item.health_professionals.length ? item.health_professionals.length : 0
                item.total_patients = item.patients && item.patients.length ? item.patients.length : 0
            } catch (err) {
                return Promise.reject(err)
            }
        }
        return item
    }
}
