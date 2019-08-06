import { expect } from 'chai'
import { Admin } from '../../../src/application/domain/model/admin'
import { UserRepoModel } from '../../../src/infrastructure/database/schema/user.schema'
import { Container } from 'inversify'
import { DI } from '../../../src/di/di'
import { IConnectionDB } from '../../../src/infrastructure/port/connection.db.interface'
import { Identifier } from '../../../src/di/identifiers'
import { App } from '../../../src/app'
import { DefaultEntityMock } from '../../mocks/models/default.entity.mock'
import { Strings } from '../../../src/utils/strings'
import { ObjectID } from 'bson'

const container: Container = DI.getInstance().getContainer()
const dbConnection: IConnectionDB = container.get(Identifier.MONGODB_CONNECTION)
const app: App = container.get(Identifier.APP)
const request = require('supertest')(app.getExpress())

describe('Routes: Admins', () => {
    const user: Admin = new Admin().fromJSON(DefaultEntityMock.ADMIN)

    before(async () => {
            try {
                await dbConnection.tryConnect(0, 500)
                await deleteAllUsers({})
            } catch (err) {
                throw new Error('Failure on Admins test: ' + err.message)
            }
        }
    )

    after(async () => {
        try {
            await deleteAllUsers({})
            await dbConnection.dispose()
        } catch (err) {
            throw new Error('Failure on Admins test: ' + err.message)
        }
    })

    describe('POST /v1/admins', () => {
        context('when the user is saved', () => {
            it('should return status code 201 and saved user', () => {
                return request
                    .post('/v1/admins')
                    .send(DefaultEntityMock.ADMIN)
                    .set('Content-Type', 'application/json')
                    .expect(201)
                    .then(res => {
                        expect(res.body).to.have.property('id')
                        expect(res.body).to.have.property('email', user.email)
                        expect(res.body).to.have.property('birth_date', user.birth_date)
                        expect(res.body).to.have.property('phone_number', user.phone_number)
                        expect(res.body).to.have.property('selected_pilot_study', user.selected_pilot_study)
                        expect(res.body).to.have.property('language', user.language)
                        user.id = res.body.id
                    })
            })
        })

        context('when there are a admin with same unique parameters', () => {
            it('should return status code 409 and info message from duplicate items', () => {
                return request
                    .post('/v1/admins')
                    .send(DefaultEntityMock.ADMIN)
                    .set('Content-Type', 'application/json')
                    .expect(409)
                    .then(res => {
                        expect(res.body).to.have.property('message', 'A user with this email already registered!')
                    })
            })
        })

        context('when there are validation errors', () => {
            it('should return status code 400 and message from missing parameters', () => {
                return request
                    .post('/v1/admins')
                    .send({})
                    .set('Content-Type', 'application/json')
                    .expect(400)
                    .then(res => {
                        expect(res.body).to.have.property('message', 'Required fields were not provided...')
                        expect(res.body).to.have.property('description', 'User validation: email, password, birth_date required!')
                    })
            })

            it('should return status code 400 and message from invalid parameters', () => {
                return request
                    .post('/v1/admins')
                    .send({ email: 'invalid' })
                    .set('Content-Type', 'application/json')
                    .expect(400)
                    .then(res => {
                        expect(res.body).to.have.property('message', 'Invalid email address!')
                    })
            })
        })
    })

    describe('GET /v1/admins/:admin_id', () => {
        context('when get a unique user', () => {
            it('should return status code 200 and the user', () => {
                return request
                    .get(`/v1/admins/${user.id}`)
                    .set('Content-Type', 'application/json')
                    .expect(200)
                    .then(res => {
                        expect(res.body).to.have.property('id', user.id)
                        expect(res.body).to.have.property('email', user.email)
                        expect(res.body).to.have.property('birth_date', user.birth_date)
                        expect(res.body).to.have.property('phone_number', user.phone_number)
                        expect(res.body).to.have.property('selected_pilot_study', user.selected_pilot_study)
                        expect(res.body).to.have.property('language', user.language)
                    })
            })
        })

        context('when the id is invalid', () => {
            it('should return status code 400 and message from invalid id', () => {
                return request
                    .get('/v1/admins/123')
                    .set('Content-Type', 'application/json')
                    .expect(400)
                    .then(res => {
                        expect(res.body).to.have.property('message', Strings.ERROR_MESSAGE.UUID_NOT_VALID_FORMAT)
                        expect(res.body).to.have.property('description', Strings.ERROR_MESSAGE.UUID_NOT_VALID_FORMAT_DESC)
                    })
            })
        })

        context('when the user is not found', () => {
            it('should return status code 404 and message from user not found', () => {
                return request
                    .get(`/v1/admins/${new ObjectID()}`)
                    .set('Content-Type', 'application/json')
                    .expect(404)
                    .then(res => {
                        expect(res.body).to.have.property('message', Strings.ADMIN.NOT_FOUND)
                        expect(res.body).to.have.property('description', Strings.ADMIN.NOT_FOUND_DESCRIPTION)
                    })
            })
        })
    })

    describe('PATCH /v1/admins/:admin_id', () => {
        context('when update a user', () => {
            it('should return status code 200 and updated user', () => {
                user.email = 'another@mail.com'
                return request
                    .patch(`/v1/admins/${user.id}`)
                    .send({ email: user.email })
                    .expect(200)
                    .then(res => {
                        expect(res.body).to.have.property('id', user.id)
                        expect(res.body).to.have.property('email', user.email)
                        expect(res.body).to.have.property('birth_date', user.birth_date)
                        expect(res.body).to.have.property('phone_number', user.phone_number)
                        expect(res.body).to.have.property('selected_pilot_study', user.selected_pilot_study)
                        expect(res.body).to.have.property('language', user.language)
                    })
            })
        })

        context('when id is invalid', () => {
            it('should return status code 400 and info message from invalid id', () => {
                return request
                    .patch('/v1/admins/123')
                    .send({ email: 'any@thing.com' })
                    .set('Content-Type', 'application/json')
                    .expect(400)
                    .then(res => {
                        expect(res.body).to.have.property('message', Strings.ERROR_MESSAGE.UUID_NOT_VALID_FORMAT)
                        expect(res.body).to.have.property('description', Strings.ERROR_MESSAGE.UUID_NOT_VALID_FORMAT_DESC)
                    })

            })
        })

        context('when there are validation errors', () => {
            it('should return status code 400 and message from invalid parameters', () => {
                return request
                    .patch(`/v1/admins/${user.id}`)
                    .send({ email: 'invalid' })
                    .set('Content-Type', 'application/json')
                    .expect(400)
                    .then(res => {
                        expect(res.body).to.have.property('message', 'Invalid email address!')
                    })
            })

            it('should return status code 400 and info message from try update password', () => {
                return request
                    .patch(`/v1/admins/${user.id}`)
                    .send({ password: user.password })
                    .set('Content-Type', 'application/json')
                    .expect(400)
                    .then(res => {
                        expect(res.body).to.have.property('message', 'This parameter could not be updated.')
                        expect(res.body).to.have.property('description', 'A specific route to update user password already ' +
                            `exists. Access: PATCH /v1/auth/password to update your password.`)
                    })
            })
        })

        context('when the user is not found', () => {
            it('should return status code 404 and message from user not found', () => {
                return request
                    .patch(`/v1/admins/${new ObjectID()}`)
                    .send({ email: 'any@thing.com' })
                    .set('Content-Type', 'application/json')
                    .expect(404)
                    .then(res => {
                        expect(res.body).to.have.property('message', Strings.ADMIN.NOT_FOUND)
                        expect(res.body).to.have.property('description', Strings.ADMIN.NOT_FOUND_DESCRIPTION)
                    })
            })
        })
    })

    describe('GET /v1/admins', () => {
        context('when get all admin users', () => {
            it('should return status code 200 and a list of users', () => {
                return request
                    .get('/v1/admins')
                    .set('Content-Type', 'application/json')
                    .expect(200)
                    .then(res => {
                        expect(res.body).to.be.an.instanceof(Array)
                        expect(res.body).to.have.lengthOf(1)
                        expect(res.body[0]).to.have.property('id', user.id)
                        expect(res.body[0]).to.have.property('email', user.email)
                        expect(res.body[0]).to.have.property('birth_date', user.birth_date)
                        expect(res.body[0]).to.have.property('phone_number', user.phone_number)
                        expect(res.body[0]).to.have.property('selected_pilot_study', user.selected_pilot_study)
                        expect(res.body[0]).to.have.property('language', user.language)
                    })
            })
        })

        context('when there no users', () => {
            it('should return status code 200 and empty array', async () => {
                await deleteAllUsers({}).then()

                return request
                    .get('/v1/admins')
                    .set('Content-Type', 'application/json')
                    .expect(200)
                    .then(res => {
                        expect(res.body).to.be.an.instanceof(Array)
                        expect(res.body).to.have.lengthOf(0)
                    })
            })
        })
    })
})

async function deleteAllUsers(doc) {
    return await UserRepoModel.deleteMany(doc)
}
