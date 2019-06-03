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
import { Query } from '../../infrastructure/repository/query/query'
import { Patient } from '../domain/model/patient'
import { IPatientRepository } from '../port/patient.repository.interface'

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
            CreatePilotStudyValidator.validate(item)
            if (item.health_professionals_id) {
                const validateHealthList =
                    await this._healthProfessionalRepository.checkExists(item.health_professionals_id)
                if (validateHealthList instanceof ValidationException) {
                    throw new ValidationException(
                        Strings.HEALTH_PROFESSIONAL.HEALTH_PROFESSIONAL_REGISTER_REQUIRED,
                        Strings.HEALTH_PROFESSIONAL.IDS_WITHOUT_REGISTER.concat(' ').concat(validateHealthList.message)
                    )
                }
            }
            return this._pilotStudyRepository.create(item)
        } catch (err) {
            return Promise.reject(err)
        }
    }

    public async getAll(query: IQuery): Promise<Array<PilotStudy>> {
        return this._pilotStudyRepository.find(query)
    }

    public async getById(id: string, query: IQuery): Promise<PilotStudy> {
        try {
            ObjectIdValidator.validate(id)
            query.addFilter({ _id: id })
            return this._pilotStudyRepository.findOne(query)
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
            return this._pilotStudyRepository.update(item)
        } catch (err) {
            return Promise.reject(err)
        }
    }

    public async associateHealthProfessional(pilotId: string, healthId: string): Promise<Array<HealthProfessional> | undefined> {

        try {
            ObjectIdValidator.validate(pilotId)
            ObjectIdValidator.validate(healthId)

            const query: Query = new Query()
            query.addFilter({ _id: pilotId })

            const pilotStudy: PilotStudy = await this._pilotStudyRepository.findOne(query)
            if (!pilotStudy) return Promise.resolve(undefined)

            const checkHealthExists =
                await this._healthProfessionalRepository.checkExists(new HealthProfessional().fromJSON(healthId))
            if (!checkHealthExists) throw new ValidationException(Strings.HEALTH_PROFESSIONAL.ASSOCIATION_FAILURE)
            pilotStudy.addHealthProfessional(new HealthProfessional().fromJSON(healthId))

            const result = await this._pilotStudyRepository.update(pilotStudy)
            if (!result) return Promise.resolve(undefined)

            if (result.health_professionals_id && result.health_professionals_id.length) {
                result.health_professionals_id.forEach(value => {
                    value.type = undefined
                })
            }

            return Promise.resolve(result.health_professionals_id)
        } catch (err) {
            return Promise.reject(err)
        }
    }

    public async disassociateHealthProfessional(pilotId: string, healthId: string): Promise<boolean | undefined> {
        try {
            ObjectIdValidator.validate(healthId)
            ObjectIdValidator.validate(pilotId)

            const query: Query = new Query()
            query.addFilter({ _id: pilotId })

            const pilotStudy: PilotStudy = await this._pilotStudyRepository.findOne(query)
            if (!pilotStudy) return Promise.resolve(undefined)

            if (pilotStudy.health_professionals_id) {
                pilotStudy.health_professionals_id =
                    await pilotStudy.health_professionals_id.filter(healthProfessional => {
                        return healthProfessional.id !== healthId
                    })

                return await this._pilotStudyRepository.update(pilotStudy) !== undefined
            }

            return await Promise.resolve(true)
        } catch (err) {
            return Promise.reject(err)
        }
    }

    public async getAllHealthProfessionals(pilotId: string, query: IQuery): Promise<Array<HealthProfessional> | undefined> {
        try {
            ObjectIdValidator.validate(pilotId)

            query.addFilter({ _id: pilotId })

            const pilotStudy: PilotStudy = await this._pilotStudyRepository.findOne(query)
            if (!pilotStudy) return Promise.resolve(undefined)
            if (pilotStudy.health_professionals_id && pilotStudy.health_professionals_id.length) {
                pilotStudy.health_professionals_id.forEach(value => {
                    value.type = undefined
                })
            }

            return Promise.resolve(pilotStudy.health_professionals_id)
        } catch (err) {
            return Promise.reject(err)
        }
    }

    public async getAllPatients(pilotId: string, query: IQuery): Promise<Array<Patient> | undefined> {
        try {
            ObjectIdValidator.validate(pilotId)
            query.addFilter({ pilotstudy_id: pilotId })
            const patients: Array<Patient> = await this._patientRepository.find(query)
            return Promise.resolve(patients)
        } catch (err) {
            return Promise.reject(err)
        }
    }

}
