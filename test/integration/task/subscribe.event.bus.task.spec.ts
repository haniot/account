import { IPatientRepository } from '../../../src/application/port/patient.repository.interface'
import { DIContainer } from '../../../src/di/di'
import { Identifier } from '../../../src/di/identifiers'
import { IBackgroundTask } from '../../../src/application/port/background.task.interface'
import { IConnectionDB } from '../../../src/infrastructure/port/connection.db.interface'
import { UserRepoModel } from '../../../src/infrastructure/database/schema/user.schema'
import { Default } from '../../../src/utils/default'
import { Patient } from '../../../src/application/domain/model/patient'
import { DefaultEntityMock } from '../../mocks/models/default.entity.mock'
import { IQuery } from '../../../src/application/port/query.interface'
import { Query } from '../../../src/infrastructure/repository/query/query'
import { UserType } from '../../../src/application/domain/utils/user.type'
import { expect } from 'chai'
import { AccessStatusTypes } from '../../../src/application/domain/utils/access.status.types'
import { FitbitLastSyncEvent } from '../../../src/application/integration-event/event/fitbit.last.sync.event'
import { Fitbit } from '../../../src/application/domain/model/fitbit'
import { EventBusRabbitMQ } from '../../../src/infrastructure/eventbus/rabbitmq/eventbus.rabbitmq'
import { FitbitRevokeEvent } from '../../../src/application/integration-event/event/fitbit.revoke.event'
import { Strings } from '../../../src/utils/strings'
import { FitbitErrorEvent } from '../../../src/application/integration-event/event/fitbit.error.event'
import { ExternalServices } from '../../../src/application/domain/model/external.services'

const dbConnection: IConnectionDB = DIContainer.get(Identifier.MONGODB_CONNECTION)
const rabbitmq: EventBusRabbitMQ = DIContainer.get(Identifier.RABBITMQ_EVENT_BUS)
const subscribeEventBusTask: IBackgroundTask = DIContainer.get(Identifier.SUBSCRIBE_EVENT_BUS_TASK)
const patientRepository: IPatientRepository = DIContainer.get(Identifier.PATIENT_REPOSITORY)

