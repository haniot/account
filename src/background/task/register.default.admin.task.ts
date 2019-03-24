import { inject, injectable } from 'inversify'
import { Identifier } from '../../di/identifiers'
import { IQuery } from '../../application/port/query.interface'
import { Query } from '../../infrastructure/repository/query/query'
import { UserType } from '../../application/domain/utils/user.type'
import { ILogger } from '../../utils/custom.logger'
import { RepositoryException } from '../../application/domain/exception/repository.exception'
import { IConnectionDB } from '../../infrastructure/port/connection.db.interface'
import { IBackgroundTask } from '../../application/port/background.task.interface'
import { Admin } from '../../application/domain/model/admin'
import { IAdminRepository } from '../../application/port/admin.repository.interface'

/**
 * In this class it's checked whether there are any admin users in the
 * database. If there is no, a default user is created with the following
 * data:
 *
 * - email: admin@haniot.com
 * - password: admin*123
 * - type: ADMIN
 */
@injectable()
export class RegisterDefaultAdminTask implements IBackgroundTask {
    constructor(
        @inject(Identifier.MONGODB_CONNECTION) private readonly _mongodb: IConnectionDB,
        @inject(Identifier.ADMIN_REPOSITORY) private readonly _adminRepository: IAdminRepository,
        @inject(Identifier.LOGGER) private readonly _logger: ILogger
    ) {
    }

    public async run(): Promise<void> {
        this._mongodb.eventConnection.on('connected', async () => {
            await this.createUserAdmin()
        })
    }

    private async createUserAdmin(): Promise<void> {
        const query: IQuery = new Query()
        query.filters = { type: UserType.ADMIN }
        try {
            const countUser = await this._adminRepository.count(query)
            if (!countUser) {
                const adminDefault = new Admin()
                adminDefault.password = 'admin*123'
                adminDefault.email = 'admin@haniot.com'
                adminDefault.type = UserType.ADMIN
                adminDefault.change_password = true

                const user = await this._adminRepository.create(adminDefault)
                if (!user) throw new RepositoryException('Default admin user not created')
                this._logger.info('Default admin user created successfully.')
            }
        } catch (err) {
            this._logger.error(err.description)
            setTimeout(run, 2000)
        }
    }

    public stop(): Promise<void> {
        return Promise.resolve()
    }
}
