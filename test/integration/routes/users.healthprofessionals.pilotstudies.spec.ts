import { expect } from 'chai'
import { Container } from 'inversify'
import { DI } from '../../../src/di/di'
import { IConnectionDB } from '../../../src/infrastructure/port/connection.db.interface'
import { Identifier } from '../../../src/di/identifiers'
import { IHealthProfessionalRepository } from '../../../src/application/port/health.professional.repository.interface'
import { IPilotStudyRepository } from '../../../src/application/port/pilot.study.repository.interface'
import { App } from '../../../src/app'
import { PilotStudy } from '../../../src/application/domain/model/pilot.study'
import { DefaultEntityMock } from '../../mocks/default.entity.mock'
import { HealthProfessional } from '../../../src/application/domain/model/health.professional'
import { UserRepoModel } from '../../../src/infrastructure/database/schema/user.schema'
import { PilotStudyRepoModel } from '../../../src/infrastructure/database/schema/pilot.study.schema'
import { Strings } from '../../../src/utils/strings'
import { ObjectID } from 'bson'

const container: Container = DI.getInstance().getContainer()
const dbConnection: IConnectionDB = container.get(Identifier.MONGODB_CONNECTION)
const healthRepo: IHealthProfessionalRepository = container.get(Identifier.HEALTH_PROFESSIONAL_REPOSITORY)
const pilotRepo: IPilotStudyRepository = container.get(Identifier.PILOT_STUDY_REPOSITORY)
const app: App = container.get(Identifier.APP)
const request = require('supertest')(app.getExpress())

describe('Routes: PilotStudiesHealthProfessionals', () => {
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
                const pilotNew = await pilotRepo.create(pilot)
                pilot.id = pilotNew.id
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

    describe('GET /users/healthprofessionals/:healthprofessional_id/pilotstudies', () => {
        context('when get all pilot studies associated with a health professional', () => {
            it('should return status code 200 and a list of pilot studies', () => {
                request
                    .get(`/users/healthprofessionals/${user.id}/pilotstudies`)
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
                        expect(res.body[0].health_professionals_id).to.be.an.instanceof(Array)
                        expect(res.body[0].health_professionals_id).to.have.lengthOf(0)
                    })
            })
        })

        context('when there are validation errors', () => {
            it('should return status code 400 and message from invalid id', () => {
                request
                    .get('/users/healthprofessionals/123/pilotstudies')
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

        context('when the user is not founded', () => {
            it('should return status code 200 and empty array', () => {
                request
                    .get(`/users/healthprofessionals/${new ObjectID()}/pilotstudies`)
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
