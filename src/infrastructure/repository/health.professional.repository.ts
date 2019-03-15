import { inject, injectable } from 'inversify'
import { HealthProfessional } from '../../application/domain/model/health.professional'
import { HealthProfessionalEntity } from '../entity/health.professional.entity'
import { BaseRepository } from './base/base.repository'
import { IHealthProfessionalRepository } from '../../application/port/health.professional.repository.interface'
import { IEntityMapper } from '../port/entity.mapper.interface'
import { Identifier } from '../../di/identifiers'
import { ILogger } from '../../utils/custom.logger'
import { IUserRepository } from '../../application/port/user.repository.interface'

@injectable()
export class HealthProfessionalRepository extends BaseRepository<HealthProfessional, HealthProfessionalEntity>
    implements IHealthProfessionalRepository {

    constructor(
        @inject(Identifier.USER_REPO_MODEL) readonly _healthProfessionalModel: any,
        @inject(Identifier.HEALTH_PROFESSIONAL_ENTITY_MAPPER) readonly _healthProfessionalMapper:
            IEntityMapper<HealthProfessional, HealthProfessionalEntity>,
        @inject(Identifier.USER_REPOSITORY) private readonly _userRepository: IUserRepository,
        @inject(Identifier.LOGGER) readonly _logger: ILogger
    ) {
        super(_healthProfessionalModel, _healthProfessionalMapper, _logger)
    }

    public create(item: HealthProfessional): Promise<HealthProfessional> {
        if (item.password) item.password = this._userRepository.encryptPassword(item.password)
        return super.create(item)
    }
}
