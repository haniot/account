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
                await deleteAllUsers({})
                const result = await adminRepo.create(user)
                user.id = result.id
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

    describe('POST /auth', () => {
        context('when the auth was successful', () => {
            it('should return the access token', () => {
                request
                    .post('/auth')
                    .send({ email: 'admin@test.com', password: 'password' })
                    .set('Content-Type', 'application/json')
                    .expect(200)
                    .then(res => {
                        expect(res.body).to.have.property('token')
                    })

            })
        })

        context('when there are validation errors', () => {
            it('should return status code 400 and message from missing email', () => {
                request
                    .post('/auth')
                    .send({ password: 'password' })
                    .set('Content-Type', 'application/json')
                    .expect(400)
                    .then(res => {
                        expect(res.body).to.have.property('message')
                        expect(res.body.message).to.eql('Required fields were not provided...')
                        expect(res.body).to.have.property('description')
                        expect(res.body.description).to.eql('Authentication validation: email is required!')
                    })
            })

            it('should return status code 400 and message from invalid email', () => {
                request
                    .post('/auth')
                    .send({ email: 'invalid.com', password: 'password' })
                    .set('Content-Type', 'application/json')
                    .expect(400)
                    .then(res => {
                        expect(res.body).to.have.property('message')
                        expect(res.body.message).to.eql('Invalid email address!')
                    })
            })

            it('should return status code 400 and message from missing password', () => {
                request
                    .post('/auth')
                    .send({ email: 'admin@test.com' })
                    .set('Content-Type', 'application/json')
                    .expect(400)
                    .then(res => {
                        expect(res.body).to.have.property('message')
                        expect(res.body.message).to.eql('Required fields were not provided...')
                        expect(res.body).to.have.property('description')
                        expect(res.body.description).to.eql('Authentication validation: password is required!')
                    })
            })

            it('should return status code 400 and message from missing email and password', () => {
                request
                    .post('/auth')
                    .send({})
                    .set('Content-Type', 'application/json')
                    .expect(400)
                    .then(res => {
                        expect(res.body).to.have.property('message')
                        expect(res.body.message).to.eql('Required fields were not provided...')
                        expect(res.body).to.have.property('description')
                        expect(res.body.description).to.eql('Authentication validation: email, password is required!')
                    })
            })
        })

        context('when the email or password is invalid', () => {
            it('should return status code 401 and message for invalid email ', () => {
                request
                    .post('/auth')
                    .send({ email: 'another@mail.com', password: 'password' })
                    .set('Content-Type', 'application/json')
                    .expect(401)
                    .then(res => {
                        expect(res.body).to.have.property('message')
                        expect(res.body.message).to.eql('Authentication failed due to invalid authentication credentials.')
                    })

            })

            it('should return status code 401 and message for invalid password ', () => {
                request
                    .post('/auth')
                    .send({ email: 'admin@test.com', password: '123' })
                    .set('Content-Type', 'application/json')
                    .expect(401)
                    .then(res => {
                        expect(res.body).to.have.property('message')
                        expect(res.body.message).to.eql('Invalid email or password!')
                    })

            })
        })

        context('when user needs to change password', () => {
            it('should return status code 403 and message from change password required', async () => {
                user.change_password = true
                await updateUser(user.id, { change_password: true }).then()

                request
                    .post('/auth')
                    .send({ email: 'admin@test.com', password: 'password' })
                    .set('Content-Type', 'application/json')
                    .expect(403)
                    .then(res => {
                        expect(res.body).to.have.property('message')
                        expect(res.body.message).to.eql('Change password is necessary.')
                        expect(res.body).to.have.property('description')
                        expect(res.body.description).to.eql('To ensure information security, the user must change the access ' +
                            `password. To change it, access PATCH /users/${user.id}/password.`)
                        expect(res.body).to.have.property('redirect_link')
                        expect(res.body.redirect_link).to.eql(`/users/${user.id}/password`)
                    })
            })
        })
    })
})

async function deleteAllUsers(doc) {
    return await UserRepoModel.deleteMany(doc)
}

async function updateUser(id, doc) {
    return await UserRepoModel.updateOne({ _id: id }, doc, { new: true })
}
