import { IHealthProfessionalService } from '../port/health.professional.service.interface'
import { inject, injectable } from 'inversify'
import { HealthProfessional } from '../domain/model/health.professional'
import { IQuery } from '../port/query.interface'
import { Identifier } from '../../di/identifiers'
import { IHealthProfessionalRepository } from '../port/health.professional.repository.interface'
import { CreateHealthProfessionalValidator } from '../domain/validator/create.health.professional.validator'
import { UserType } from '../domain/utils/user.type'
import { ObjectIdValidator } from '../domain/validator/object.id.validator'
import { UpdateHealthProfessionalValidator } from '../domain/validator/update.health.professional.validator'
import { IPilotStudyRepository } from '../port/pilot.study.repository.interface'
import { PilotStudy } from '../domain/model/pilot.study'
import { Query } from '../../infrastructure/repository/query/query'

@injectable()
export class HealthProfessionalService implements IHealthProfessionalService {
    constructor(
        @inject(Identifier.HEALTH_PROFESSIONAL_REPOSITORY) private readonly _healthProfessionalRepository:
            IHealthProfessionalRepository,
        @inject(Identifier.PILOT_STUDY_REPOSITORY) private readonly _pilotStudyRepository: IPilotStudyRepository) {
    }

    public async add(item: HealthProfessional): Promise<HealthProfessional> {
        try {
            CreateHealthProfessionalValidator.validate(item)
            return this._healthProfessionalRepository.create(item)
        } catch (err) {
            return Promise.reject(err)
        }

    }

    public getAll(query: IQuery): Promise<Array<HealthProfessional>> {
        query.addFilter({ type: UserType.HEALTH_PROFESSIONAL })
        return this._healthProfessionalRepository.find(query)
    }

    public getById(id: string, query: IQuery): Promise<HealthProfessional> {
        try {
            ObjectIdValidator.validate(id)
            query.addFilter({ _id: id, type: UserType.HEALTH_PROFESSIONAL })
            return this._healthProfessionalRepository.findOne(query)
        } catch (err) {
            return Promise.reject(err)
        }
    }

    public remove(id: string): Promise<boolean> {
        try {
            ObjectIdValidator.validate(id)
            return Promise.resolve(this._healthProfessionalRepository.delete(id))
        } catch (err) {
            return Promise.reject(err)
        }
    }

    public async update(item: HealthProfessional): Promise<HealthProfessional> {
        try {
            UpdateHealthProfessionalValidator.validate(item)
            return this._healthProfessionalRepository.update(item)
        } catch (err) {
            return Promise.reject(err)
        }
    }

    public async getAllPilotStudies(item: HealthProfessional): Promise<Array<PilotStudy>> {
        try {
            const result = await this._pilotStudyRepository.find(new Query().fromJSON({
                health_professionals_id: { $in: item.id }
            }))

            if (result.length) {
                result.forEach(pilotStudy => {
                    pilotStudy.health_professionals_id = undefined
                })
            }

            return result
        } catch (err) {
            return Promise.reject(err)
        }
    }
}
