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

@injectable()
export class PilotStudyService implements IPilotStudyService {
    constructor(
        @inject(Identifier.PILOT_STUDY_REPOSITORY) private readonly _pilotStudyRepository: IPilotStudyRepository,
        @inject(Identifier.HEALTH_PROFESSIONAL_REPOSITORY)
        private readonly _healthProfessionalRepository: IHealthProfessionalRepository) {
    }

    public async add(item: PilotStudy): Promise<PilotStudy> {

        try {
            CreatePilotStudyValidator.validate(item)

            if (item.name) {
                const hasName =
                    await this._pilotStudyRepository.checkExists(item)
                if (hasName) throw new ValidationException(Strings.PILOT_STUDY.NAME_ALREADY_REGISTERED)
            }

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
        } catch (err) {
            return Promise.reject(err)
        }

        return this._pilotStudyRepository.create(item)
    }

    public async getAll(query: IQuery): Promise<Array<PilotStudy>> {
        return this._pilotStudyRepository.find(query)
    }

    public async getById(id: string, query: IQuery): Promise<PilotStudy> {
        try {
            ObjectIdValidator.validate(id)
        } catch (err) {
            return Promise.reject(err)
        }
        query.addFilter({ _id: id })
        return this._pilotStudyRepository.findOne(query)
    }

    public async remove(id: string): Promise<boolean> {
        try {
            ObjectIdValidator.validate(id)
        } catch (err) {
            return Promise.reject(err)
        }
        return this._pilotStudyRepository.delete(id)
    }

    public async update(item: PilotStudy): Promise<PilotStudy> {
        try {
            UpdatePilotStudyValidator.validate(item)

            if (item.name) {
                const hasName =
                    await this._pilotStudyRepository.checkExists(new PilotStudy().fromJSON({ name: item.name }))
                if (hasName) throw new ValidationException(Strings.PILOT_STUDY.NAME_ALREADY_REGISTERED)
            }

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
        } catch (err) {
            return Promise.reject(err)
        }
        return this._pilotStudyRepository.update(item)
    }

    public async associateHealthProfessional(pilotId: string, healthId: string): Promise<PilotStudy> {

        try {
            ObjectIdValidator.validate(healthId)
            ObjectIdValidator.validate(pilotId)

            const pilotStudy: PilotStudy =
                await this._pilotStudyRepository.findOne(new Query().fromJSON({ _id: pilotId }))
            if (!pilotStudy)
                throw new ValidationException(Strings.PILOT_STUDY.NOT_FOUND, Strings.PILOT_STUDY.NOT_FOUND_DESCRIPTION)

            const checkHealthExists =
                await this._healthProfessionalRepository.checkExists(new HealthProfessional().fromJSON(healthId))
            if (!checkHealthExists) throw new ValidationException(Strings.HEALTH_PROFESSIONAL.ASSOCIATION_FAILURE)

            pilotStudy.addHealthProfessional(new HealthProfessional().fromJSON(healthId))

            return this._pilotStudyRepository.update(pilotStudy)
        } catch (err) {
            return Promise.reject(err)
        }
    }

    public async disassociateHealthProfessional(pilotId: string, healthId: string): Promise<boolean | undefined> {
        try {
            ObjectIdValidator.validate(healthId)
            ObjectIdValidator.validate(pilotId)

            const pilotStudy: PilotStudy =
                await this._pilotStudyRepository.findOne(new Query().fromJSON({ _id: pilotId }))
            if (!pilotStudy)
                throw new ValidationException(Strings.PILOT_STUDY.NOT_FOUND, Strings.PILOT_STUDY.NOT_FOUND_DESCRIPTION)

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

            return Promise.resolve(pilotStudy.health_professionals_id ? pilotStudy.health_professionals_id : [])
        } catch (err) {
            return Promise.reject(err)
        }
    }
}
