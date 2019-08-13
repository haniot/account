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

const adminRepo: IAdminRepository = DIContainer.get(Identifier.ADMIN_REPOSITORY)
const dbConnection: IConnectionDB = DIContainer.get(Identifier.MONGODB_CONNECTION)
const app: App = DIContainer.get(Identifier.APP)
const request = require('supertest')(app.getExpress())

describe('Routes: Users', () => {
    const user = new Admin().fromJSON(DefaultEntityMock.ADMIN)

    before(async () => {
            try {
                await dbConnection.tryConnect(0, 500)
                await deleteAllUsers({})
                const result = await adminRepo.create(user)
                user.id = result.id
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
    })
})

async function deleteAllUsers(doc) {
    return await UserRepoModel.deleteMany(doc)
}
