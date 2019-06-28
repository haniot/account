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
import { Strings } from '../../utils/strings'
import { IUserRepository } from '../port/user.repository.interface'
import { ConflictException } from '../domain/exception/conflict.exception'
import { IPilotStudyRepository } from '../port/pilot.study.repository.interface'

@injectable()
export class HealthProfessionalService implements IHealthProfessionalService {
    constructor(
        @inject(Identifier.HEALTH_PROFESSIONAL_REPOSITORY) private readonly _healthProfessionalRepository:
            IHealthProfessionalRepository,
        @inject(Identifier.USER_REPOSITORY) private readonly _userRepository: IUserRepository,
        @inject(Identifier.PILOT_STUDY_REPOSITORY) private readonly _pilotStudyRepository: IPilotStudyRepository) {
    }

    public async add(item: HealthProfessional): Promise<HealthProfessional> {
        try {
            CreateHealthProfessionalValidator.validate(item)
            const exists = await this._userRepository.checkExist(item.email)
            if (exists) throw new ConflictException(Strings.USER.EMAIL_ALREADY_REGISTERED)
            const result: HealthProfessional = await this._healthProfessionalRepository.create(item)
            return Promise.resolve(result ? this.addReadOnlyInformation(result) : result)
        } catch (err) {
            return Promise.reject(err)
        }

    }

    public async getAll(query: IQuery): Promise<Array<HealthProfessional>> {
        query.addFilter({ type: UserType.HEALTH_PROFESSIONAL })
        const result: Array<HealthProfessional> = await this._healthProfessionalRepository.find(query)
        return Promise.resolve(result && result.length ? this.addMultipleReadOnlyInformation(result) : result)
    }

    public async getById(id: string, query: IQuery): Promise<HealthProfessional> {
        try {
            ObjectIdValidator.validate(id)
            query.addFilter({ _id: id, type: UserType.HEALTH_PROFESSIONAL })
            const result: HealthProfessional = await this._healthProfessionalRepository.findOne(query)
            return Promise.resolve(result ? this.addReadOnlyInformation(result) : result)
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
            item.last_login = undefined
            const result: HealthProfessional = await this._healthProfessionalRepository.update(item)
            return Promise.resolve(result ? this.addReadOnlyInformation(result) : result)
        } catch (err) {
            return Promise.reject(err)
        }
    }

    public count(): Promise<number> {
        return this._healthProfessionalRepository.count()
    }

    private async addMultipleReadOnlyInformation(item: Array<HealthProfessional>): Promise<Array<HealthProfessional>> {
        try {
            for (let i = 0; i < item.length; i++) item[i] = await this.addReadOnlyInformation(item[i])
        } catch (err) {
            return Promise.reject(err)
        }
        return Promise.resolve(item)
    }

    private async addReadOnlyInformation(item: HealthProfessional): Promise<HealthProfessional> {
        try {
            item.total_pilot_studies = await this._pilotStudyRepository.countPilotStudiesFromHealthProfessional(item.id!)
            item.total_patients = await this._pilotStudyRepository.countPatientsFromHealthProfessional(item.id!)
        } catch (err) {
            return Promise.reject(err)
        }
        return item
    }
}
