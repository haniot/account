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
import { ConflictException } from '../domain/exception/conflict.exception'
import { Strings } from '../../utils/strings'
import { IUserRepository } from '../port/user.repository.interface'

@injectable()
export class HealthProfessionalService implements IHealthProfessionalService {
    constructor(
        @inject(Identifier.HEALTH_PROFESSIONAL_REPOSITORY) private readonly _healthProfessionalRepository:
            IHealthProfessionalRepository,
        @inject(Identifier.USER_REPOSITORY) private readonly _userRepository: IUserRepository) {
    }

    public async add(item: HealthProfessional): Promise<HealthProfessional> {
        try {
            CreateHealthProfessionalValidator.validate(item)

            const hasUsername = await this._userRepository.checkExist(item.username!)
            if (hasUsername) throw new ConflictException(Strings.USER.USERNAME_ALREADY_REGISTERED)

            const hasEmail = await this._userRepository.checkExist(undefined, item.email!)
            if (hasEmail) throw new ConflictException(Strings.USER.EMAIL_ALREADY_REGISTERED)
        } catch (err) {
            return Promise.reject(err)
        }

        return this._healthProfessionalRepository.create(item)
    }

    public getAll(query: IQuery): Promise<Array<HealthProfessional>> {
        query.addFilter({ type: UserType.HEALTH_PROFESSIONAL })
        return this._healthProfessionalRepository.find(query)
    }

    public getById(id: string, query: IQuery): Promise<HealthProfessional> {
        try {
            ObjectIdValidator.validate(id)
        } catch (err) {
            return Promise.reject(err)
        }

        query.addFilter({ _id: id, type: UserType.HEALTH_PROFESSIONAL })
        return this._healthProfessionalRepository.findOne(query)
    }

    public remove(id: string): Promise<boolean> {
        try {
            ObjectIdValidator.validate(id)
        } catch (err) {
            return Promise.reject(err)
        }

        return Promise.resolve(this._healthProfessionalRepository.delete(id))
    }

    public async update(item: HealthProfessional): Promise<HealthProfessional> {
        try {
            UpdateHealthProfessionalValidator.validate(item)

            if (item.username) {
                const hasUsername = await this._userRepository.checkExist(item.username)
                if (hasUsername) throw new ConflictException(Strings.USER.USERNAME_ALREADY_REGISTERED)
            }
            if (item.email) {
                const hasEmail = await this._userRepository.checkExist(undefined, item.email)
                if (hasEmail) throw new ConflictException(Strings.USER.EMAIL_ALREADY_REGISTERED)
            }
        } catch (err) {
            return Promise.reject(err)
        }

        return this._healthProfessionalRepository.update(item)
    }
}
