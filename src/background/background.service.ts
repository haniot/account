import { inject, injectable } from 'inversify'
import { Identifier } from '../di/identifiers'
import { IConnectionDB } from '../infrastructure/port/connection.db.interface'
import { RegisterDefaultAdminTask } from './task/register.default.admin.task'
import { IBackgroundTask } from '../application/port/background.task.interface'
import { IAdminRepository } from '../application/port/admin.repository.interface'
import { ILogger } from '../utils/custom.logger'

@injectable()
export class BackgroundService {

    constructor(
        @inject(Identifier.MONGODB_CONNECTION) private readonly _mongodb: IConnectionDB,
        @inject(Identifier.SUBSCRIBE_EVENT_BUS_TASK) private readonly _subscribeTask: IBackgroundTask,
        @inject(Identifier.PUBLISH_EVENT_BUS_TASK) private readonly _publishTask: IBackgroundTask,
        @inject(Identifier.ADMIN_REPOSITORY) private readonly _adminRepo: IAdminRepository,
        @inject(Identifier.LOGGER) private readonly _logger: ILogger
    ) {
    }

    public async startServices(): Promise<void> {
        try {
            /**
             * At the time the application goes up, an event is issued if the
             * database is connected, and in this case, a task is run to check
             * if there are registered admin users.
             */
            await new RegisterDefaultAdminTask(this._mongodb, this._adminRepo, this._logger).run()

            /**
             * Trying to connect to mongodb.
             * Go ahead only when the run is resolved.
             * Since the application depends on the database connection to work.
             */
            await this._mongodb.tryConnect(0, 1000)

            await this._subscribeTask.run()
            await this._publishTask.run()
        } catch (err) {
            return Promise.reject(new Error(`Error initializing services in background! ${err.message}`))
        }
    }

    public async stopServices(): Promise<void> {
        try {
            await this._mongodb.dispose()
        } catch (err) {
            return Promise.reject(new Error(`Error stopping MongoDB! ${err.message}`))
        }
    }
}