describe('SUBSCRIBE EVENT BUS TASK', () => {
    // Timeout function for control of execution
    const timeout = (milliseconds) => {
        return new Promise(resolve => setTimeout(resolve, milliseconds))
    }

    // Start DB connection, RabbitMQ connection and SubscribeEventBusTask
    before(async () => {
        try {
            await dbConnection.tryConnect(process.env.MONGODB_URI_TEST || Default.MONGODB_URI_TEST)

            await deleteAllUsers({})

            // Initialize RabbitMQ Publisher connection
            const rabbitUri = process.env.RABBITMQ_URI || Default.RABBITMQ_URI
            const rabbitOptions: any = { interval: 100, receiveFromYourself: true, sslOptions: { ca: [] } }

            await rabbitmq.connectionPub.open(rabbitUri, rabbitOptions)

            rabbitmq.receiveFromYourself = true

            subscribeEventBusTask.run()

            await timeout(2000)
        } catch (err) {
            throw new Error('Failure on SubscribeEventBusTask test: ' + err.message)
        }
    })

    // Stop DB connection and SubscribeEventBusTask
    after(async () => {
        try {
            await deleteAllUsers({})

            await dbConnection.dispose()

            await subscribeEventBusTask.stop()
        } catch (err) {
            throw new Error('Failure on SubscribeEventBusTask test: ' + err.message)
        }
    })

    context('when receiving a FitbitLastSyncEvent successfully', () => {
        before(async () => {
            try {
                await deleteAllUsers({})
            } catch (err) {
                throw new Error('Failure on SubscribeEventBusTask test: ' + err.message)
            }
        })
        it('should return an updated child with a new fitbit_last_sync and a new fitbit_status', (done) => {
            const patient: Patient = new Patient().fromJSON(DefaultEntityMock.PATIENT)
            patient.external_services = new ExternalServices()
            patient.external_services.fitbit_status = AccessStatusTypes.VALID_TOKEN
            patient.external_services.fitbit_last_sync = new Date('2020-01-25T14:40:00Z')

            patientRepository.create(patient)
                .then(async patientCreate => {
                    const fitbitLastSync: Fitbit = new Fitbit()
                    fitbitLastSync.patient_id = patientCreate.id
                    fitbitLastSync.last_sync = '2020-02-05T10:30:00Z'
                    await timeout(2000)

                    const fitbitLastSyncEvent: FitbitLastSyncEvent = new FitbitLastSyncEvent(new Date(), fitbitLastSync)
                    await rabbitmq.publish(fitbitLastSyncEvent, FitbitLastSyncEvent.ROUTING_KEY)

                    // Wait for 2000 milliseconds for the task to be executed
                    await timeout(2000)

                    const query: IQuery = new Query()
                    query.addFilter({ _id: patientCreate.id, type: UserType.PATIENT })

                    const result = await patientRepository.findOne(query)

                    expect(result.external_services.fitbit_last_sync).to.eql(new Date(fitbitLastSync.last_sync))
                    expect(result.external_services.fitbit_status).to.eql(AccessStatusTypes.VALID_TOKEN)

                    done()
                })
                .catch(done)
        })
    })

    context('when receiving a FitbitRevokeEvent successfully', () => {
        before(async () => {
            try {
                await deleteAllUsers({})
            } catch (err) {
                throw new Error('Failure on SubscribeEventBusTask test: ' + err.message)
            }
        })
        it('should return an updated child with a new fitbit_status', (done) => {
            const patient: Patient = new Patient().fromJSON(DefaultEntityMock.PATIENT)
            patient.external_services = new ExternalServices()
            patient.external_services.fitbit_status = AccessStatusTypes.VALID_TOKEN

            patientRepository.create(patient)
                .then(async patientCreate => {
                    const fitbitRevoke: Fitbit = new Fitbit()
                    fitbitRevoke.patient_id = patientCreate.id
                    await timeout(2000)

                    const fitbitRevokeEvent: FitbitRevokeEvent = new FitbitRevokeEvent(new Date(), fitbitRevoke)
                    await rabbitmq.publish(fitbitRevokeEvent, FitbitRevokeEvent.ROUTING_KEY)

                    // Wait for 2000 milliseconds for the task to be executed
                    await timeout(2000)

                    const query: IQuery = new Query()
                    query.addFilter({ _id: patientCreate.id, type: UserType.PATIENT })

                    const result = await patientRepository.findOne(query)

                    expect(result.external_services.fitbit_status).to.eql(AccessStatusTypes.NONE)

                    done()
                })
                .catch(done)
        })
    })

    context('when receiving a FitbitError successfully', () => {
        before(async () => {
            try {
                await deleteAllUsers({})
            } catch (err) {
                throw new Error('Failure on SubscribeEventBusTask test: ' + err.message)
            }
        })
        it('should return an updated child with a new fitbit_status', (done) => {
            const patient: Patient = new Patient().fromJSON(DefaultEntityMock.PATIENT)

            patientRepository.create(patient)
                .then(async patientCreate => {
                    const fitbitError: Fitbit = new Fitbit()
                    fitbitError.patient_id = patientCreate.id
                    fitbitError.error = {
                        code: 1011, message: Strings.ERROR_MESSAGE.INTERNAL_SERVER_ERROR,
                        description: Strings.ERROR_MESSAGE.INTERNAL_SERVER_ERROR_DESC
                    }
                    await timeout(2000)

                    const fitbitErrorEvent: FitbitErrorEvent = new FitbitErrorEvent(new Date(), fitbitError)
                    await rabbitmq.publish(fitbitErrorEvent, FitbitErrorEvent.ROUTING_KEY)

                    // Wait for 2000 milliseconds for the task to be executed
                    await timeout(2000)

                    const query: IQuery = new Query()
                    query.addFilter({ _id: patientCreate.id, type: UserType.PATIENT })

                    const result = await patientRepository.findOne(query)

                    expect(result.external_services.fitbit_status).to.eql(AccessStatusTypes.EXPIRED_TOKEN)

                    done()
                })
                .catch(done)
        })
    })
})

async function deleteAllUsers(doc) {
    return await UserRepoModel.deleteMany(doc)
}
