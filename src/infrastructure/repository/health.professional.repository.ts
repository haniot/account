import { inject, injectable } from 'inversify'
import { HealthProfessional } from '../../application/domain/model/health.professional'
import { HealthProfessionalEntity } from '../entity/health.professional.entity'
import { BaseRepository } from './base/base.repository'
import { IHealthProfessionalRepository } from '../../application/port/health.professional.repository.interface'
import { IEntityMapper } from '../port/entity.mapper.interface'
import { Identifier } from '../../di/identifiers'
import { ILogger } from '../../utils/custom.logger'
import { ValidationException } from '../../application/domain/exception/validation.exception'
import { Query } from './query/query'
import { UserType } from '../../application/domain/utils/user.type'
import { IAuthRepository } from '../../application/port/auth.repository.interface'

@injectable()
export class HealthProfessionalRepository extends BaseRepository<HealthProfessional, HealthProfessionalEntity>
    implements IHealthProfessionalRepository {

    constructor(
        @inject(Identifier.USER_REPO_MODEL) readonly _healthProfessionalModel: any,
        @inject(Identifier.HEALTH_PROFESSIONAL_ENTITY_MAPPER) readonly _healthProfessionalMapper:
            IEntityMapper<HealthProfessional, HealthProfessionalEntity>,
        @inject(Identifier.AUTH_REPOSITORY) private readonly _authRepository: IAuthRepository,
        @inject(Identifier.LOGGER) readonly _logger: ILogger
    ) {
        super(_healthProfessionalModel, _healthProfessionalMapper, _logger)
    }

    public create(item: HealthProfessional): Promise<HealthProfessional> {
        if (item.password) item.password = this._authRepository.encryptPassword(item.password)
        return super.create(item)
    }

    public count(): Promise<number> {
        return super.count(new Query())
    }

    public checkExists(users: HealthProfessional | Array<HealthProfessional>): Promise<boolean | ValidationException> {
        const query: Query = new Query()
        return new Promise<boolean | ValidationException>((resolve, reject) => {
            if (users instanceof Array) {
                if (users.length === 0) return resolve(false)

                let count = 0
                const resultHealthProfessionalIds: Array<string> = []

                users.forEach((healthProfessional: HealthProfessional) => {
                    if (healthProfessional.id) query.filters = { _id: healthProfessional.id }

                    query.addFilter({ type: UserType.HEALTH_PROFESSIONAL })

                    this.findOne(query)
                        .then(result => {
                            count++
                            if (!result && healthProfessional.id) resultHealthProfessionalIds.push(healthProfessional.id)
                            if (count === users.length) {
                                if (resultHealthProfessionalIds.length > 0) {
                                    return resolve(new ValidationException(resultHealthProfessionalIds.join(', ')))
                                }
                                return resolve(true)
                            }
                        }).catch(err => reject(super.mongoDBErrorListener(err)))
                })
            } else {
                if (users.id) query.filters = { _id: users.id }
                query.addFilter({ type: UserType.HEALTH_PROFESSIONAL })
                this.findOne(query)
                    .then(result => resolve(!!result))
                    .catch(err => reject(super.mongoDBErrorListener(err)))
            }
        })
    }

}
