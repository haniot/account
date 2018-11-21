import { inject } from 'inversify'
import { Identifier } from '../di/identifiers'
import { IUserRepository } from '../application/port/user.repository.interface'
import { IQuery } from '../application/port/query.interface'
import { Query } from '../infrastructure/repository/query/query'
import { UserType } from '../application/domain/utils/user.type'
import { User } from '../application/domain/model/user'
import { ILogger } from '../utils/custom.logger'
import { RepositoryException } from '../application/domain/exception/repository.exception'

/**
 * In this class it's checked whether there are any admin users in the
 * database. If there is no, a default user is created with the following
 * data:
 *
 * - email: admin@haniot.com
 * - password: admin
 * - type: 1
 */
export class RegisterDefaultAdminTask {
    constructor(
        @inject(Identifier.USER_REPOSITORY) private readonly _userRepository: IUserRepository,
        @inject(Identifier.LOGGER) private readonly _logger: ILogger
    ) {
    }

    public async run(): Promise<void> {
        const query: IQuery = new Query()
        query.filters = { type: UserType.ADMIN }
        try {
            const countUser = await this._userRepository.count(query)
            if (countUser <= 0) {
                const user = await this._userRepository.create(
                    new User(
                        'admin',
                        'admin@haniot.com',
                        'admin',
                        UserType.ADMIN,
                        true))
                if (!user) throw new RepositoryException('Default admin user not created')
                this._logger.info('Default admin user created successfully.')
            }
        } catch (err) {
            this._logger.error(err.message)
            setTimeout(run, 2000)
        }
    }
}
