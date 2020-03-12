import { expect } from 'chai'
import { PilotStudy } from '../../../src/application/domain/model/pilot.study'
import { DefaultEntityMock } from '../../mocks/models/default.entity.mock'
import { DIContainer } from '../../../src/di/di'
import { IConnectionDB } from '../../../src/infrastructure/port/connection.db.interface'
import { Identifier } from '../../../src/di/identifiers'
import { App } from '../../../src/app'
import { PilotStudyRepoModel } from '../../../src/infrastructure/database/schema/pilot.study.schema'
import { Strings } from '../../../src/utils/strings'
import { ObjectID } from 'bson'
import { UserRepoModel } from '../../../src/infrastructure/database/schema/user.schema'
import { HealthProfessional } from '../../../src/application/domain/model/health.professional'
import { Default } from '../../../src/utils/default'
import { DataTypes } from '../../../src/application/domain/utils/data.types'

const dbConnection: IConnectionDB = DIContainer.get(Identifier.MONGODB_CONNECTION)
const app: App = DIContainer.get(Identifier.APP)
const request = require('supertest')(app.getExpress())

describe('Routes: PilotStudies', () => {
    const pilot: PilotStudy = new PilotStudy().fromJSON(DefaultEntityMock.PILOT_STUDY_BASIC)
    const healthProf: HealthProfessional = new HealthProfessional().fromJSON(DefaultEntityMock.HEALTH_PROFESSIONAL)

    before(async () => {
            try {
                await dbConnection.tryConnect(process.env.MONGODB_URI_TEST || Default.MONGODB_URI_TEST)
                await deleteAllPilots({})
            } catch (err) {
                throw new Error('Failure on Auth test: ' + err.message)
            }
        }
    )

    after(async () => {
        try {
            await deleteAllPilots({})
            await dbConnection.dispose()
        } catch (err) {
            throw new Error('Failure on PilotStudies test: ' + err.message)
        }
    })

    describe('POST /v1/pilotstudies', () => {
        context('when save a new pilot study', () => {
            it('should return status code 201 and the saved pilot study', () => {
                return request
                    .post('/v1/pilotstudies')
                    .send(DefaultEntityMock.PILOT_STUDY_BASIC)
                    .set('Content-Type', 'application/json')
                    .expect(201)
                    .then(res => {
                        expect(res.body).to.have.property('id')
                        expect(res.body).to.have.property('name', pilot.name)
                        expect(res.body).to.have.property('is_active', pilot.is_active)
                        expect(res.body).to.have.property('start')
                        expect(res.body).to.have.property('end')
                        expect(res.body).to.have.property('total_health_professionals', 0)
                        expect(res.body).to.have.property('total_patients', 0)
                        expect(res.body).to.have.property('location', pilot.location)
                        expect(res.body).to.have.deep.property('data_types', pilot.data_types)
                        pilot.id = res.body.id
                    })
            })
        })

        context('when there are a pilot study with same unique parameters', () => {
            it('should return status code 409 and info message from duplicate items', () => {
                return request
                    .post('/v1/pilotstudies')
                    .send(pilot.toJSON())
                    .set('Content-Type', 'application/json')
                    .expect(409)
                    .then(res => {
                        expect(res.body).to.have.property('message', 'A registration with the same unique data already exists!')
                    })
            })
        })

        context('when there are validation errors', () => {
            it('should return status code 400 and message from missing parameters', () => {
                return request
                    .post('/v1/pilotstudies')
                    .send({})
                    .set('Content-Type', 'application/json')
                    .expect(400)
                    .then(res => {
                        expect(res.body).to.have.property('message', 'Required fields were not provided...')
                        expect(res.body).to.have.property('description', 'Pilot Study validation: name, ' +
                            'is_active, start, end, data_types required!')
                    })
            })

            it('should return status code 400 and message from invalid parameters', () => {
                const body: any = JSON.parse(JSON.stringify(DefaultEntityMock.PILOT_STUDY_BASIC))
                body.start = '02/02/2019'
                body.end = '02/03/2019'

                return request
                    .post('/v1/pilotstudies')
                    .send(body)
                    .set('Content-Type', 'application/json')
                    .expect(400)
                    .then(res => {
                        expect(res.body).to.have.property('message', Strings.ERROR_MESSAGE.INVALID_DATETIME_FORMAT
                            .replace('{0}', '02/02/2019'))
                        expect(res.body).to.have.property('description', Strings.ERROR_MESSAGE.INVALID_DATETIME_FORMAT_DESC)
                    })
            })

            it('should return status code 400 and message from empty data_types parameter', () => {
                const body: any = JSON.parse(JSON.stringify(DefaultEntityMock.PILOT_STUDY_BASIC))
                body.data_types = []

                return request
                    .post('/v1/pilotstudies')
                    .send(body)
                    .set('Content-Type', 'application/json')
                    .expect(400)
                    .then(res => {
                        expect(res.body).to.have.property('message', Strings.ERROR_MESSAGE.INVALID_FIELDS)
                        expect(res.body).to.have.property('description',
                            Strings.ERROR_MESSAGE.INVALID_DATA_TYPES_DESC)
                    })
            })

            it('should return status code 400 and message from invalid data_types parameter', () => {
                const body: any = JSON.parse(JSON.stringify(DefaultEntityMock.PILOT_STUDY_BASIC))
                body.data_types = [
                    'weight',
                    'body_temperature',
                    'blood_glucose',
                    'invalid_type',
                    'height',
                    'waist_circumference',
                    'other_invalid_type',
                    'sleep',
                    'steps',
                    'calories',
                    'distance',
                    'heart_rate',
                    'minutes_active',
                    'quest_nutritional',
                    'last_invalid_type'
                ]

                return request
                    .post('/v1/pilotstudies')
                    .send(body)
                    .set('Content-Type', 'application/json')
                    .expect(400)
                    .then(res => {
                        expect(res.body).to.have.property('message', Strings.ENUM_VALIDATOR.NOT_MAPPED
                            .replace('{0}', 'data_types: invalid_type, other_invalid_type, ' +
                                'last_invalid_type'))
                        expect(res.body).to.have.property('description', Strings.ENUM_VALIDATOR.NOT_MAPPED_DESC
                            .replace('{0}', Object.values(DataTypes).join(', ').concat('.')))
                    })
            })
        })
    })

    describe('GET /v1/pilotstudies/:pilotstudy_id', () => {
        context('when get a unique pilot study', () => {
            it('should return status code 200 and the pilot study', () => {
                return request
                    .get(`/v1/pilotstudies/${pilot.id}`)
                    .set('Content-Type', 'application/json')
                    .expect(200)
                    .then(res => {
                        expect(res.body).to.have.property('id', pilot.id)
                        expect(res.body).to.have.property('name', pilot.name)
                        expect(res.body).to.have.property('is_active', pilot.is_active)
                        expect(res.body).to.have.property('start')
                        expect(res.body).to.have.property('end')
                        expect(res.body).to.have.property('total_health_professionals', 0)
                        expect(res.body).to.have.property('total_patients', 0)
                        expect(res.body).to.have.property('location', pilot.location)
                    })
            })
        })

        context('when there are validation errors', () => {
            it('should return status code 400 and message from invalid id', () => {
                return request
                    .get('/v1/pilotstudies/123')
                    .set('Content-Type', 'application/json')
                    .expect(400)
                    .then(res => {
                        expect(res.body).to.have.property('message', Strings.ERROR_MESSAGE.UUID_NOT_VALID_FORMAT)
                        expect(res.body).to.have.property('description', Strings.ERROR_MESSAGE.UUID_NOT_VALID_FORMAT_DESC)
                    })
            })
        })

        context('when the pilot study is not founded', () => {
            it('should return status code 404 and message from pilot study not found', () => {
                return request
                    .get(`/v1/pilotstudies/${new ObjectID()}`)
                    .set('Content-Type', 'application/json')
                    .expect(404)
                    .then(res => {
                        expect(res.body).to.have.property('message', Strings.PILOT_STUDY.NOT_FOUND)
                        expect(res.body).to.have.property('description', Strings.PILOT_STUDY.NOT_FOUND_DESCRIPTION)
                    })
            })
        })
    })

    describe('PATCH /v1/pilotstudies/:pilotstudy_id', () => {
        context('when update a pilot study', () => {
            it('should return status code 200 and updated pilot study', () => {
                return request
                    .patch(`/v1/pilotstudies/${pilot.id}`)
                    .send({})
                    .set('Content-Type', 'application/json')
                    .expect(200)
                    .then(res => {
                        expect(res.body).to.have.property('id', pilot.id)
                        expect(res.body).to.have.property('name', pilot.name)
                        expect(res.body).to.have.property('is_active', pilot.is_active)
                        expect(res.body).to.have.property('start')
                        expect(res.body).to.have.property('end')
                        expect(res.body).to.have.property('total_health_professionals', 0)
                        expect(res.body).to.have.property('total_patients', 0)
                        expect(res.body).to.have.property('location', pilot.location)
                        expect(res.body).to.have.deep.property('data_types', pilot.data_types)
                    })
            })
        })

        context('when there are validation errors', () => {
            it('should return status code 400 and message from invalid id', () => {
                return request
                    .patch('/v1/pilotstudies/123')
                    .send(pilot.toJSON())
                    .set('Content-Type', 'application/json')
                    .expect(400)
                    .then(res => {
                        expect(res.body).to.have.property('message', Strings.ERROR_MESSAGE.UUID_NOT_VALID_FORMAT)
                        expect(res.body).to.have.property('description', Strings.ERROR_MESSAGE.UUID_NOT_VALID_FORMAT_DESC)
                    })
            })
        })

        it('should return status code 400 and message from empty data_types parameter', () => {
            const body: any = JSON.parse(JSON.stringify(DefaultEntityMock.PILOT_STUDY_BASIC))
            body.data_types = []

            return request
                .patch(`/v1/pilotstudies/${pilot.id}`)
                .send(body)
                .set('Content-Type', 'application/json')
                .expect(400)
                .then(res => {
                    expect(res.body).to.have.property('message', Strings.ERROR_MESSAGE.INVALID_FIELDS)
                    expect(res.body).to.have.property('description',
                        Strings.ERROR_MESSAGE.INVALID_DATA_TYPES_DESC)
                })
        })

        it('should return status code 400 and message from invalid data_types parameter', () => {
            const body: any = JSON.parse(JSON.stringify(DefaultEntityMock.PILOT_STUDY_BASIC))
            body.data_types = [
                'weight',
                'body_temperature',
                'blood_glucose',
                'invalid_type',
                'height',
                'waist_circumference',
                'other_invalid_type',
                'sleep',
                'steps',
                'calories',
                'distance',
                'heart_rate',
                'minutes_active',
                'quest_nutritional',
                'last_invalid_type'
            ]

            return request
                .patch(`/v1/pilotstudies/${pilot.id}`)
                .send(body)
                .set('Content-Type', 'application/json')
                .expect(400)
                .then(res => {
                    console.log('ERR: ', res.body)
                    expect(res.body).to.have.property('message', Strings.ENUM_VALIDATOR.NOT_MAPPED
                        .replace('{0}', 'data_types: invalid_type, other_invalid_type, ' +
                            'last_invalid_type'))
                    expect(res.body).to.have.property('description', Strings.ENUM_VALIDATOR.NOT_MAPPED_DESC
                        .replace('{0}', Object.values(DataTypes).join(', ').concat('.')))
                })
        })

        context('when the pilot study is not founded', () => {
            it('should return status code 404 and message from pilot not found', () => {
                return request
                    .patch(`/v1/pilotstudies/${new ObjectID()}`)
                    .send({})
                    .set('Content-Type', 'application/json')
                    .expect(404)
                    .then(res => {
                        expect(res.body).to.have.property('message', Strings.PILOT_STUDY.NOT_FOUND)
                        expect(res.body).to.have.property('description', Strings.PILOT_STUDY.NOT_FOUND_DESCRIPTION)
                    })
            })
        })
    })

    describe('DELETE /v1/pilotstudies/:pilotstudy_id', () => {
        context('when want delete a pilot study', () => {
            it('should return status code 204 and no content', async () => {
                const pilotNew: PilotStudy = new PilotStudy().fromJSON(DefaultEntityMock.PILOT_STUDY_BASIC)
                pilotNew.name = 'Another Pilot'

                const result = await PilotStudyRepoModel.create(pilotNew.toJSON())
                pilotNew.id = result.id

                return request
                    .delete(`/v1/pilotstudies/${pilotNew.id}`)
                    .set('Content-Type', 'application/json')
                    .expect(204)
                    .then(res => {
                        expect(res.body).to.eql({})
                    })
            })
        })

        context('when the pilot study has association with users', () => {
            let resultHealthProf
            const pilotNew: PilotStudy = new PilotStudy().fromJSON(DefaultEntityMock.PILOT_STUDY)

            before(async () => {
                try {
                    await deleteAllUsers({})

                    resultHealthProf = await createUser({
                        name: healthProf.name,
                        email: healthProf.email,
                        password: healthProf.password,
                        health_area: healthProf.health_area,
                        phone_number: healthProf.phone_number,
                        birth_date: healthProf.birth_date,
                        language: healthProf.language
                    })

                    pilotNew.name = 'Another Pilot'

                    const result = await PilotStudyRepoModel.create({
                        name: pilotNew.name,
                        is_active: pilotNew.is_active,
                        start: pilotNew.start,
                        end: pilotNew.end,
                        total_health_professionals: 1,
                        location: pilotNew.location,
                        health_professionals: [resultHealthProf.id]
                    })
                    pilotNew.id = result.id
                } catch (err) {
                    throw new Error('Failure on PilotStudies test: ' + err.message)
                }
            })
            it('should return status code 400 and message from has association', async () => {
                return request
                    .delete(`/v1/pilotstudies/${pilotNew.id}`)
                    .set('Content-Type', 'application/json')
                    .expect(400)
                    .then(async res => {
                        expect(res.body).to.have.property('message', Strings.PILOT_STUDY.HAS_ASSOCIATION)
                        await PilotStudyRepoModel.findOneAndDelete({ _id: pilotNew.id })
                    })
            })
        })

        context('when there are validation errors', () => {
            it('should return status code 400 and message from invalid id', () => {
                return request
                    .delete('/v1/pilotstudies/123')
                    .set('Content-Type', 'application/json')
                    .expect(400)
                    .then(res => {
                        expect(res.body).to.have.property('message', Strings.ERROR_MESSAGE.UUID_NOT_VALID_FORMAT)
                        expect(res.body).to.have.property('description', Strings.ERROR_MESSAGE.UUID_NOT_VALID_FORMAT_DESC)
                    })
            })
        })

        context('when the pilot study does not exists', () => {
            it('should return status code 204 and no content', () => {
                it('should return status code 204 and no content', () => {
                    return request
                        .delete(`/v1/pilotstudies/${new ObjectID()}`)
                        .set('Content-Type', 'application/json')
                        .expect(204)
                        .then(res => {
                            expect(res.body).to.eql({})
                        })
                })
            })
        })
    })

    describe('GET /v1/pilotstudies', () => {
        context('when get all pilot studies', () => {
            it('should return status code 200 and a list of pilot studies', () => {
                return request
                    .get('/v1/pilotstudies')
                    .set('Content-Type', 'application/json')
                    .expect(200)
                    .then(res => {
                        expect(res.body).to.be.an.instanceof(Array)
                        expect(res.body).to.have.lengthOf(1)
                        expect(res.body[0]).to.have.property('id', pilot.id)
                        expect(res.body[0]).to.have.property('name', pilot.name)
                        expect(res.body[0]).to.have.property('is_active', pilot.is_active)
                        expect(res.body[0]).to.have.property('start')
                        expect(res.body[0]).to.have.property('end')
                        expect(res.body[0]).to.have.property('total_health_professionals', 0)
                        expect(res.body[0]).to.have.property('total_patients', 0)
                        expect(res.body[0]).to.have.property('location', pilot.location)
                    })
            })
        })

        context('when there no are pilot studies', () => {
            it('should return status code 200 and a empty list', async () => {
                await deleteAllPilots({}).then()
                return request
                    .get('/v1/pilotstudies')
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

async function createUser(item) {
    return UserRepoModel.create(item)
}

async function deleteAllPilots(doc) {
    return await PilotStudyRepoModel.deleteMany(doc)
}

async function deleteAllUsers(doc) {
    return await UserRepoModel.deleteMany(doc)
}
