import { expect } from 'chai'
import { DIContainer } from '../../../src/di/di'
import { IConnectionDB } from '../../../src/infrastructure/port/connection.db.interface'
import { Identifier } from '../../../src/di/identifiers'
import { App } from '../../../src/app'
import { DefaultEntityMock } from '../../mocks/models/default.entity.mock'
import { UserRepoModel } from '../../../src/infrastructure/database/schema/user.schema'
import { Patient } from '../../../src/application/domain/model/patient'
import { Goal } from '../../../src/application/domain/model/goal'
import { ObjectID } from 'bson'
import { Strings } from '../../../src/utils/strings'

const dbConnection: IConnectionDB = DIContainer.get(Identifier.MONGODB_CONNECTION)
const app: App = DIContainer.get(Identifier.APP)
const request = require('supertest')(app.getExpress())

describe('Routes: PatientsGoals', () => {
    const goal: Goal = new Goal().fromJSON(DefaultEntityMock.GOAL)
    const user: Patient = new Patient().fromJSON(DefaultEntityMock.PATIENT)

    before(async () => {
            try {
                await dbConnection.tryConnect(0, 500)
                await deleteAllUsers({})
            } catch (err) {
                throw new Error('Failure on PatientsGoals test: ' + err.message)
            }
        }
    )

    after(async () => {
        try {
            await deleteAllUsers({})
            await dbConnection.dispose()
        } catch (err) {
            throw new Error('Failure on PatientsGoals test: ' + err.message)
        }
    })

    describe('GET /v1/patients/:patient_id/goals', () => {
        context('when get goals of a patient', () => {
            before(async () => {
                await deleteAllUsers({})
                await UserRepoModel.create(DefaultEntityMock.PATIENT).then(res => user.id = res.id)
            })
            it('should return status code 200 and a list of patient goals', async () => {
                return request
                    .get(`/v1/patients/${user.id}/goals`)
                    .set('Content-Type', 'application/json')
                    .expect(200)
                    .then(res => {
                        expect(res.body.steps).to.eql(goal.steps)
                        expect(res.body.calories).to.eql(goal.calories)
                        expect(res.body.distance).to.eql(goal.distance)
                        expect(res.body.active_minutes).to.eql(goal.active_minutes)
                        expect(res.body.sleep).to.eql(goal.sleep)
                    })
            })
        })

        context('when there are validation errors', () => {
            it('should return status code 400 and message from invalid id', () => {
                return request
                    .get('/v1/patients/123/goals')
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
                return request
                    .get(`/v1/patients/${new ObjectID()}/goals`)
                    .set('Content-Type', 'application/json')
                    .expect(400)
                    .then(res => {
                        expect(res.body).to.have.property('message', Strings.PATIENT.NOT_FOUND)
                        expect(res.body).to.have.property('description', Strings.PATIENT.NOT_FOUND_DESCRIPTION)
                    })
            })
        })
    })

    describe('PATCH /v1/patients/:patient_id/goals', () => {
        context('when update goals of a patient', () => {
            before(async () => {
                await deleteAllUsers({})
                await UserRepoModel.create(DefaultEntityMock.PATIENT).then(res => user.id = res.id)
            })
            it('should return status code 200 and a list of patient goals', async () => {
                return request
                    .patch(`/v1/patients/${user.id}/goals`)
                    .send({ steps: 2000, calories: 500, distance: 4000, active_minutes: 30, sleep: 420 })
                    .set('Content-Type', 'application/json')
                    .expect(200)
                    .then(res => {
                        expect(res.body.steps).to.eql(2000)
                        expect(res.body.calories).to.eql(500)
                        expect(res.body.distance).to.eql(4000)
                        expect(res.body.active_minutes).to.eql(30)
                        expect(res.body.sleep).to.eql(420)
                    })
            })
        })

        context('when update goals of a patient with an invalid attribute', () => {
            before(async () => {
                await deleteAllUsers({})
                await UserRepoModel.create(DefaultEntityMock.PATIENT).then(res => user.id = res.id)
            })
            it('should return status code 400 and an error message about the invalid number', async () => {
                return request
                    .patch(`/v1/patients/${user.id}/goals`)
                    .send({ steps: 2000, calories: 500, distance: '4000a', active_minutes: 30, sleep: 420 })
                    .set('Content-Type', 'application/json')
                    .expect(400)
                    .then(res => {
                        expect(res.body).to.have.property('message', Strings.ERROR_MESSAGE.INVALID_FIELDS)
                        expect(res.body).to.have.property('description',
                            'distance'.concat(Strings.ERROR_MESSAGE.INVALID_NUMBER))
                    })
            })

            it('should return status code 400 and an error message about the invalid number (null)', async () => {
                return request
                    .patch(`/v1/patients/${user.id}/goals`)
                    .send({ steps: 2000, calories: 500, distance: null, active_minutes: 30, sleep: 420 })
                    .set('Content-Type', 'application/json')
                    .expect(400)
                    .then(res => {
                        expect(res.body).to.have.property('message', Strings.ERROR_MESSAGE.INVALID_FIELDS)
                        expect(res.body).to.have.property('description',
                            'distance'.concat(Strings.ERROR_MESSAGE.INVALID_NUMBER))
                    })
            })

            it('should return status code 400 and an error message about the negative number', async () => {
                return request
                    .patch(`/v1/patients/${user.id}/goals`)
                    .send({ steps: 2000, calories: 500, distance: -8000, active_minutes: 30, sleep: 420 })
                    .set('Content-Type', 'application/json')
                    .expect(400)
                    .then(res => {
                        expect(res.body).to.have.property('message', Strings.ERROR_MESSAGE.INVALID_FIELDS)
                        expect(res.body).to.have.property('description',
                            'distance'.concat(Strings.ERROR_MESSAGE.NEGATIVE_NUMBER))
                    })
            })
        })

        context('when there are validation errors', () => {
            it('should return status code 400 and message from invalid id', () => {
                return request
                    .patch('/v1/patients/123/goals')
                    .send({ steps: 2000, calories: 500, distance: 4000, active_minutes: 30, sleep: 420 })
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
                return request
                    .patch(`/v1/patients/${new ObjectID()}/goals`)
                    .send({ steps: 2000, calories: 500, distance: 4000, active_minutes: 30, sleep: 420 })
                    .set('Content-Type', 'application/json')
                    .expect(400)
                    .then(res => {
                        expect(res.body).to.have.property('message', Strings.PATIENT.NOT_FOUND)
                        expect(res.body).to.have.property('description', Strings.PATIENT.NOT_FOUND_DESCRIPTION)
                    })
            })
        })
    })
})

async function deleteAllUsers(doc) {
    return await UserRepoModel.deleteMany(doc)
}
