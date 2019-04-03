import { expect } from 'chai'
import { PilotStudy } from '../../../src/application/domain/model/pilot.study'
import { DefaultEntityMock } from '../../mocks/models/default.entity.mock'
import { HealthProfessional } from '../../../src/application/domain/model/health.professional'
import { Container } from 'inversify'
import { DI } from '../../../src/di/di'
import { IConnectionDB } from '../../../src/infrastructure/port/connection.db.interface'
import { Identifier } from '../../../src/di/identifiers'
import { IHealthProfessionalRepository } from '../../../src/application/port/health.professional.repository.interface'
import { App } from '../../../src/app'
import { UserRepoModel } from '../../../src/infrastructure/database/schema/user.schema'
import { PilotStudyRepoModel } from '../../../src/infrastructure/database/schema/pilot.study.schema'
import { Strings } from '../../../src/utils/strings'
import { ObjectID } from 'bson'

const container: Container = DI.getInstance().getContainer()
const dbConnection: IConnectionDB = container.get(Identifier.MONGODB_CONNECTION)
const healthRepo: IHealthProfessionalRepository = container.get(Identifier.HEALTH_PROFESSIONAL_REPOSITORY)
const app: App = container.get(Identifier.APP)
const request = require('supertest')(app.getExpress())

describe('Routes: PilotStudies', () => {
    const pilot: PilotStudy = new PilotStudy().fromJSON(DefaultEntityMock.PILOT_STUDY)
    const user: HealthProfessional = new HealthProfessional().fromJSON(DefaultEntityMock.HEALTH_PROFESSIONAL)

    before(async () => {
            try {
                await dbConnection.tryConnect(0, 500)
                await deleteAllPilots({})
                await deleteAllUsers({})
                const healthNew = await healthRepo.create(user)
                user.id = healthNew.id
                pilot.health_professionals_id = [user]
            } catch (err) {
                throw new Error('Failure on Auth test: ' + err.message)
            }
        }
    )

    after(async () => {
        try {
            await deleteAllPilots({})
            await deleteAllUsers({})
            await dbConnection.dispose()
        } catch (err) {
            throw new Error('Failure on Auth test: ' + err.message)
        }
    })

    describe('POST /pilotstudies', () => {
        context('when save a new pilot study', () => {
            it('should return status code 201 and the saved pilot study', () => {
                return request
                    .post('/pilotstudies')
                    .send(pilot.toJSON())
                    .set('Content-Type', 'application/json')
                    .expect(201)
                    .then(res => {
                        expect(res.body).to.have.property('id')
                        expect(res.body).to.have.property('name')
                        expect(res.body.name).to.eql(pilot.name)
                        expect(res.body).to.have.property('is_active')
                        expect(res.body.is_active).to.eql(pilot.is_active)
                        expect(res.body).to.have.property('start')
                        expect(res.body).to.have.property('end')
                        expect(res.body).to.have.property('health_professionals_id')
                        expect(res.body.health_professionals_id).to.have.lengthOf(1)
                        expect(res.body.health_professionals_id[0]).to.eql(user.id)
                        pilot.id = res.body.id
                    })
            })
        })

        context('when there are a pilot study with same unique parameters', () => {
            it('should return status code 409 and info message from duplicate items', () => {
                return request
                    .post('/pilotstudies')
                    .send(pilot.toJSON())
                    .set('Content-Type', 'application/json')
                    .expect(409)
                    .then(res => {
                        expect(res.body).to.have.property('message')
                        expect(res.body.message).to.eql('A registration with the same unique data already exists!')
                    })
            })
        })

        context('when there are validation errors', () => {
            const body = pilot.toJSON()

            it('should return status code 400 and error for does not pass name', () => {
                body.name = undefined

                return request
                    .post('/pilotstudies')
                    .send(body)
                    .set('Content-Type', 'application/json')
                    .expect(400)
                    .then(res => {
                        expect(res.body).to.have.property('message')
                        expect(res.body.message).to.eql('Required fields were not provided...')
                        expect(res.body).to.have.property('description')
                        expect(res.body.description).to.eql('Pilot Study validation: name required!')
                        body.name = DefaultEntityMock.PILOT_STUDY.name
                    })
            })

            it('should return status code 400 and error for does not pass is_active', () => {
                body.is_active = undefined

                return request
                    .post('/pilotstudies')
                    .send(body)
                    .set('Content-Type', 'application/json')
                    .expect(400)
                    .then(res => {
                        expect(res.body).to.have.property('message')
                        expect(res.body.message).to.eql('Required fields were not provided...')
                        expect(res.body).to.have.property('description')
                        expect(res.body.description).to.eql('Pilot Study validation: is_active required!')
                        body.is_active = DefaultEntityMock.PILOT_STUDY.is_active
                    })
            })

            it('should return status code 400 and error for does not pass start', () => {
                body.start = undefined

                return request
                    .post('/pilotstudies')
                    .send(body)
                    .set('Content-Type', 'application/json')
                    .expect(400)
                    .then(res => {
                        expect(res.body).to.have.property('message')
                        expect(res.body.message).to.eql('Required fields were not provided...')
                        expect(res.body).to.have.property('description')
                        expect(res.body.description).to.eql('Pilot Study validation: start required!')
                        body.start = DefaultEntityMock.PILOT_STUDY.start
                    })
            })

            it('should return status code 400 and error for does not pass end', () => {
                body.end = undefined

                return request
                    .post('/pilotstudies')
                    .send(body)
                    .set('Content-Type', 'application/json')
                    .expect(400)
                    .then(res => {
                        expect(res.body).to.have.property('message')
                        expect(res.body.message).to.eql('Required fields were not provided...')
                        expect(res.body).to.have.property('description')
                        expect(res.body.description).to.eql('Pilot Study validation: end required!')
                        body.end = DefaultEntityMock.PILOT_STUDY.end
                    })
            })

            it('should return status code 400 and error for does not pass health_professionals_id', () => {
                delete body.health_professionals_id

                return request
                    .post('/pilotstudies')
                    .send(body)
                    .set('Content-Type', 'application/json')
                    .expect(400)
                    .then(res => {
                        expect(res.body).to.have.property('message')
                        expect(res.body.message).to.eql('Required fields were not provided...')
                        expect(res.body).to.have.property('description')
                        expect(res.body.description).to.eql('Pilot Study validation: Collection with health_professional IDs ' +
                            'required!')
                        body.health_professionals_id = [user.id]
                    })
            })

            it('should return status code 400 and error for does pass a health professional without id', () => {
                body.health_professionals_id = ['']

                return request
                    .post('/pilotstudies')
                    .send(body)
                    .set('Content-Type', 'application/json')
                    .expect(400)
                    .then(res => {
                        expect(res.body).to.have.property('message')
                        expect(res.body.message).to.eql('Required fields were not provided...')
                        expect(res.body).to.have.property('description')
                        expect(res.body.description).to.eql('Pilot Study validation: Collection with health_professional IDs ' +
                            '(ID cannot be empty) required!')
                        body.health_professionals_id = [user.id]
                    })
            })

            it('should return status code 400 and error for does pass a health professional that does not exists', () => {
                const randomId = new ObjectID()
                body.health_professionals_id = [new HealthProfessional().fromJSON({ id: randomId })]

                return request
                    .post('/pilotstudies')
                    .send(body)
                    .set('Content-Type', 'application/json')
                    .expect(400)
                    .then(res => {
                        expect(res.body).to.have.property('message')
                        expect(res.body.message).to.eql('It is necessary for health professional to be registered' +
                            ' before proceeding.')
                        expect(res.body).to.have.property('description')
                        expect(res.body.description).to.eql(`The following IDs were verified without registration: ${randomId}`)
                        body.health_professionals_id = [user.id]
                    })
            })
        })
    })

    describe('GET /pilotstudies/:pilotstudy_id', () => {
        context('when get a unique pilot study', () => {
            it('should return status code 200 and the pilot study', () => {
                return request
                    .get(`/pilotstudies/${pilot.id}`)
                    .set('Content-Type', 'application/json')
                    .expect(200)
                    .then(res => {
                        expect(res.body).to.have.property('id')
                        expect(res.body.id).to.eql(pilot.id)
                        expect(res.body).to.have.property('name')
                        expect(res.body.name).to.eql(pilot.name)
                        expect(res.body).to.have.property('is_active')
                        expect(res.body.is_active).to.eql(pilot.is_active)
                        expect(res.body).to.have.property('start')
                        expect(res.body).to.have.property('end')
                        expect(res.body).to.have.property('health_professionals_id')
                        expect(res.body.health_professionals_id).to.have.lengthOf(1)
                        expect(res.body.health_professionals_id[0]).to.eql(user.id)
                    })
            })
        })

        context('when there are validation errors', () => {
            it('should return status code 400 and message from invalid id', () => {
                return request
                    .get('/pilotstudies/123')
                    .set('Content-Type', 'application/json')
                    .expect(400)
                    .then(res => {
                        expect(res.body).to.have.property('message')
                        expect(res.body.message).to.eql(Strings.ERROR_MESSAGE.UUID_NOT_VALID_FORMAT)
                        expect(res.body).to.have.property('description')
                        expect(res.body.description).to.eql(Strings.ERROR_MESSAGE.UUID_NOT_VALID_FORMAT_DESC)
                    })
            })
        })

        context('when the pilot study is not founded', () => {
            it('should return status code 404 and message from pilot study not found', () => {
                return request
                    .get(`/pilotstudies/${new ObjectID()}`)
                    .set('Content-Type', 'application/json')
                    .expect(404)
                    .then(res => {
                        expect(res.body).to.have.property('message')
                        expect(res.body.message).to.eql(Strings.PILOT_STUDY.NOT_FOUND)
                        expect(res.body).to.have.property('description')
                        expect(res.body.description).to.eql(Strings.PILOT_STUDY.NOT_FOUND_DESCRIPTION)
                    })
            })
        })
    })

    describe('PATCH /pilotstudies/:pilotstudy_id', () => {
        const body = pilot.toJSON()
        delete body.id

        context('when update a pilot study', () => {
            it('should return status code 200 and updated pilot study', () => {
                delete body.health_professionals_id

                return request
                    .patch(`/pilotstudies/${pilot.id}`)
                    .send(body)
                    .set('Content-Type', 'application/json')
                    .expect(200)
                    .then(res => {
                        expect(res.body).to.have.property('id')
                        expect(res.body.id).to.eql(pilot.id)
                        expect(res.body).to.have.property('name')
                        expect(res.body.name).to.eql(pilot.name)
                        expect(res.body).to.have.property('is_active')
                        expect(res.body.is_active).to.eql(pilot.is_active)
                        expect(res.body).to.have.property('start')
                        expect(res.body).to.have.property('end')
                    })
            })
        })

        context('when there are validation errors', () => {
            it('should return status code 400 and message from invalid id', () => {
                return request
                    .patch('/pilotstudies/123')
                    .send(body)
                    .set('Content-Type', 'application/json')
                    .expect(400)
                    .then(res => {
                        expect(res.body).to.have.property('message')
                        expect(res.body.message).to.eql(Strings.ERROR_MESSAGE.UUID_NOT_VALID_FORMAT)
                        expect(res.body).to.have.property('description')
                        expect(res.body.description).to.eql(Strings.ERROR_MESSAGE.UUID_NOT_VALID_FORMAT_DESC)
                    })
            })

            it('should return status code 400 and message from try update health professionals id list', () => {
                body.health_professionals_id = [user.id]

                return request
                    .patch(`/pilotstudies/${pilot.id}`)
                    .send(body)
                    .set('Content-Type', 'application/json')
                    .expect(400)
                    .then(res => {
                        expect(res.body).to.have.property('message')
                        expect(res.body.message).to.eql(Strings.ERROR_MESSAGE.PARAMETER_COULD_NOT_BE_UPDATED)
                        expect(res.body).to.have.property('description')
                        expect(res.body.description).to.eql('A specific route to manage health_professionals_id already exists.')
                    })
            })
        })

        context('when the pilot study is not founded', () => {
            it('should return status code 404 and message from pilot not found', () => {
                delete body.health_professionals_id
                return request
                    .patch(`/pilotstudies/${new ObjectID()}`)
                    .send(body)
                    .set('Content-Type', 'application/json')
                    .expect(404)
                    .then(res => {
                        expect(res.body).to.have.property('message')
                        expect(res.body.message).to.eql(Strings.PILOT_STUDY.NOT_FOUND)
                        expect(res.body).to.have.property('description')
                        expect(res.body.description).to.eql(Strings.PILOT_STUDY.NOT_FOUND_DESCRIPTION)
                    })
            })
        })
    })

    describe('DELETE /pilotstudies/:pilotstudy_id', () => {
        context('when want delete a pilot study', () => {
            it('should return status code 204 and no content', async () => {
                const pilotNew: PilotStudy = new PilotStudy().fromJSON(DefaultEntityMock.PILOT_STUDY)
                pilotNew.name = 'Another Pilot'
                pilot.health_professionals_id = [user]

                const result = await PilotStudyRepoModel.create(pilotNew.toJSON())
                pilotNew.id = result.id

                return request
                    .delete(`/pilotstudies/${pilotNew.id}`)
                    .set('Content-Type', 'application/json')
                    .expect(204)
                    .then(res => {
                        expect(res.body).to.eql({})
                    })
            })
        })

        context('when there are validation errors', () => {
            it('should return status code 400 and message from invalid id', () => {
                return request
                    .delete('/pilotstudies/123')
                    .set('Content-Type', 'application/json')
                    .expect(400)
                    .then(res => {
                        expect(res.body).to.have.property('message')
                        expect(res.body.message).to.eql(Strings.ERROR_MESSAGE.UUID_NOT_VALID_FORMAT)
                        expect(res.body).to.have.property('description')
                        expect(res.body.description).to.eql(Strings.ERROR_MESSAGE.UUID_NOT_VALID_FORMAT_DESC)
                    })
            })
        })

        context('when the pilot study does not exists', () => {
            it('should return status code 204 and no content', () => {
                it('should return status code 204 and no content', () => {
                    return request
                        .delete(`/pilotstudies/${new ObjectID()}`)
                        .set('Content-Type', 'application/json')
                        .expect(204)
                        .then(res => {
                            expect(res.body).to.eql({})
                        })
                })
            })
        })
    })

    describe('GET /pilotstudies', () => {
        context('when get all pilot studies', () => {
            it('should return status code 200 and a list of pilot studies', () => {
                return request
                    .get('/pilotstudies')
                    .set('Content-Type', 'application/json')
                    .expect(200)
                    .then(res => {
                        expect(res.body).to.be.an.instanceof(Array)
                        expect(res.body).to.have.lengthOf(1)
                        expect(res.body[0]).to.have.property('id')
                        expect(res.body[0].id).to.eql(pilot.id)
                        expect(res.body[0]).to.have.property('name')
                        expect(res.body[0].name).to.eql(pilot.name)
                        expect(res.body[0]).to.have.property('is_active')
                        expect(res.body[0].is_active).to.eql(pilot.is_active)
                        expect(res.body[0]).to.have.property('start')
                        expect(res.body[0]).to.have.property('end')
                        expect(res.body[0]).to.have.property('health_professionals_id')
                        expect(res.body[0].health_professionals_id).to.have.lengthOf(1)
                        expect(res.body[0].health_professionals_id[0]).to.eql(user.id)
                    })
            })
        })

        context('when there no are pilot studies', () => {
            it('should return status code 200 and a empty list', async () => {
                await deleteAllPilots({}).then()
                return request
                    .get('/pilotstudies')
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

async function deleteAllPilots(doc) {
    return await PilotStudyRepoModel.deleteMany(doc)
}
