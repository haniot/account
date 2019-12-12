import { Admin } from '../../../src/application/domain/model/admin'
import { UserRepoModel } from '../../../src/infrastructure/database/schema/user.schema'
import { DIContainer } from '../../../src/di/di'
import { IConnectionDB } from '../../../src/infrastructure/port/connection.db.interface'
import { Identifier } from '../../../src/di/identifiers'
import { App } from '../../../src/app'
import { expect } from 'chai'
import { ObjectID } from 'bson'
import { Strings } from '../../../src/utils/strings'
import { IAdminRepository } from '../../../src/application/port/admin.repository.interface'
import { DefaultEntityMock } from '../../mocks/models/default.entity.mock'
import { RegisterDefaultAdminTask } from '../../../src/background/task/register.default.admin.task'
import { Query } from '../../../src/infrastructure/repository/query/query'
import { ILogger } from '../../../src/utils/custom.logger'
import { UserRepository } from '../../../src/infrastructure/repository/user.repository'
import { IEntityMapper } from '../../../src/infrastructure/port/entity.mapper.interface'
import { UserEntity } from '../../../src/infrastructure/entity/user.entity'
import { User } from '../../../src/application/domain/model/user'
import { ConnectionMongodb } from '../../../src/infrastructure/database/connection.mongodb'
import { IConnectionFactory } from '../../../src/infrastructure/port/connection.factory.interface'
import { IUserRepository } from '../../../src/application/port/user.repository.interface'

const adminRepo: IAdminRepository = DIContainer.get(Identifier.ADMIN_REPOSITORY)
const dbConnection: IConnectionDB = DIContainer.get(Identifier.MONGODB_CONNECTION)
const app: App = DIContainer.get(Identifier.APP)
const request = require('supertest')(app.getExpress())

describe('Routes: Users', () => {

    before(async () => {
            try {
                await dbConnection.tryConnect(0, 500)
                await deleteAllUsers({})
            } catch (err) {
                throw new Error('Failure on Users test: ' + err.message)
            }
        }
    )

    after(async () => {
        try {
            await deleteAllUsers({})
            await dbConnection.dispose()
        } catch (err) {
            throw new Error('Failure on Users test: ' + err.message)
        }
    })

    describe('DELETE /v1/users/:user_id', () => {
        context('when the delete was successful', () => {
            const user = new Admin().fromJSON(DefaultEntityMock.ADMIN)

            before(async () => {
                    try {
                        await deleteAllUsers({})
                        const result = await adminRepo.create(user)
                        user.id = result.id
                    } catch (err) {
                        throw new Error('Failure on Users test: ' + err.message)
                    }
                }
            )
            it('should return status code 204 and no content', () => {
                return request
                    .delete(`/v1/users/${user.id}`)
                    .set('Content-Type', 'application/json')
                    .expect(204)
                    .then(res => {
                        expect(res.body).to.eql({})
                    })
            })
        })

        context('when the user is not found', () => {
            it('should return status code 204 and no content', () => {
                return request
                    .delete(`/v1/users/${new ObjectID()}`)
                    .set('Content-Type', 'application/json')
                    .expect(204)
                    .then(res => {
                        expect(res.body).to.eql({})
                    })
            })
        })

        context('when the id is invalid', () => {
            it('should return status code 400 and message from invalid id', () => {
                return request
                    .delete('/v1/users/123')
                    .set('Content-Type', 'application/json')
                    .expect(400)
                    .then(res => {
                        expect(res.body).to.have.property('message', Strings.ERROR_MESSAGE.UUID_NOT_VALID_FORMAT)
                        expect(res.body).to.have.property('description', Strings.ERROR_MESSAGE.UUID_NOT_VALID_FORMAT_DESC)
                    })
            })
        })

        context('when the user is the Admin that was created at the first microservice startup', () => {
            const userRepoModel = DIContainer.get(Identifier.USER_REPO_MODEL)
            const userEntityMapper: IEntityMapper<User, UserEntity> = DIContainer.get(Identifier.USER_ENTITY_MAPPER)
            const logger: ILogger = DIContainer.get(Identifier.LOGGER)
            const userRepo: IUserRepository = new UserRepository(userRepoModel, userEntityMapper, logger)
            const dbConnectionFactory: IConnectionFactory = DIContainer.get(Identifier.MONGODB_CONNECTION_FACTORY)
            const otherDbConnection: IConnectionDB = new ConnectionMongodb(dbConnectionFactory, logger)
            before(async () => {
                await new RegisterDefaultAdminTask(otherDbConnection, adminRepo, logger).run()

                await otherDbConnection.tryConnect(0, 100)

                return new Promise(resolve => setTimeout(resolve, 2000))
            })
            after(async () => {
                await deleteAllUsers({})
            })
            it('should return status code 400 and an error message that the operation could not be performed.', async () => {
                const users = await userRepo.find(new Query())
                return request
                    .delete(`/v1/users/${users[0].id}`)
                    .set('Content-Type', 'application/json')
                    .expect(400)
                    .then(res => {
                        expect(res.body).to.have.property('message', 'The operation could not be completed ' +
                            'as the user in question cannot be removed.')
                    })
            })
        })
    })
})

async function deleteAllUsers(doc) {
    return await UserRepoModel.deleteMany(doc)
}
