import { DIContainer } from '../../../src/di/di'
import { IConnectionDB } from '../../../src/infrastructure/port/connection.db.interface'
import { Identifier } from '../../../src/di/identifiers'
import { App } from '../../../src/app'
import { DefaultEntityMock } from '../../mocks/models/default.entity.mock'
import { UserRepoModel } from '../../../src/infrastructure/database/schema/user.schema'
import { HealthProfessional } from '../../../src/application/domain/model/health.professional'
import { expect } from 'chai'
import { ObjectID } from 'bson'
import { Strings } from '../../../src/utils/strings'
import { Default } from '../../../src/utils/default'

const dbConnection: IConnectionDB = DIContainer.get(Identifier.MONGODB_CONNECTION)
const app: App = DIContainer.get(Identifier.APP)
const request = require('supertest')(app.getExpress())

describe('Routes: HealthProfessionals', () => {
    const user: HealthProfessional = new HealthProfessional().fromJSON(DefaultEntityMock.HEALTH_PROFESSIONAL)

    before(async () => {
            try {
                await dbConnection.tryConnect(process.env.MONGODB_URI_TEST || Default.MONGODB_URI_TEST)
                await deleteAllUsers({})
            } catch (err) {
                throw new Error('Failure on HealthProfessionals test: ' + err.message)
            }
        }
    )

    after(async () => {
        try {
            await deleteAllUsers({})
            await dbConnection.dispose()
        } catch (err) {
            throw new Error('Failure on HealthProfessionals test: ' + err.message)
        }
    })

    describe('POST /v1/healthprofessionals', () => {
        context('when the user is saved', () => {
            it('should return status code 201 and saved user', () => {
                return request
                    .post('/v1/healthprofessionals')
                    .send(DefaultEntityMock.HEALTH_PROFESSIONAL)
                    .set('Content-Type', 'application/json')
                    .expect(201)
                    .then(res => {
                        expect(res.body).to.have.property('id')
                        expect(res.body).to.have.property('email', user.email)
                        expect(res.body).to.have.property('birth_date', user.birth_date)
                        expect(res.body).to.have.property('phone_number', user.phone_number)
                        expect(res.body).to.have.property('selected_pilot_study', user.selected_pilot_study)
                        expect(res.body).to.have.property('language', user.language)
                        expect(res.body).to.have.property('name', user.name)
                        expect(res.body).to.have.property('health_area', user.health_area)
                        user.id = res.body.id
                    })
            })
        })

        context('when there are a admin with same unique parameters', () => {
            it('should return status code 409 and info message from duplicate items', () => {
                return request
                    .post('/v1/healthprofessionals')
                    .send(DefaultEntityMock.HEALTH_PROFESSIONAL)
                    .set('Content-Type', 'application/json')
                    .expect(409)
                    .then(res => {
                        expect(res.body).to.have.property('message')
                        expect(res.body.message).to.eql('A user with this email already registered!')
                    })
            })
        })

        context('when there are validation errors', () => {
            it('should return status code 400 and message from missing parameters', () => {
                return request
                    .post('/v1/healthprofessionals')
                    .send({})
                    .set('Content-Type', 'application/json')
                    .expect(400)
                    .then(res => {
                        expect(res.body).to.have.property('message', 'Required fields were not provided...')
                        expect(res.body).to.have.property('description', 'Health Professional validation: ' +
                            'email, password, name, health_area, birth_date required!')
                    })
            })

            it('should return status code 400 and message from invalid email', () => {
                return request
                    .post('/v1/healthprofessionals')
                    .send({ email: 'invalid', name: user.name, password: user.password, health_area: user.health_area })
                    .set('Content-Type', 'application/json')
                    .expect(400)
                    .then(res => {
                        expect(res.body).to.have.property('message')
                        expect(res.body.message).to.eql('Invalid email address!')
                    })
            })
        })
    })

    describe('GET /v1/healthprofessionals/:healthprofessional_id', () => {
        context('when get a unique user', () => {
            it('should return status code 200 and the user', () => {
                return request
                    .get(`/v1/healthprofessionals/${user.id}`)
                    .set('Content-Type', 'application/json')
                    .expect(200)
                    .then(res => {
                        expect(res.body).to.have.property('id')
                        expect(res.body).to.have.property('email', user.email)
                        expect(res.body).to.have.property('birth_date', user.birth_date)
                        expect(res.body).to.have.property('phone_number', user.phone_number)
                        expect(res.body).to.have.property('selected_pilot_study', user.selected_pilot_study)
                        expect(res.body).to.have.property('language', user.language)
                        expect(res.body).to.have.property('name', user.name)
                        expect(res.body).to.have.property('health_area', user.health_area)
                    })
            })
        })

        context('when the id is invalid', () => {
            it('should return status code 400 and message from invalid id', () => {
                return request
                    .get('/v1/healthprofessionals/123')
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
                    .get(`/v1/healthprofessionals/${new ObjectID()}`)
                    .set('Content-Type', 'application/json')
                    .expect(404)
                    .then(res => {
                        expect(res.body).to.have.property('message', Strings.HEALTH_PROFESSIONAL.NOT_FOUND)
                        expect(res.body).to.have.property('description', Strings.HEALTH_PROFESSIONAL.NOT_FOUND_DESCRIPTION)
                    })
            })
        })
    })

    describe('PATCH /v1/healthprofessionals/:healthprofessional_id', () => {
        context('when update a user', () => {
            it('should return status code 200 and updated user', () => {
                return request
                    .patch(`/v1/healthprofessionals/${user.id}`)
                    .send({ name: user.name })
                    .expect(200)
                    .then(res => {
                        expect(res.body).to.have.property('id')
                        expect(res.body).to.have.property('email', user.email)
                        expect(res.body).to.have.property('birth_date', user.birth_date)
                        expect(res.body).to.have.property('phone_number', user.phone_number)
                        expect(res.body).to.have.property('selected_pilot_study', user.selected_pilot_study)
                        expect(res.body).to.have.property('language', user.language)
                        expect(res.body).to.have.property('name', user.name)
                        expect(res.body).to.have.property('health_area', user.health_area)
                    })
            })
        })

        context('when id is invalid', () => {
            it('should return status code 400 and info message from invalid id', () => {
                return request
                    .patch('/v1/healthprofessionals/123')
                    .send({ email: user.email })
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
                    .patch(`/v1/healthprofessionals/${user.id}`)
                    .send({ email: 'invalid' })
                    .set('Content-Type', 'application/json')
                    .expect(400)
                    .then(res => {
                        expect(res.body).to.have.property('message')
                        expect(res.body.message).to.eql('Invalid email address!')
                    })
            })

            it('should return status code 400 and info message from try update password', () => {
                return request
                    .patch(`/v1/healthprofessionals/${user.id}`)
                    .send({ password: user.password })
                    .set('Content-Type', 'application/json')
                    .expect(400)
                    .then(res => {
                        expect(res.body).to.have.property('message', 'This parameter could not be updated.')
                        expect(res.body).to.have.property('description', 'A specific route to update user password already ' +
                            'exists. Access: PATCH /v1/auth/password to update your password.')
                    })
            })
        })

        context('when the user is not found', () => {
            it('should return status code 404 and message from user not found', () => {
                return request
                    .patch(`/v1/healthprofessionals/${new ObjectID()}`)
                    .send({ email: 'any@mail.com' })
                    .set('Content-Type', 'application/json')
                    .expect(404)
                    .then(res => {
                        expect(res.body).to.have.property('message', Strings.HEALTH_PROFESSIONAL.NOT_FOUND)
                        expect(res.body).to.have.property('description', Strings.HEALTH_PROFESSIONAL.NOT_FOUND_DESCRIPTION)
                    })
            })
        })
    })

    describe('GET /v1/healthprofessionals', () => {
        context('when get all admin users', () => {
            it('should return status code 200 and a list of users', () => {
                return request
                    .get('/v1/healthprofessionals')
                    .set('Content-Type', 'application/json')
                    .expect(200)
                    .then(res => {
                        expect(res.body).to.be.an.instanceof(Array)
                        expect(res.body).to.have.lengthOf(1)
                        expect(res.body[0]).to.have.property('id')
                        expect(res.body[0]).to.have.property('email', user.email)
                        expect(res.body[0]).to.have.property('birth_date', user.birth_date)
                        expect(res.body[0]).to.have.property('phone_number', user.phone_number)
                        expect(res.body[0]).to.have.property('selected_pilot_study', user.selected_pilot_study)
                        expect(res.body[0]).to.have.property('language', user.language)
                        expect(res.body[0]).to.have.property('name', user.name)
                        expect(res.body[0]).to.have.property('health_area', user.health_area)
                    })
            })
        })

        context('when there no users', () => {
            it('should return status code 200 and empty array', async () => {
                await deleteAllUsers({}).then()

                return request
                    .get('/v1/healthprofessionals')
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
