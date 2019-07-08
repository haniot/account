import { Container } from 'inversify'
import { DI } from '../../../src/di/di'
import { IConnectionDB } from '../../../src/infrastructure/port/connection.db.interface'
import { Identifier } from '../../../src/di/identifiers'
import { PilotStudy } from '../../../src/application/domain/model/pilot.study'
import { DefaultEntityMock } from '../../mocks/models/default.entity.mock'
import { UserRepoModel } from '../../../src/infrastructure/database/schema/user.schema'
import { PilotStudyRepoModel } from '../../../src/infrastructure/database/schema/pilot.study.schema'
import { expect } from 'chai'
import { App } from '../../../src/app'
import { Strings } from '../../../src/utils/strings'
import { ObjectID } from 'bson'
import { Patient } from '../../../src/application/domain/model/patient'

const container: Container = DI.getInstance().getContainer()
const dbConnection: IConnectionDB = container.get(Identifier.MONGODB_CONNECTION)
const app: App = container.get(Identifier.APP)
const request = require('supertest')(app.getExpress())

describe('Routes: PilotStudiesPatients', () => {
    const pilot: PilotStudy = new PilotStudy().fromJSON(DefaultEntityMock.PILOT_STUDY_BASIC)
    const patient: Patient = new Patient().fromJSON(DefaultEntityMock.PATIENT)

    before(async () => {
            try {
                await dbConnection.tryConnect(0, 500)
                await deleteAllPilots({})
                await deleteAllUsers({})
                await UserRepoModel.create(DefaultEntityMock.PATIENT).then(res => patient.id = res.id)
                await PilotStudyRepoModel.create(DefaultEntityMock.PILOT_STUDY_BASIC).then(res => pilot.id = res.id)
            } catch (err) {
                throw new Error('Failure on PilotStudiesPatients test: ' + err.message)
            }
        }
    )

    after(async () => {
        try {
            await deleteAllPilots({})
            await deleteAllUsers({})
            await dbConnection.dispose()
        } catch (err) {
            throw new Error('Failure on PilotStudiesPatients test: ' + err.message)
        }
    })

    describe('POST /v1/pilotstudies/:pilotstudy_id/patients/:patient_id', () => {
        context('when associate a patient with a pilot study', () => {
            it('should return status code 200 and the pilot study', async () => {
                return request
                    .post(`/v1/pilotstudies/${pilot.id}/patients/${patient.id}`)
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
                    .post(`/v1/pilotstudies/123/patients/${patient.id}`)
                    .set('Content-Type', 'application/json')
                    .expect(400)
                    .then(res => {
                        expect(res.body).to.have.property('message', Strings.ERROR_MESSAGE.UUID_NOT_VALID_FORMAT)
                        expect(res.body).to.have.property('description', Strings.ERROR_MESSAGE.UUID_NOT_VALID_FORMAT_DESC)
                    })
            })

            it('should return status code 400 and message from invalid health professionaç id', () => {
                return request
                    .post(`/v1/pilotstudies/${pilot.id}/patients/123`)
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
                    .post(`/v1/pilotstudies/${new ObjectID()}/patients/${patient.id}`)
                    .set('Content-Type', 'application/json')
                    .expect(400)
                    .then(res => {
                        expect(res.body).to.have.property('message', Strings.PILOT_STUDY.ASSOCIATION_FAILURE)
                    })
            })
        })

        context('when the patient does not have a record', () => {
            it('should return status code 400 and info message from patient without record', () => {
                return request
                    .post(`/v1/pilotstudies/${pilot.id}/patients/${new ObjectID()}`)
                    .set('Content-Type', 'application/json')
                    .expect(400)
                    .then(res => {
                        expect(res.body).to.have.property('message', Strings.PATIENT.ASSOCIATION_FAILURE)
                    })
            })
        })
    })

    describe('DELETE /v1/pilotstudies/:pilotstudy_id/patients/:patient_id', () => {
        context('when disassociate a patient with a pilot study', () => {
            it('should return status code 204 and no content', () => {
                return request
                    .delete(`/v1/pilotstudies/${pilot.id}/patients/${patient.id}`)
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
                    .delete(`/v1/pilotstudies/123/patients/${patient.id}`)
                    .set('Content-Type', 'application/json')
                    .expect(400)
                    .then(res => {
                        expect(res.body).to.have.property('message')
                        expect(res.body.message).to.eql(Strings.ERROR_MESSAGE.UUID_NOT_VALID_FORMAT)
                        expect(res.body).to.have.property('description')
                        expect(res.body.description).to.eql(Strings.ERROR_MESSAGE.UUID_NOT_VALID_FORMAT_DESC)
                    })
            })

            it('should return status code 400 and message from invalid patient id', () => {
                return request
                    .delete(`/v1/pilotstudies/${pilot.id}/patients/123`)
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
                    .delete(`/v1/pilotstudies/${new ObjectID()}/patients/${patient.id}`)
                    .set('Content-Type', 'application/json')
                    .expect(204)
                    .then(res => {
                        expect(res.body).to.eql({})
                    })
            })
        })

        context('when the patient does not have a record', () => {
            it('should return status code 204 and no content', () => {
                return request
                    .delete(`/v1/pilotstudies/${pilot.id}/patients/${new ObjectID()}`)
                    .set('Content-Type', 'application/json')
                    .expect(204)
                    .then(res => {
                        expect(res.body).to.eql({})
                    })
            })
        })
    })

    describe('GET /v1/pilotstudies/:pilotstudy_id/patients', () => {
        context('when get all patients from pilot study', () => {
            it('should return status code 200 and a list of patients', async () => {
                await PilotStudyRepoModel
                    .findOneAndUpdate({ _id: pilot.id }, { $addToSet: { patients: patient.id } })
                    .then()
                return request
                    .get(`/v1/pilotstudies/${pilot.id}/patients`)
                    .set('Content-Type', 'application/json')
                    .expect(200)
                    .then(res => {
                        expect(res.body).to.be.an.instanceof(Array)
                        expect(res.body).to.have.lengthOf(1)
                        expect(res.body[0]).to.have.property('id', patient.id)
                        expect(res.body[0]).to.have.property('email', patient.email)
                        expect(res.body[0]).to.have.property('birth_date', patient.birth_date)
                        expect(res.body[0]).to.have.property('phone_number', patient.phone_number)
                        expect(res.body[0]).to.have.property('selected_pilot_study', patient.selected_pilot_study)
                        expect(res.body[0]).to.have.property('name', patient.name)
                        expect(res.body[0]).to.have.property('gender', patient.gender)
                    })
            })
        })

        context('when the id is invalid', () => {
            it('should return status code 400 and message from invalid id', () => {
                return request
                    .get('/v1/pilotstudies/123/patients')
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
                    .get(`/v1/pilotstudies/${new ObjectID()}/patients`)
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
