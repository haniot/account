import { inject, injectable } from 'inversify'
import { IBackgroundTask } from '../../application/port/background.task.interface'
import { Identifier } from '../../di/identifiers'
import { IEventBus } from '../../infrastructure/port/event.bus.interface'
import { ILogger } from '../../utils/custom.logger'
import { FitbitLastSyncEvent } from '../../application/integration-event/event/fitbit.last.sync.event'
import { FitbitLastSyncEventHandler } from '../../application/integration-event/handler/fitbit.last.sync.event.handler'
import { DIContainer } from '../../di/di'
import { IPatientRepository } from '../../application/port/patient.repository.interface'
import { FitbitRevokeEvent } from '../../application/integration-event/event/fitbit.revoke.event'
import { FitbitRevokeEventHandler } from '../../application/integration-event/handler/fitbit.revoke.event.handler'
import { FitbitErrorEvent } from '../../application/integration-event/event/fitbit.error.event'
import { FitbitErrorEventHandler } from '../../application/integration-event/handler/fitbit.error.event.handler'
import { FitbitTokenGrantedEvent } from '../../application/integration-event/event/fitbit.token.granted.event'
import { FitbitTokenGrantedEventHandler } from '../../application/integration-event/handler/fitbit.token.granted.event.handler'

@injectable()
export class SubscribeEventBusTask implements IBackgroundTask {
    constructor(
        @inject(Identifier.RABBITMQ_EVENT_BUS) private readonly _eventBus: IEventBus,
        @inject(Identifier.LOGGER) private readonly _logger: ILogger
    ) {
    }

    public run(): void {
        this.subscribeEvents()
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
            this._eventBus
                .subscribe(new FitbitLastSyncEvent(), new FitbitLastSyncEventHandler(
                    DIContainer.get<IPatientRepository>(Identifier.PATIENT_REPOSITORY), this._logger),
                    FitbitLastSyncEvent.ROUTING_KEY)
                .then((result: boolean) => {
                    if (result) this._logger.info('Subscribe in FitbitLastSyncEvent successful!')
                })
                .catch(err => {
                    this._logger.error(`Error in Subscribe FitbitLastSyncEvent! ${err.message}`)
                })

            /**
             * Subscribe in FitbitErrorEvent
             */
            this._eventBus
                .subscribe(new FitbitErrorEvent(), new FitbitErrorEventHandler(
                    DIContainer.get<IPatientRepository>(Identifier.PATIENT_REPOSITORY), this._logger),
                    FitbitErrorEvent.ROUTING_KEY)
                .then((result: boolean) => {
                    if (result) this._logger.info('Subscribe in FitbitErrorEvent successful!')
                })
                .catch(err => {
                    this._logger.error(`Error in Subscribe FitbitErrorEvent! ${err.message}`)
                })

            /**
             * Subscribe in FitbitRevokeEvent
             */
            this._eventBus
                .subscribe(new FitbitRevokeEvent(), new FitbitRevokeEventHandler(
                    DIContainer.get<IPatientRepository>(Identifier.PATIENT_REPOSITORY), this._logger),
                    FitbitRevokeEvent.ROUTING_KEY)
                .then((result: boolean) => {
                    if (result) this._logger.info('Subscribe in FitbitRevokeEvent successful!')
                })
                .catch(err => {
                    this._logger.error(`Error in Subscribe FitbitRevokeEvent! ${err.message}`)
                })

            /**
             * Subscribe in FitbitTokenGrantedEvent
             */
            this._eventBus
                .subscribe(new FitbitTokenGrantedEvent(), new FitbitTokenGrantedEventHandler(
                    DIContainer.get<IPatientRepository>(Identifier.PATIENT_REPOSITORY), this._logger),
                    FitbitTokenGrantedEvent.ROUTING_KEY)
                .then((result: boolean) => {
                    if (result) this._logger.info('Subscribe in FitbitTokenGrantedEvent successful!')
                })
                .catch(err => {
                    this._logger.error(`Error in Subscribe FitbitTokenGrantedEvent! ${err.message}`)
                })
        } catch (err) {
            this._logger.error(`Error trying to get connection to Event Bus for event subscribe. ${err.message}`)
        }
    }
}
