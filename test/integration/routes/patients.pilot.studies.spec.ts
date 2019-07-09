import { expect } from 'chai'
import { Container } from 'inversify'
import { DI } from '../../../src/di/di'
import { IConnectionDB } from '../../../src/infrastructure/port/connection.db.interface'
import { Identifier } from '../../../src/di/identifiers'
import { App } from '../../../src/app'
import { PilotStudy } from '../../../src/application/domain/model/pilot.study'
import { DefaultEntityMock } from '../../mocks/models/default.entity.mock'
import { UserRepoModel } from '../../../src/infrastructure/database/schema/user.schema'
import { PilotStudyRepoModel } from '../../../src/infrastructure/database/schema/pilot.study.schema'
import { ObjectID } from 'bson'
import { Patient } from '../../../src/application/domain/model/patient'

const container: Container = DI.getInstance().getContainer()
const dbConnection: IConnectionDB = container.get(Identifier.MONGODB_CONNECTION)
const app: App = container.get(Identifier.APP)
const request = require('supertest')(app.getExpress())

describe('Routes: PatientsPilotStudies', () => {
    const pilot: PilotStudy = new PilotStudy().fromJSON(DefaultEntityMock.PILOT_STUDY)
    const user: Patient = new Patient().fromJSON(DefaultEntityMock.PATIENT)

    before(async () => {
            try {
                await dbConnection.tryConnect(0, 500)
                await deleteAllPilots({})
                await deleteAllUsers({})
                await UserRepoModel.create(DefaultEntityMock.PATIENT).then(res => user.id = res.id)
                await PilotStudyRepoModel.create(DefaultEntityMock.PILOT_STUDY).then(res => pilot.id = res.id)
            } catch (err) {
                throw new Error('Failure on PatientsPilotStudies test: ' + err.message)
            }
        }
    )

    after(async () => {
        try {
            await deleteAllPilots({})
            await deleteAllUsers({})
            await dbConnection.dispose()
        } catch (err) {
            throw new Error('Failure on PatientsPilotStudies test: ' + err.message)
        }
    })

    describe('GET /v1/patients/:patient_id/pilotstudies', () => {
        context('when get all pilot studies associated with a patient', () => {
            it('should return status code 200 and a list of pilot studies', async () => {
                await PilotStudyRepoModel
                    .findOneAndUpdate({ _id: pilot.id }, { $addToSet: { patients: user.id } })
                    .then()
                request
                    .get(`/v1/patients/${user.id}/pilotstudies`)
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

        context('when there are validation errors', () => {
            it('should return status code 400 and message from invalid id', () => {
                request
                    .get('/v1/patients/123/pilotstudies')
                    .set('Content-Type', 'application/json')
                    .expect(400)
                    .then(res => {
                        expect(res.body).to.have.property('message', 'Some ID provided does not have a valid format!')
                        expect(res.body).to.have.property('description', 'A 24-byte hex ID similar to this: ' +
                            '507f191e810c19729de860ea is expected.')
                    })
            })
        })

        context('when the user is not founded', () => {
            it('should return status code 200 and empty array', () => {
                request
                    .get(`/v1/patients/${new ObjectID()}/pilotstudies`)
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
