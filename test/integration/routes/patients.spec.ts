import { expect } from 'chai'
import { UserRepoModel } from '../../../src/infrastructure/database/schema/user.schema'
import { IConnectionDB } from '../../../src/infrastructure/port/connection.db.interface'
import { Identifier } from '../../../src/di/identifiers'
import { App } from '../../../src/app'
import { DefaultEntityMock } from '../../mocks/models/default.entity.mock'
import { Patient } from '../../../src/application/domain/model/patient'
import { Strings } from '../../../src/utils/strings'
import { ObjectID } from 'bson'
import { DIContainer } from '../../../src/di/di'
import { AccessStatusTypes } from '../../../src/application/domain/utils/access.status.types'
import { Default } from '../../../src/utils/default'

const dbConnection: IConnectionDB = DIContainer.get(Identifier.MONGODB_CONNECTION)
const app: App = DIContainer.get(Identifier.APP)
const request = require('supertest')(app.getExpress())

describe('Routes: Patients', () => {
    const user: Patient = new Patient().fromJSON(DefaultEntityMock.PATIENT)

    before(async () => {
            try {
                await dbConnection.tryConnect(process.env.MONGODB_URI_TEST || Default.MONGODB_URI_TEST)
                await deleteAllUsers({})
            } catch (err) {
                throw new Error('Failure on Patients test: ' + err.message)
            }
        }
    )

    after(async () => {
        try {
            await deleteAllUsers({})
            await dbConnection.dispose()
        } catch (err) {
            throw new Error('Failure on Patients test: ' + err.message)
        }
    })

    describe('POST /v1/patients', () => {
        context('when the user is saved', () => {
            it('should return status code 201 and saved user', () => {
                return request
                    .post('/v1/patients')
                    .send(DefaultEntityMock.PATIENT)
                    .set('Content-Type', 'application/json')
                    .expect(201)
                    .then(res => {
                        expect(res.body).to.have.property('id')
                        expect(res.body).to.have.property('created_at')
                        expect(res.body).to.have.property('email', user.email)
                        expect(res.body).to.have.property('birth_date', user.birth_date)
                        expect(res.body).to.have.property('phone_number', user.phone_number)
                        expect(res.body).to.have.property('selected_pilot_study', user.selected_pilot_study)
                        expect(res.body).to.have.property('language', user.language)
                        expect(res.body).to.have.property('name', user.name)
                        expect(res.body).to.have.property('gender', user.gender)
                        expect(res.body).to.have.property('address', user.address)
                        expect(res.body).to.have.property('external_services')
                        expect(res.body.external_services).to.have.property('fitbit_status', AccessStatusTypes.NONE)
                        expect(res.body.external_services).to.have.property('fitbit_last_sync', '')
                        user.id = res.body.id
                    })
            })
        })

        context('when there are a admin with same unique parameters', () => {
            it('should return status code 409 and info message from duplicate items', () => {
                return request
                    .post('/v1/patients')
                    .send(DefaultEntityMock.PATIENT)
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
                    .post('/v1/patients')
                    .send({})
                    .set('Content-Type', 'application/json')
                    .expect(400)
                    .then(res => {
                        expect(res.body).to.have.property('message', 'Required fields were not provided...')
                        expect(res.body).to.have.property('description', 'Patient validation: name, gender, ' +
                            'birth_date is required!')
                    })
            })

            it('should return status code 400 and message from invalid parameters', () => {
                return request
                    .post('/v1/patients')
                    .send({ email: 'invalid' })
                    .set('Content-Type', 'application/json')
                    .expect(400)
                    .then(res => {
                        expect(res.body).to.have.property('message')
                        expect(res.body.message).to.eql('Invalid email address!')
                    })
            })

            it('should return status code 400 and invalid birth date message', () => {
                const body: any = JSON.parse(JSON.stringify(DefaultEntityMock.PATIENT))
                body.birth_date = '2020-04-011'

                return request
                    .post('/v1/patients')
                    .send(body)
                    .set('Content-Type', 'application/json')
                    .expect(400)
                    .then(res => {
                        expect(res.body.message).to.eql(Strings.ERROR_MESSAGE.INVALID_DATE_FORMAT
                            .replace('{0}', body.birth_date))
                        expect(res.body.description).to.eql(Strings.ERROR_MESSAGE.INVALID_DATE_FORMAT_DESC)
                    })
            })

            it('should return status code 400 and invalid birth date message (invalid day)', () => {
                const body: any = JSON.parse(JSON.stringify(DefaultEntityMock.PATIENT))
                body.birth_date = '2020-04-32'

                return request
                    .post('/v1/patients')
                    .send(body)
                    .set('Content-Type', 'application/json')
                    .expect(400)
                    .then(res => {
                        expect(res.body.message).to.eql(Strings.ERROR_MESSAGE.INVALID_DATE_FORMAT
                            .replace('{0}', body.birth_date))
                    })
            })

            it('should return status code 400 and invalid birth date message (invalid year)', () => {
                const body: any = JSON.parse(JSON.stringify(DefaultEntityMock.PATIENT))
                body.birth_date = '1677-04-01'

                return request
                    .post('/v1/patients')
                    .send(body)
                    .set('Content-Type', 'application/json')
                    .expect(400)
                    .then(res => {
                        expect(res.body.message).to.eql(Strings.ERROR_MESSAGE.YEAR_NOT_ALLOWED
                            .replace('{0}', body.birth_date))
                    })
            })
        })
    })

    describe('GET /v1/patients/:patient_id', () => {
        context('when get a unique user', () => {
            it('should return status code 200 and the user', () => {
                return request
                    .get(`/v1/patients/${user.id}`)
                    .set('Content-Type', 'application/json')
                    .expect(200)
                    .then(res => {
                        expect(res.body).to.have.property('id', user.id)
                        expect(res.body).to.have.property('created_at')
                        expect(res.body).to.have.property('email', user.email)
                        expect(res.body).to.have.property('birth_date', user.birth_date)
                        expect(res.body).to.have.property('phone_number', user.phone_number)
                        expect(res.body).to.have.property('selected_pilot_study', user.selected_pilot_study)
                        expect(res.body).to.have.property('language', user.language)
                        expect(res.body).to.have.property('name', user.name)
                        expect(res.body).to.have.property('gender', user.gender)
                        expect(res.body).to.have.property('address', user.address)
                    })
            })
        })

        context('when the id is invalid', () => {
            it('should return status code 400 and message from invalid id', () => {
                return request
                    .get('/v1/patients/123')
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
                    .get(`/v1/patients/${new ObjectID()}`)
                    .set('Content-Type', 'application/json')
                    .expect(404)
                    .then(res => {
                        expect(res.body).to.have.property('message', Strings.PATIENT.NOT_FOUND)
                        expect(res.body).to.have.property('description', Strings.PATIENT.NOT_FOUND_DESCRIPTION)
                    })
            })
        })
    })

    describe('PATCH /v1/patients/:patient_id', () => {
        context('when update a user', () => {
            it('should return status code 200 and updated user', () => {
                return request
                    .patch(`/v1/patients/${user.id}`)
                    .send({ name: user.name })
                    .set('Content-Type', 'application/json')
                    .expect(200)
                    .then(res => {
                        expect(res.body).to.have.property('id', user.id)
                        expect(res.body).to.have.property('created_at')
                        expect(res.body).to.have.property('email', user.email)
                        expect(res.body).to.have.property('birth_date', user.birth_date)
                        expect(res.body).to.have.property('phone_number', user.phone_number)
                        expect(res.body).to.have.property('selected_pilot_study', user.selected_pilot_study)
                        expect(res.body).to.have.property('language', user.language)
                        expect(res.body).to.have.property('name', user.name)
                        expect(res.body).to.have.property('gender', user.gender)
                        expect(res.body).to.have.property('address', user.address)
                    })
            })
        })

        context('when id is invalid', () => {
            it('should return status code 400 and info message from invalid id', () => {
                return request
                    .patch('/v1/patients/123')
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
                    .patch(`/v1/patients/${user.id}`)
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
                    .patch(`/v1/patients/${user.id}`)
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
                    .patch(`/v1/patients/${new ObjectID()}`)
                    .send({ email: 'any@mail.com' })
                    .set('Content-Type', 'application/json')
                    .expect(404)
                    .then(res => {
                        expect(res.body).to.have.property('message', Strings.PATIENT.NOT_FOUND)
                        expect(res.body).to.have.property('description', Strings.PATIENT.NOT_FOUND_DESCRIPTION)
                    })
            })
        })
    })

    describe('GET /v1/patients', () => {
        context('when get a unique user', () => {
            it('should return status code 200 and the user', () => {
                return request
                    .get('/v1/patients')
                    .set('Content-Type', 'application/json')
                    .expect(200)
                    .then(res => {
                        expect(res.body).to.be.an.instanceof(Array)
                        expect(res.body).to.have.lengthOf(1)
                        expect(res.body[0]).to.have.property('id', user.id)
                        expect(res.body[0]).to.have.property('created_at')
                        expect(res.body[0]).to.have.property('email', user.email)
                        expect(res.body[0]).to.have.property('birth_date', user.birth_date)
                        expect(res.body[0]).to.have.property('phone_number', user.phone_number)
                        expect(res.body[0]).to.have.property('selected_pilot_study', user.selected_pilot_study)
                        expect(res.body[0]).to.have.property('language', user.language)
                        expect(res.body[0]).to.have.property('name', user.name)
                        expect(res.body[0]).to.have.property('gender', user.gender)
                        expect(res.body[0]).to.have.property('address', user.address)
                    })
            })
        })

        context('when there are no users', () => {
            it('should return status code 200 and a empty list', async () => {
                await deleteAllUsers({}).then()
                return request
                    .get(`/v1/patients`)
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
