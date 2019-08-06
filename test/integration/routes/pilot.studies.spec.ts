import { expect } from 'chai'
import { PilotStudy } from '../../../src/application/domain/model/pilot.study'
import { DefaultEntityMock } from '../../mocks/models/default.entity.mock'
import { Container } from 'inversify'
import { DI } from '../../../src/di/di'
import { IConnectionDB } from '../../../src/infrastructure/port/connection.db.interface'
import { Identifier } from '../../../src/di/identifiers'
import { App } from '../../../src/app'
import { PilotStudyRepoModel } from '../../../src/infrastructure/database/schema/pilot.study.schema'
import { Strings } from '../../../src/utils/strings'
import { ObjectID } from 'bson'

const container: Container = DI.getInstance().getContainer()
const dbConnection: IConnectionDB = container.get(Identifier.MONGODB_CONNECTION)
const app: App = container.get(Identifier.APP)
const request = require('supertest')(app.getExpress())

describe('Routes: PilotStudies', () => {
    const pilot: PilotStudy = new PilotStudy().fromJSON(DefaultEntityMock.PILOT_STUDY_BASIC)

    before(async () => {
            try {
                await dbConnection.tryConnect(0, 500)
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
                        expect(res.body).to.have.property('description', 'Pilot Study validation: name, is_active, start, end ' +
                            'required!')
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
                        expect(res.body).to.have.property('message', 'Datetime: 02/02/2019, is not in valid ISO 8601 format.')
                        expect(res.body).to.have.property('description', 'Date must be in the format: yyyy-MM-dd\'T\'HH:mm:ssZ')
                    })
            })

            it('should return status code 400 and message from invalid health professionals', () => {
                const body: any = JSON.parse(JSON.stringify(DefaultEntityMock.PILOT_STUDY_BASIC))
                body.health_professionals = ['1a2b3c']

                return request
                    .post('/v1/pilotstudies')
                    .send(body)
                    .set('Content-Type', 'application/json')
                    .expect(400)
                    .then(res => {
                        expect(res.body).to.have.property('message', Strings.ERROR_MESSAGE.UUID_NOT_VALID_FORMAT)
                        expect(res.body).to.have.property('description', Strings.ERROR_MESSAGE.UUID_NOT_VALID_FORMAT_DESC)
                    })
            })

            it('should return status code 400 and message from not registered health professionals', () => {
                const body: any = JSON.parse(JSON.stringify(DefaultEntityMock.PILOT_STUDY_BASIC))
                const randomId: string = '5d1a5c972bb4b946d7b5158e'
                body.health_professionals = [randomId]

                return request
                    .post('/v1/pilotstudies')
                    .send(body)
                    .set('Content-Type', 'application/json')
                    .expect(400)
                    .then(res => {
                        expect(res.body).to.have.property('message', 'It is necessary for health professional to be registered' +
                            ' before proceeding.')
                        expect(res.body).to.have.property('description', 'The following IDs were verified without registration:' +
                            ` ${randomId}`)
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

            it('should return status code 400 and message from try update health professionals id list', () => {
                return request
                    .patch(`/v1/pilotstudies/${pilot.id}`)
                    .send({ health_professionals: [`${new ObjectID()}`] })
                    .set('Content-Type', 'application/json')
                    .expect(400)
                    .then(res => {
                        expect(res.body).to.have.property('message', Strings.ERROR_MESSAGE.PARAMETER_COULD_NOT_BE_UPDATED)
                        expect(res.body).to.have.property('description',
                            'A specific route to manage health_professionals already exists.')
                    })
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
            it('should return status code 400 and message from has association', async () => {
                const pilotNew: PilotStudy = new PilotStudy().fromJSON(DefaultEntityMock.PILOT_STUDY)
                pilotNew.name = 'Another Pilot'

                const result = await PilotStudyRepoModel.create(pilotNew.toJSON())
                pilotNew.id = result.id

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

async function deleteAllPilots(doc) {
    return await PilotStudyRepoModel.deleteMany(doc)
}
