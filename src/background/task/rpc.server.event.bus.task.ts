import { inject, injectable } from 'inversify'
import { Identifier } from '../../di/identifiers'
import { IEventBus } from '../../infrastructure/port/event.bus.interface'
import { ILogger } from '../../utils/custom.logger'
import { IBackgroundTask } from '../../application/port/background.task.interface'
import { IPatientRepository } from '../../application/port/patient.repository.interface'
import { IHealthProfessionalRepository } from '../../application/port/health.professional.repository.interface'
import { IAdminRepository } from '../../application/port/admin.repository.interface'
import { UserType } from '../../application/domain/utils/user.type'
import { Query } from '../../infrastructure/repository/query/query'
import qs from 'query-strings-parser'
import { IPilotStudyRepository } from '../../application/port/pilot.study.repository.interface'

@injectable()
export class RpcServerEventBusTask implements IBackgroundTask {
    constructor(
        @inject(Identifier.RABBITMQ_EVENT_BUS) private readonly _eventBus: IEventBus,
        @inject(Identifier.PATIENT_REPOSITORY) private readonly _patientRepo: IPatientRepository,
        @inject(Identifier.HEALTH_PROFESSIONAL_REPOSITORY) private readonly _healthRepo: IHealthProfessionalRepository,
        @inject(Identifier.ADMIN_REPOSITORY) private readonly _adminRepo: IAdminRepository,
        @inject(Identifier.PILOT_STUDY_REPOSITORY) private readonly _pilotRepo: IPilotStudyRepository,
        @inject(Identifier.LOGGER) private readonly _logger: ILogger
    ) {
    }

    public run(): void {
        // It RPC Server events, that for some reason could not
        // e sent and were saved for later submission.
        this._eventBus
            .connectionRpcServer
            .open(0, 2000)
            .then(() => {
                this._logger.info('Connection with RPC Server opened successful!')
                this.initializeServer()
            })
            .catch(err => {
                this._logger.error(`Error trying to get connection to Event Bus for RPC Server. ${err.message}`)
            })
    }

    public async stop(): Promise<void> {
        try {
            await this._eventBus.dispose()
        } catch (err) {
            return Promise.reject(new Error(`Error stopping RPC Server! ${err.message}`))
        }
    }

    private initializeServer(): void {
        this._eventBus
            .provideResource('users.find', (_query?: string, userType?: string) => {
                const query: Query = new Query().fromJSON({ ...qs.parser(_query), type: userType })
                switch (userType) {
                    case(UserType.ADMIN):
                        return this._adminRepo.find(query)
                    case(UserType.HEALTH_PROFESSIONAL):
                        return this._healthRepo.find(query)
                    case(UserType.PATIENT):
                        return this._patientRepo.find(query)
                    default:
                        return new Error('User Type param is required. The mapped values are: admin, ' +
                            'health_professional, patient.')
                }
            })
            .then(() => this._logger.info('Resource users.find successful registered'))
            .catch((err) => this._logger.error(`Error at register resource users.find: ${err.message}`))

        this._eventBus
            .provideResource('pilotstudies.get', (_query?: string) => {
                const query: Query = new Query().fromJSON({ ...qs.parser(_query) })
                return this._pilotRepo.findAndPopulate(query)
            })
            .then(() => this._logger.info('Resource pilotstudies.get successful registered'))
            .catch((err) => this._logger.error(`Error at register resource pilotstudies.get: ${err.message}`))
    }
}
