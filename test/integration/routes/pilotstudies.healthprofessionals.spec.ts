import { Container } from 'inversify'
import { DI } from '../../../src/di/di'
import { IConnectionDB } from '../../../src/infrastructure/port/connection.db.interface'
import { Identifier } from '../../../src/di/identifiers'
import { IHealthProfessionalRepository } from '../../../src/application/port/health.professional.repository.interface'
import { App } from '../../../src/app'
import { PilotStudy } from '../../../src/application/domain/model/pilot.study'
import { DefaultEntityMock } from '../../mocks/models/default.entity.mock'
import { HealthProfessional } from '../../../src/application/domain/model/health.professional'
import { UserRepoModel } from '../../../src/infrastructure/database/schema/user.schema'
import { PilotStudyRepoModel } from '../../../src/infrastructure/database/schema/pilot.study.schema'
import { IPilotStudyRepository } from '../../../src/application/port/pilot.study.repository.interface'
import { expect } from 'chai'
import { HealthAreaTypes } from '../../../src/application/domain/utils/health.area.types'

const container: Container = DI.getInstance().getContainer()
const dbConnection: IConnectionDB = container.get(Identifier.MONGODB_CONNECTION)
const healthRepo: IHealthProfessionalRepository = container.get(Identifier.HEALTH_PROFESSIONAL_REPOSITORY)
const pilotRepo: IPilotStudyRepository = container.get(Identifier.PILOT_STUDY_REPOSITORY)
const app: App = container.get(Identifier.APP)
const request = require('supertest')(app.getExpress())

