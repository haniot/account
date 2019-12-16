import { inject, injectable } from 'inversify'
import { IBackgroundTask } from '../../application/port/background.task.interface'
import { Identifier } from '../../di/identifiers'
import { IEventBus } from '../../infrastructure/port/event.bus.interface'
import { ILogger } from '../../utils/custom.logger'
import { Default } from '../../utils/default'
import fs from 'fs'
import { FitbitLastSyncEvent } from '../../application/integration-event/event/fitbit.last.sync.event'
import { FitbitLastSyncEventHandler } from '../../application/integration-event/handler/fitbit.last.sync.event.handler'
import { DIContainer } from '../../di/di'
import { IPatientRepository } from '../../application/port/patient.repository.interface'
import { FitbitRevokeEvent } from '../../application/integration-event/event/fitbit.revoke.event'
import { FitbitRevokeEventHandler } from '../../application/integration-event/handler/fitbit.revoke.event.handler'
import { FitbitErrorEvent } from '../../application/integration-event/event/fitbit.error.event'
import { FitbitErrorEventHandler } from '../../application/integration-event/handler/fitbit.error.event.handler'

@injectable()
export class SubscribeEventBusTask implements IBackgroundTask {
    constructor(
        @inject(Identifier.RABBITMQ_EVENT_BUS) private readonly _eventBus: IEventBus,
        @inject(Identifier.LOGGER) private readonly _logger: ILogger
    ) {
    }

    public run(): void {
        // To use SSL/TLS, simply mount the uri with the amqps protocol and pass the CA.
        const rabbitUri = process.env.RABBITMQ_URI || Default.RABBITMQ_URI
        const rabbitOptions: any = { sslOptions: { ca: [] } }
        if (rabbitUri.indexOf('amqps') === 0) {
            rabbitOptions.sslOptions.ca = [fs.readFileSync(process.env.RABBITMQ_CA_PATH || Default.RABBITMQ_CA_PATH)]
        }
        // It subscribe events
        this._eventBus
            .connectionSub
            .open(rabbitUri, rabbitOptions)
            .then((conn) => {
                this.subscribeEvents()
                this._logger.info('Connection with subscribe event opened successful!')
            })
            .catch(err => {
                this._logger.error(`Error trying to get connection to Event Bus for event subscribing. ${err.message}`)
            })
    }

    public async stop(): Promise<void> {
        try {
            await this._eventBus.dispose()
        } catch (err) {
            return Promise.reject(new Error(`Error stopping SubscribeEventBusTask! ${err.message}`))
        }
    }

    /**
     *  Before performing the subscribe is trying to connect to the bus.
     *  If there is no connection, infinite attempts will be made until
     *  the connection is established successfully. Once you have the
     *  connection, events subscribe is performed.
     */
    private subscribeEvents(): void {
        try {
            /**
             * Subscribe in FitbitLastSyncEvent
             */
            const fitbitLastSyncEvent = new FitbitLastSyncEvent(new Date())
            const fitbitLastSyncEventHandler = new FitbitLastSyncEventHandler(
                DIContainer.get<IPatientRepository>(Identifier.PATIENT_REPOSITORY), this._logger)
            this._eventBus
                .subscribe(fitbitLastSyncEvent, fitbitLastSyncEventHandler, 'fitbit.lastsync')
                .then((result: boolean) => {
                    if (result) this._logger.info('Subscribe in FitbitLastSyncEvent successful!')
                })
                .catch(err => {
                    this._logger.error(`Error in Subscribe FitbitLastSyncEvent! ${err.message}`)
                })

            /**
             * Subscribe in FitbitErrorEvent
             */
            const fitbitErrorEvent = new FitbitErrorEvent(new Date())
            const fitbitErrorEventHandler = new FitbitErrorEventHandler(
                DIContainer.get<IPatientRepository>(Identifier.PATIENT_REPOSITORY), this._logger)
            this._eventBus
                .subscribe(fitbitErrorEvent, fitbitErrorEventHandler, 'fitbit.error')
                .then((result: boolean) => {
                    if (result) this._logger.info('Subscribe in FitbitErrorEvent successful!')
                })
                .catch(err => {
                    this._logger.error(`Error in Subscribe FitbitErrorEvent! ${err.message}`)
                })

            /**
             * Subscribe in FitbitRevokeEvent
             */
            const fitbitRevokeEvent = new FitbitRevokeEvent(new Date())
            const fitbitRevokeEventHandler = new FitbitRevokeEventHandler(
                DIContainer.get<IPatientRepository>(Identifier.PATIENT_REPOSITORY), this._logger)
            this._eventBus
                .subscribe(fitbitRevokeEvent, fitbitRevokeEventHandler, 'fitbit.revoke')
                .then((result: boolean) => {
                    if (result) this._logger.info('Subscribe in FitbitRevokeEvent successful!')
                })
                .catch(err => {
                    this._logger.error(`Error in Subscribe FitbitRevokeEvent! ${err.message}`)
                })
        } catch (err) {
            this._logger.error(`Error trying to get connection to Event Bus for event subscribe. ${err.message}`)
        }
    }
}
