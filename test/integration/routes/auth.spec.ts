import { expect } from 'chai'
import { App } from '../../../src/app'
import { Identifier } from '../../../src/di/identifiers'
import { DIContainer } from '../../../src/di/di'
import { IConnectionDB } from '../../../src/infrastructure/port/connection.db.interface'
import { Admin } from '../../../src/application/domain/model/admin'
import { UserType } from '../../../src/application/domain/utils/user.type'
import { IAdminRepository } from '../../../src/application/port/admin.repository.interface'
import { UserRepoModel } from '../../../src/infrastructure/database/schema/user.schema'
import { JwtRepositoryMock } from '../../mocks/repositories/jwt.repository.mock'
import { Config } from '../../../src/utils/config'

const dbConnection: IConnectionDB = DIContainer.get(Identifier.MONGODB_CONNECTION)
const adminRepo: IAdminRepository = DIContainer.get(Identifier.ADMIN_REPOSITORY)
const app: App = DIContainer.get(Identifier.APP)
const request = require('supertest')(app.getExpress())

describe('Routes: Auth', () => {
    const user: Admin = new Admin()
    user.email = 'admin@test.com'
    user.password = 'password'
    user.type = UserType.ADMIN
    user.change_password = false
    user.birth_date = '1992-04-01'

    before(async () => {
            try {
                const mongoConfigs = Config.getMongoConfig()
                await dbConnection.tryConnect(mongoConfigs.uri, mongoConfigs.options)
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

    describe('POST /v1/auth', () => {
        context('when the auth was successful', () => {
            it('should return the access token', () => {
                return request
                    .post('/v1/auth')
                    .send({ email: 'admin@test.com', password: 'password' })
                    .set('Content-Type', 'application/json')
                    .expect(200)
                    .then(res => {
                        expect(res.body).to.have.property('access_token')
                    })

            })
        })

        context('when there are validation errors', () => {
            it('should return status code 400 and message from missing email', () => {
                return request
                    .post('/v1/auth')
                    .send({ password: 'password' })
                    .set('Content-Type', 'application/json')
                    .expect(400)
                    .then(res => {
                        expect(res.body).to.have.property('message', 'Required fields were not provided...')
                        expect(res.body).to.have.property('description', 'Authentication validation: email is required!')
                    })
            })

            it('should return status code 400 and message from invalid email', () => {
                return request
                    .post('/v1/auth')
                    .send({ email: 'invalid.com', password: 'password' })
                    .set('Content-Type', 'application/json')
                    .expect(400)
                    .then(res => {
                        expect(res.body).to.have.property('message')
                        expect(res.body.message).to.eql('Invalid email address!')
                    })
            })

            it('should return status code 400 and message from missing password', () => {
                return request
                    .post('/v1/auth')
                    .send({ email: 'admin@test.com' })
                    .set('Content-Type', 'application/json')
                    .expect(400)
                    .then(res => {
                        expect(res.body).to.have.property('message', 'Required fields were not provided...')
                        expect(res.body).to.have.property('description', 'Authentication validation: password is required!')
                    })
            })

            it('should return status code 400 and message from missing email and password', () => {
                return request
                    .post('/v1/auth')
                    .send({})
                    .set('Content-Type', 'application/json')
                    .expect(400)
                    .then(res => {
                        expect(res.body).to.have.property('message', 'Required fields were not provided...')
                        expect(res.body).to.have.property('description',
                            'Authentication validation: email, password is required!')
                    })
            })
        })

        context('when the email or password is invalid', () => {
            it('should return status code 401 and message for invalid email ', () => {
                return request
                    .post('/v1/auth')
                    .send({ email: 'another@mail.com', password: 'password' })
                    .set('Content-Type', 'application/json')
                    .expect(401)
                    .then(res => {
                        expect(res.body).to.have.property('message',
                            'Authentication failed due to invalid authentication credentials.')
                    })

            })

            it('should return status code 401 and message for invalid password ', () => {
                return request
                    .post('/v1/auth')
                    .send({ email: 'admin@test.com', password: '123' })
                    .set('Content-Type', 'application/json')
                    .expect(401)
                    .then(res => {
                        expect(res.body).to.have.property('message')
                        expect(res.body.message).to.eql('Authentication failed due to invalid authentication credentials.')
                    })

            })
        })

        context('when user needs to change password', () => {
            it('should return status code 403 and message from change password required', async () => {
                user.change_password = true
                await updateUser(user.email, { change_password: true }).then()

                return request
                    .post('/v1/auth')
                    .send({ email: 'admin@test.com', password: 'password' })
                    .set('Content-Type', 'application/json')
                    .expect(403)
                    .then(res => {
                        expect(res.body).to.have.property('message', 'Change password is necessary.')
                        expect(res.body).to.have.property('description', 'To ensure information security, the user must change ' +
                            'the access password. To change it, access PATCH /v1/auth/password.')
                        expect(res.body).to.have.property('redirect_link', '/v1/auth/password')
                    })
            })
        })
    })

    describe('POST /v1/auth/forgot', () => {
        context('when reset the password', () => {
            it('should return status code 202 and message from send reset link from email', () => {
                request
                    .post('/v1/auth/forgot')
                    .send({ user_type: UserType.ADMIN, email: user.email, birth_date: user.birth_date })
                    .set('Content-Type', 'application/json')
                    .expect(202)
                    .then(res => {
                        expect(res.body).to.have.property('message',
                            `If a matching account is found, an email has been sent to ${user.email} to allow you to reset your `
                            + 'password.')
                    })
            })
        })
    })

    describe('POST /v1/auth/verify-email', () => {
        context('when verify the email', () => {
            it('should return status code 204 and no content', () => {
                request
                    .post('/v1/auth/verify-email')
                    .send({ email: user.email })
                    .set('Content-Type', 'application/json')
                    .expect(204)
                    .then(res => {
                        expect(res.body).to.eql({})
                    })
            })
        })
    })

    describe('PATCH /v1/auth/password', () => {
        context('when the password is updated', () => {
            it('should return status code 204 and no content', async () => {
                const token: string = await JwtRepositoryMock.generateResetPasswordToken(user, true)
                await updateUser(user.email, { change_password: false, reset_password_token: token }).then()
                return request
                    .patch('/v1/auth/password')
                    .send({ email: user.email, old_password: 'password', new_password: 'new@password' })
                    .set('Authorization', `Bearer ${token}`)
                    .set('Content-Type', 'application/json')
                    .expect(204)
                    .then(res => {
                        expect(res.body).to.eql({})
                    })
            })
        })

        context('when there are validation errors', () => {
            it('should return status code 400 and message from invalid email', () => {
                return request
                    .patch('/v1/auth/password')
                    .send({ email: 'invalid', old_password: 'password', new_password: 'new@password' })
                    .set('Content-Type', 'application/json')
                    .expect(400)
                    .then(res => {
                        expect(res.body).to.have.property('message', 'Invalid email address!')
                    })
            })

            it('should return status code 401 and message from invalid token', () => {
                return request
                    .patch('/v1/auth/password')
                    .send({ email: user.email, old_password: 'password', new_password: 'new@password' })
                    .set('Content-Type', 'application/json')
                    .set('Authorization', 'Bearer invalid')
                    .expect(401)
                    .then(res => {
                        expect(res.body).to.have.property('message', 'Invalid password reset token!')
                        expect(res.body).to.have.property('description', 'Token probably expired or already ' +
                            'used. You can only use the reset token once while it is within its validity period.')
                    })
            })
        })
    })
})

async function deleteAllUsers(doc) {
    return UserRepoModel.deleteMany(doc)
}

async function updateUser(email, doc) {
    return UserRepoModel.findOneAndUpdate({ email }, doc, { new: true })
}
