import { expect } from 'chai'
import { App } from '../../../src/app'
import { Identifier } from '../../../src/di/identifiers'
import { DI } from '../../../src/di/di'
import { IConnectionDB } from '../../../src/infrastructure/port/connection.db.interface'
import { Container } from 'inversify'
import { Admin } from '../../../src/application/domain/model/admin'
import { UserType } from '../../../src/application/domain/utils/user.type'
import { IAdminRepository } from '../../../src/application/port/admin.repository.interface'
import { UserRepoModel } from '../../../src/infrastructure/database/schema/user.schema'

const container: Container = DI.getInstance().getContainer()
const dbConnection: IConnectionDB = container.get(Identifier.MONGODB_CONNECTION)
const adminRepo: IAdminRepository = container.get(Identifier.ADMIN_REPOSITORY)
const app: App = container.get(Identifier.APP)
const request = require('supertest')(app.getExpress())

describe('Routes: Auth', () => {
    const user = new Admin()
    user.email = 'admin@test.com'
    user.password = 'password'
    user.type = UserType.ADMIN
    user.change_password = false

    before(async () => {
            try {
                await dbConnection.tryConnect(0, 500)
                await adminRepo.create(user)
            } catch (err) {
                throw new Error('Failure on Auth test: ' + err.message)
            }
        }
    )

    after(async () => {
        try {
            await deleteAllUsers({})
            await dbConnection.dispose()
        } catch (err) {
            throw new Error('Failure on Auth test: ' + err.message)
        }
    })
})

async function deleteAllUsers(doc) {
    return await UserRepoModel.deleteMany(doc)
}

// async function updateUser(doc) {
//     return await UserRepoModel.updateOne({ _id: doc.id }, doc, { new: true })
// }
