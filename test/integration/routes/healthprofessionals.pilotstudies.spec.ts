import { IConnectionDB } from '../../../src/infrastructure/port/connection.db.interface'
import { Identifier } from '../../../src/di/identifiers'
import { PilotStudy } from '../../../src/application/domain/model/pilot.study'
import { DefaultEntityMock } from '../../mocks/models/default.entity.mock'
import { HealthProfessional } from '../../../src/application/domain/model/health.professional'
import { UserRepoModel } from '../../../src/infrastructure/database/schema/user.schema'
import { PilotStudyRepoModel } from '../../../src/infrastructure/database/schema/pilot.study.schema'
import { IHealthProfessionalRepository } from '../../../src/application/port/health.professional.repository.interface'
import { IPilotStudyRepository } from '../../../src/application/port/pilot.study.repository.interface'
import { App } from '../../../src/app'
import { expect } from 'chai'
import { DIContainer } from '../../../src/di/di'

const dbConnection: IConnectionDB = DIContainer.get(Identifier.MONGODB_CONNECTION)
const healthRepo: IHealthProfessionalRepository = DIContainer.get(Identifier.HEALTH_PROFESSIONAL_REPOSITORY)
const pilotRepo: IPilotStudyRepository = DIContainer.get(Identifier.PILOT_STUDY_REPOSITORY)
const app: App = DIContainer.get(Identifier.APP)
const request = require('supertest')(app.getExpress())

describe('Routes: HealthProfessionalsPilotStudies', () => {
    const pilot: PilotStudy = new PilotStudy().fromJSON(DefaultEntityMock.PILOT_STUDY_BASIC)
    const user: HealthProfessional = new HealthProfessional().fromJSON(DefaultEntityMock.HEALTH_PROFESSIONAL)

    before(async () => {
            try {
                await dbConnection.tryConnect(0, 500)
                await deleteAllPilots({})
                await deleteAllUsers({})
                const health = await healthRepo.create(user)
                user.id = health.id
                pilot.addHealthProfessional(user)
                const pilotStudy = await pilotRepo.create(pilot)
                pilot.id = pilotStudy.id
            } catch (err) {
                throw new Error('Failure on HealthProfessionalsPilotStudies test: ' + err.message)
            }
        }
    )

    after(async () => {
        try {
            await deleteAllPilots({})
            await deleteAllUsers({})
            await dbConnection.dispose()
        } catch (err) {
            throw new Error('Failure on HealthProfessionalsPilotStudies test: ' + err.message)
        }
    })

    describe('GET /v1/healthprofessionals/:healthprofessional_id/pilotstudies', () => {
        context('when get all pilot studies associated with a health professional', () => {
            it('should return status code 200 and a list of pilot studies', async () => {
                request
                    .get(`/v1/healthprofessionals/${user.id}/pilotstudies`)
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
                        expect(res.body[0]).to.have.property('location', pilot.location)
                    })
            })
        })

        // context('when there are validation errors', () => {
        //     it('should return status code 400 and message from invalid id', () => {
        //         request
        //             .get('/v1/healthprofessionals/123/pilotstudies')
        //             .set('Content-Type', 'application/json')
        //             .expect(400)
        //             .then(res => {
        //                 expect(res.body).to.have.property('message', 'The given ID is in invalid format.')
        //                 expect(res.body).to.have.property('description', 'A 12 bytes hexadecimal ID similar to this')
        //             })
        //     })
        // })
        //
        // context('when the user is not founded', () => {
        //     it('should return status code 200 and empty array', () => {
        //         request
        //             .get(`/v1/healthprofessionals/${new ObjectID()}/pilotstudies`)
        //             .set('Content-Type', 'application/json')
        //             .expect(200)
        //             .then(res => {
        //                 expect(res.body).to.be.an.instanceof(Array)
        //                 expect(res.body).to.have.lengthOf(0)
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
