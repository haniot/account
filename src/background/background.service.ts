import { Container, inject, injectable } from 'inversify'
import { Identifier } from '../di/identifiers'
import { IConnectionDB } from '../infrastructure/port/connection.db.interface'
import { CustomLogger } from '../utils/custom.logger'
import { RegisterDefaultAdminTask } from './task/register.default.admin.task'
import { DI } from '../di/di'

@injectable()
export class BackgroundService {
    private readonly container: Container

    constructor(
        @inject(Identifier.MONGODB_CONNECTION) private _mongodb: IConnectionDB,
        @inject(Identifier.LOGGER) private _logger: CustomLogger
    ) {
        this.container = DI.getInstance().getContainer()
    }

    public async startServices(): Promise<void> {
        this._logger.debug('startServices()')
        try {
            /**
             * At the time the application goes up, an event is issued if the
             * database is connected, and in this case, a task is run to check
             * if there are registered admin users.
             */
            await new RegisterDefaultAdminTask(this._mongodb,
                this.container.get(Identifier.USER_REPOSITORY),
                this.container.get(Identifier.LOGGER)).run()

            /**
             * Trying to connect to mongodb.
             * Go ahead only when the run is resolved.
             * Since the application depends on the database connection to work.
             */
            await this._mongodb.tryConnect(0, 1000) // Initialize mongodb

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