describe('Routes: PilotStudiesHealthProfessionals', () => {
    const pilot: PilotStudy = new PilotStudy().fromJSON(DefaultEntityMock.PILOT_STUDY)
    const health: HealthProfessional = new HealthProfessional().fromJSON(DefaultEntityMock.HEALTH_PROFESSIONAL)
    const anotherHealth: HealthProfessional = new HealthProfessional().fromJSON({
        name: 'Health Mock 2',
        email: 'health2@mail.com',
        password: 'health123',
        birth_date: '1992-01-08',
        health_area: HealthAreaTypes.NUTRITION,
        phone_number: '(88) 98888-8888',
        language: 'pt-br'
    })

    before(async () => {
            try {
                await dbConnection.tryConnect(0, 500)
                await deleteAllPilots({})
                await deleteAllUsers({})

                const healthNew = await healthRepo.create(health)
                health.id = healthNew.id

                const pilotNew = await pilotRepo.create(pilot)
                pilot.id = pilotNew.id

            } catch (err) {
                console.log(err)
                throw new Error('Failure on PilotStudiesHealthProfessionals test: ' + err.message)
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

    describe('POST /v1/pilotstudies/:pilotstudy_id/healthprofessionals/:healthprofessional_id', () => {
        context('when associate a health professional with a pilot study', () => {
            it('should return status code 200 and the pilot study', async () => {
                const result = await healthRepo.create(anotherHealth)
                anotherHealth.id = result.id

                return request
                    .post(`/v1/pilotstudies/${pilot.id}/healthprofessionals/${anotherHealth.id}`)
                    .set('Content-Type', 'application/json')
                    .expect(204)
                    .then(res => {
                        expect(res.body).to.eql({})
                    })
            })
        })

        // context('when there are validation errors', () => {
        //     it('should return status code 400 and message from invalid pilot id', () => {
        //         return request
        //             .post(`/pilotstudies/123/healthprofessionals/${anotherUser.id}`)
        //             .set('Content-Type', 'application/json')
        //             .expect(400)
        //             .then(res => {
        //                 expect(res.body).to.have.property('message')
        //                 expect(res.body.message).to.eql(Strings.ERROR_MESSAGE.UUID_NOT_VALID_FORMAT)
        //                 expect(res.body).to.have.property('description')
        //                 expect(res.body.description).to.eql(Strings.ERROR_MESSAGE.UUID_NOT_VALID_FORMAT_DESC)
        //             })
        //     })
        //
        //     it('should return status code 400 and message from invalid health professional id', () => {
        //         return request
        //             .post(`/pilotstudies/${pilot.id}/healthprofessionals/123`)
        //             .set('Content-Type', 'application/json')
        //             .expect(400)
        //             .then(res => {
        //                 expect(res.body).to.have.property('message')
        //                 expect(res.body.message).to.eql(Strings.ERROR_MESSAGE.UUID_NOT_VALID_FORMAT)
        //                 expect(res.body).to.have.property('description')
        //                 expect(res.body.description).to.eql(Strings.ERROR_MESSAGE.UUID_NOT_VALID_FORMAT_DESC)
        //             })
        //     })
        // })
        //
        // context('when the pilot study is not founded', () => {
        //     it('should return status code 404 and message from pilot study not found', () => {
        //         return request
        //             .post(`/pilotstudies/${new ObjectID()}/healthprofessionals/${user.id}`)
        //             .set('Content-Type', 'application/json')
        //             .expect(404)
        //             .then(res => {
        //                 expect(res.body).to.have.property('message')
        //                 expect(res.body.message).to.eql(Strings.PILOT_STUDY.NOT_FOUND)
        //                 expect(res.body).to.have.property('description')
        //                 expect(res.body.description).to.eql(Strings.PILOT_STUDY.NOT_FOUND_DESCRIPTION)
        //             })
        //     })
        // })
        //
        // context('when the health professional does not exists', () => {
        //     it('should return status code 400 and info message from nonexistent health professional', () => {
        //         return request
        //             .post(`/pilotstudies/${pilot.id}/healthprofessionals/${new ObjectID()}`)
        //             .set('Content-Type', 'application/json')
        //             .expect(400)
        //             .then(res => {
        //                 expect(res.body).to.have.property('message')
        //                 expect(res.body.message).to.eql(Strings.HEALTH_PROFESSIONAL.ASSOCIATION_FAILURE)
        //             })
        //     })
        // })
    })

    describe('DELETE /v1/pilotstudies/:pilotstudy_id/healthprofessionals/:healthprofessional_id', () => {
        context('when disassociate a health professional with a pilot study', () => {
            it('should return status code 204 and no content', async () => {
                return request
                    .delete(`/v1/pilotstudies/${pilot.id}/healthprofessionals/${anotherHealth.id}`)
                    .set('Content-Type', 'application/json')
                    .expect(204)
                    .then(res => {
                        expect(res.body).to.eql({})
                    })
            })
        })

        // context('when there are validation errors', () => {
        //     it('should return status code 400 and message from invalid pilot id', () => {
        //         return request
        //             .delete(`/pilotstudies/123/healthprofessionals/${anotherUser.id}`)
        //             .set('Content-Type', 'application/json')
        //             .expect(400)
        //             .then(res => {
        //                 expect(res.body).to.have.property('message')
        //                 expect(res.body.message).to.eql(Strings.ERROR_MESSAGE.UUID_NOT_VALID_FORMAT)
        //                 expect(res.body).to.have.property('description')
        //                 expect(res.body.description).to.eql(Strings.ERROR_MESSAGE.UUID_NOT_VALID_FORMAT_DESC)
        //             })
        //     })
        //
        //     it('should return status code 400 and message from invalid health professional id', () => {
        //         return request
        //             .delete(`/pilotstudies/${pilot.id}/healthprofessionals/123`)
        //             .set('Content-Type', 'application/json')
        //             .expect(400)
        //             .then(res => {
        //                 expect(res.body).to.have.property('message')
        //                 expect(res.body.message).to.eql(Strings.ERROR_MESSAGE.UUID_NOT_VALID_FORMAT)
        //                 expect(res.body).to.have.property('description')
        //                 expect(res.body.description).to.eql(Strings.ERROR_MESSAGE.UUID_NOT_VALID_FORMAT_DESC)
        //             })
        //     })
        // })
        //
        // context('when the pilot study is not founded', () => {
        //     it('should return status code 404 and message from pilot study not found', () => {
        //         return request
        //             .delete(`/pilotstudies/${new ObjectID()}/healthprofessionals/${user.id}`)
        //             .set('Content-Type', 'application/json')
        //             .expect(404)
        //             .then(res => {
        //                 expect(res.body).to.have.property('message')
        //                 expect(res.body.message).to.eql(Strings.PILOT_STUDY.NOT_FOUND)
        //                 expect(res.body).to.have.property('description')
        //                 expect(res.body.description).to.eql(Strings.PILOT_STUDY.NOT_FOUND_DESCRIPTION)
        //             })
        //     })
        // })
    })

    describe('GET /v1/pilotstudies/:pilotstudy_id/healthprofessionals', () => {
        context('when get all health professionals from pilot study', () => {
            it('should return status code 200 and a list of health professionals', () => {
                return request
                    .get(`/v1/pilotstudies/${pilot.id}/healthprofessionals`)
                    .set('Content-Type', 'application/json')
                    .expect(200)
                    .then(res => {
                        expect(res.body).to.be.an.instanceof(Array)
                        expect(res.body).to.have.lengthOf(0)
                    })
            })
        })
        //
        // context('when the id is invalid', () => {
        //     it('should return status code 400 and message from invalid id', () => {
        //         return request
        //             .get('/pilotstudies/123/healthprofessionals')
        //             .set('Content-Type', 'application/json')
        //             .expect(400)
        //             .then(res => {
        //                 expect(res.body).to.have.property('message')
        //                 expect(res.body.message).to.eql(Strings.ERROR_MESSAGE.UUID_NOT_VALID_FORMAT)
        //                 expect(res.body).to.have.property('description')
        //                 expect(res.body.description).to.eql(Strings.ERROR_MESSAGE.UUID_NOT_VALID_FORMAT_DESC)
        //             })
        //     })
        // })
        //
        // context('when the pilot study is not founded', () => {
        //     it('should return status code 404 and info message from pilot study not found', () => {
        //         return request
        //             .get(`/pilotstudies/${new ObjectID()}/healthprofessionals`)
        //             .set('Content-Type', 'application/json')
        //             .expect(404)
        //             .then(res => {
        //                 expect(res.body).to.have.property('message')
        //                 expect(res.body.message).to.eql(Strings.PILOT_STUDY.NOT_FOUND)
        //                 expect(res.body).to.have.property('description')
        //                 expect(res.body.description).to.eql(Strings.PILOT_STUDY.NOT_FOUND_DESCRIPTION)
        //             })
        //     })
        // })
    })
})

async function deleteAllUsers(doc) {
    return await UserRepoModel.deleteMany(doc)
}

async function deleteAllPilots(doc) {
    return await PilotStudyRepoModel.deleteMany(doc)
}
