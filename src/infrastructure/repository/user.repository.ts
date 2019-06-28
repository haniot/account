import { inject, injectable } from 'inversify'
import { User } from '../../application/domain/model/user'
import { Identifier } from '../../di/identifiers'
import { IUserRepository } from '../../application/port/user.repository.interface'
import { UserEntity } from '../entity/user.entity'
import { IEntityMapper } from '../port/entity.mapper.interface'
import { BaseRepository } from './base/base.repository'
import { ILogger } from '../../utils/custom.logger'
import { Query } from './query/query'
import { UserType } from '../../application/domain/utils/user.type'

/**
 * Implementation of the user repository.
 *
 * @implements {IUserRepository}
 */
@injectable()
export class UserRepository extends BaseRepository<User, UserEntity> implements IUserRepository {
    constructor(
        @inject(Identifier.USER_REPO_MODEL) protected readonly _userModel: any,
        @inject(Identifier.USER_ENTITY_MAPPER) protected readonly _userMapper: IEntityMapper<User, UserEntity>,
        @inject(Identifier.LOGGER) readonly _logger: ILogger
    ) {
        super(_userModel, _userMapper, _logger)
    }

    /**
     * Checks if an user already has a registration with email.
     * What differs one user to another is your email.
     *
     * @return {Promise<boolean>} True if it exists or False, otherwise.
     * @throws {ValidationException | RepositoryException}
     * @param userEmail
     *
     */
    public async checkExist(userEmail?: string): Promise<boolean> {
        const query = new Query()
        if (userEmail !== undefined) query.addFilter({ email: userEmail })
        return new Promise<boolean>((resolve, reject) => {
            super.findOne(query)
                .then((result: User) => {
                    if (result) return resolve(true)
                    return resolve(false)
                }).catch(err => reject(super.mongoDBErrorListener(err)))
        })
    }

    public countAdmins(): Promise<number> {
        const query: Query = new Query().fromJSON({ filters: { type: UserType.ADMIN } })
        return super.count(query)
    }

    public countHealthProfessionals(): Promise<number> {
        const query: Query = new Query().fromJSON({ filters: { type: UserType.HEALTH_PROFESSIONAL } })
        return super.count(query)
    }

    public countPatients(): Promise<number> {
        const query: Query = new Query().fromJSON({ filters: { type: UserType.PATIENT } })
        return super.count(query)
    }
}
