import { Container, inject, injectable } from 'inversify'
import { Identifier } from '../di/identifiers'
import { IDBConnection } from '../infrastructure/port/db.connection.interface'
import { CustomLogger } from '../utils/custom.logger'
import { RegisterDefaultAdminTask } from './register.default.admin.task'
import { DI } from '../di/di'

@injectable()
export class BackgroundService {
    private readonly _diContainer: Container

    constructor(
        @inject(Identifier.MONGODB_CONNECTION) private _mongodb: IDBConnection,
        @inject(Identifier.LOGGER) private _logger: CustomLogger
    ) {
        this._diContainer = DI.getInstance().getContainer()
    }

    public async startServices(): Promise<void> {
        this._logger.debug('startServices()')
        try {
            /**
             * At the time the application goes up, an event is issued if the
             * database is connected, and in this case, a task is run to check
             * if there are registered admin users.
             */
            this._mongodb.eventConnection.on('connected', () => {
                const registerDefaultAdminTask: RegisterDefaultAdminTask =
                    new RegisterDefaultAdminTask(this._diContainer.get(Identifier.USER_REPOSITORY), this._logger)
                registerDefaultAdminTask.run()
            })

            await this._mongodb.tryConnect() // Initialize mongodb

            /**
             * Register your events using the event bus instance here.
             */
        } catch (err) {
            this._logger.error('Error initializing services in background: '.concat(err.message))
        }
    }

    public async stopServices(): Promise<void> {
        this._logger.debug('stopServices()')
        try {
            await this._mongodb.dispose()
        } catch (err) {
            this._logger.error('Error stopping background services: '.concat(err.message))
        }
    }
}
