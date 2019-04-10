import { Container, inject, injectable } from 'inversify'
import { Identifier } from '../di/identifiers'
import { IConnectionDB } from '../infrastructure/port/connection.db.interface'
import { DI } from '../di/di'
import { RegisterDefaultAdminTask } from './task/register.default.admin.task'

@injectable()
export class BackgroundService {

    private container: Container

    constructor(
        @inject(Identifier.MONGODB_CONNECTION) private readonly _mongodb: IConnectionDB
    ) {
        this.container = DI.getInstance().getContainer()
    }

    public async startServices(): Promise<void> {
        try {
            /**
             * At the time the application goes up, an event is issued if the
             * database is connected, and in this case, a task is run to check
             * if there are registered admin users.
             */
            await new RegisterDefaultAdminTask(this._mongodb,
                this.container.get(Identifier.ADMIN_REPOSITORY),
                this.container.get(Identifier.LOGGER)
            ).run()

            /**
             * Trying to connect to mongodb.
             * Go ahead only when the run is resolved.
             * Since the application depends on the database connection to work.
             */
            await this._mongodb.tryConnect(0, 1000)
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
