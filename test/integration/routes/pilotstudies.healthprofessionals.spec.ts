import { DIContainer } from '../../../src/di/di'
import { IConnectionDB } from '../../../src/infrastructure/port/connection.db.interface'
import { Identifier } from '../../../src/di/identifiers'
import { PilotStudy } from '../../../src/application/domain/model/pilot.study'
import { DefaultEntityMock } from '../../mocks/models/default.entity.mock'
import { HealthProfessional } from '../../../src/application/domain/model/health.professional'
import { UserRepoModel } from '../../../src/infrastructure/database/schema/user.schema'
import { PilotStudyRepoModel } from '../../../src/infrastructure/database/schema/pilot.study.schema'
import { expect } from 'chai'
import { App } from '../../../src/app'
import { Strings } from '../../../src/utils/strings'
import { ObjectID } from 'bson'

const dbConnection: IConnectionDB = DIContainer.get(Identifier.MONGODB_CONNECTION)
const app: App = DIContainer.get(Identifier.APP)
const request = require('supertest')(app.getExpress())

describe('Routes: PilotStudiesHealthProfessionals', () => {
    const pilot: PilotStudy = new PilotStudy().fromJSON(DefaultEntityMock.PILOT_STUDY_BASIC)
    const health: HealthProfessional = new HealthProfessional().fromJSON(DefaultEntityMock.HEALTH_PROFESSIONAL)

    before(async () => {
            try {
                await dbConnection.tryConnect(0, 500)
                await deleteAllPilots({})
                await deleteAllUsers({})
                await UserRepoModel.create(DefaultEntityMock.HEALTH_PROFESSIONAL).then(res => health.id = res.id)
                await PilotStudyRepoModel.create(DefaultEntityMock.PILOT_STUDY_BASIC).then(res => pilot.id = res.id)
            } catch (err) {
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
            throw new Error('Failure on PilotStudiesHealthProfessionals test: ' + err.message)
        }
    })

    describe('POST /v1/pilotstudies/:pilotstudy_id/healthprofessionals/:healthprofessional_id', () => {
        context('when associate a health professional with a pilot study', () => {
            it('should return status code 200 and the pilot study', async () => {
                return request
                    .post(`/v1/pilotstudies/${pilot.id}/healthprofessionals/${health.id}`)
                    .set('Content-Type', 'application/json')
                    .expect(204)
                    .then(res => {
                        expect(res.body).to.eql({})
                    })
            })
        })

        context('when there are validation errors', () => {
            it('should return status code 400 and message from invalid pilot study id', () => {
                return request
                    .post(`/v1/pilotstudies/123/healthprofessionals/${health.id}`)
                    .set('Content-Type', 'application/json')
                    .expect(400)
                    .then(res => {
                        expect(res.body).to.have.property('message', Strings.ERROR_MESSAGE.UUID_NOT_VALID_FORMAT)
                        expect(res.body).to.have.property('description', Strings.ERROR_MESSAGE.UUID_NOT_VALID_FORMAT_DESC)
                    })
            })

            it('should return status code 400 and message from invalid health professionaç id', () => {
                return request
                    .post(`/v1/pilotstudies/${pilot.id}/healthprofessionals/123`)
                    .set('Content-Type', 'application/json')
                    .expect(400)
                    .then(res => {
                        expect(res.body).to.have.property('message', Strings.ERROR_MESSAGE.UUID_NOT_VALID_FORMAT)
                        expect(res.body).to.have.property('description', Strings.ERROR_MESSAGE.UUID_NOT_VALID_FORMAT_DESC)
                    })
            })
        })

        context('when the pilot study does not have a record', () => {
            it('should return status code 400 and message from pilot study without record', () => {
                return request
                    .post(`/v1/pilotstudies/${new ObjectID()}/healthprofessionals/${health.id}`)
                    .set('Content-Type', 'application/json')
                    .expect(400)
                    .then(res => {
                        expect(res.body).to.have.property('message', Strings.PILOT_STUDY.ASSOCIATION_FAILURE)
                    })
            })
        })

        context('when the health professional does not have a record', () => {
            it('should return status code 400 and info message from health professional without record', () => {
                return request
                    .post(`/v1/pilotstudies/${pilot.id}/healthprofessionals/${new ObjectID()}`)
                    .set('Content-Type', 'application/json')
                    .expect(400)
                    .then(res => {
                        expect(res.body).to.have.property('message', Strings.HEALTH_PROFESSIONAL.ASSOCIATION_FAILURE)
                    })
            })
        })
    })

    describe('DELETE /v1/pilotstudies/:pilotstudy_id/healthprofessionals/:healthprofessional_id', () => {
        context('when disassociate a health professional with a pilot study', () => {
            it('should return status code 204 and no content', () => {
                return request
                    .delete(`/v1/pilotstudies/${pilot.id}/healthprofessionals/${health.id}`)
                    .set('Content-Type', 'application/json')
                    .expect(204)
                    .then(res => {
                        expect(res.body).to.eql({})
                    })
            })
        })

        context('when there are validation errors', () => {
            it('should return status code 400 and message from invalid pilot id', () => {
                return request
                    .delete(`/v1/pilotstudies/123/healthprofessionals/${health.id}`)
                    .set('Content-Type', 'application/json')
                    .expect(400)
                    .then(res => {
                        expect(res.body).to.have.property('message')
                        expect(res.body.message).to.eql(Strings.ERROR_MESSAGE.UUID_NOT_VALID_FORMAT)
                        expect(res.body).to.have.property('description')
                        expect(res.body.description).to.eql(Strings.ERROR_MESSAGE.UUID_NOT_VALID_FORMAT_DESC)
                    })
            })

            it('should return status code 400 and message from invalid health professional id', () => {
                return request
                    .delete(`/v1/pilotstudies/${pilot.id}/healthprofessionals/123`)
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

        context('when the pilot study does not have a record', () => {
            it('should return status code 204 and no content', () => {
                return request
                    .delete(`/v1/pilotstudies/${new ObjectID()}/healthprofessionals/${health.id}`)
                    .set('Content-Type', 'application/json')
                    .expect(204)
                    .then(res => {
                        expect(res.body).to.eql({})
                    })
            })
        })

        context('when the health professional does not have a record', () => {
            it('should return status code 204 and no content', () => {
                return request
                    .delete(`/v1/pilotstudies/${pilot.id}/healthprofessionals/${new ObjectID()}`)
                    .set('Content-Type', 'application/json')
                    .expect(204)
                    .then(res => {
                        expect(res.body).to.eql({})
                    })
            })
        })
    })

    describe('GET /v1/pilotstudies/:pilotstudy_id/healthprofessionals', () => {
        context('when get all health professionals from pilot study', () => {
            it('should return status code 200 and a list of health professionals', async () => {
                await PilotStudyRepoModel
                    .findOneAndUpdate(
                        { _id: pilot.id },
                        { $addToSet: { health_professionals: new ObjectID(health.id) } })
                    .then()

                return request
                    .get(`/v1/pilotstudies/${pilot.id}/healthprofessionals`)
                    .set('Content-Type', 'application/json')
                    .expect(200)
                    .then(res => {
                        expect(res.body).to.be.an.instanceof(Array)
                        expect(res.body).to.have.lengthOf(1)
                        expect(res.body[0]).to.have.property('id', health.id)
                        expect(res.body[0]).to.have.property('email', health.email)
                        expect(res.body[0]).to.have.property('birth_date', health.birth_date)
                        expect(res.body[0]).to.have.property('phone_number', health.phone_number)
                        expect(res.body[0]).to.have.property('selected_pilot_study', health.selected_pilot_study)
                        expect(res.body[0]).to.have.property('name', health.name)
                        expect(res.body[0]).to.have.property('health_area', health.health_area)
                    })
            })
        })

        context('when the id is invalid', () => {
            it('should return status code 400 and message from invalid id', () => {
                return request
                    .get('/v1/pilotstudies/123/healthprofessionals')
                    .set('Content-Type', 'application/json')
                    .expect(400)
                    .then(res => {
                        expect(res.body).to.have.property('message', Strings.ERROR_MESSAGE.UUID_NOT_VALID_FORMAT)
                        expect(res.body).to.have.property('description', Strings.ERROR_MESSAGE.UUID_NOT_VALID_FORMAT_DESC)
                    })
            })
        })

        context('when the pilot study is not founded', () => {
            it('should return status code 200 and a empty array', () => {
                return request
                    .get(`/v1/pilotstudies/${new ObjectID()}/healthprofessionals`)
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
