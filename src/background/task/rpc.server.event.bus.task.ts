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
import { IPilotStudyRepository } from '../../application/port/pilot.study.repository.interface'
import qs from 'query-strings-parser'
import { IUserRepository } from '../../application/port/user.repository.interface'
import { User } from '../../application/domain/model/user'
import { Admin } from '../../application/domain/model/admin'
import { HealthProfessional } from '../../application/domain/model/health.professional'
import { Patient } from '../../application/domain/model/patient'
import { Default } from '../../utils/default'
import fs from 'fs'
import { IQuery } from '../../application/port/query.interface'

@injectable()
export class RpcServerEventBusTask implements IBackgroundTask {
    constructor(
        @inject(Identifier.RABBITMQ_EVENT_BUS) private readonly _eventBus: IEventBus,
        @inject(Identifier.PATIENT_REPOSITORY) private readonly _patientRepo: IPatientRepository,
        @inject(Identifier.HEALTH_PROFESSIONAL_REPOSITORY) private readonly _healthRepo: IHealthProfessionalRepository,
        @inject(Identifier.ADMIN_REPOSITORY) private readonly _adminRepo: IAdminRepository,
        @inject(Identifier.USER_REPOSITORY) private readonly _userRepo: IUserRepository,
        @inject(Identifier.PILOT_STUDY_REPOSITORY) private readonly _pilotRepo: IPilotStudyRepository,
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
        // It RPC Server events, that for some reason could not
        // e sent and were saved for later submission.
        this._eventBus
            .connectionRpcServer
            .open(rabbitUri, rabbitOptions)
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
            .provideResource('users.find', async (_query?: string) => {
                // const query: Query = new Query().fromJSON({ ...qs.parser(_query) })
                const query: IQuery = this.buildQS(_query)
                const userType: string = query.toJSON().filters.type
                if (!userType) {
                    const users: Array<User> = await this._userRepo.find(query)
                    return users.map(item => item.toJSON())
                }
                switch (userType) {
                    case(UserType.ADMIN):
                        const admins: Array<Admin> = await this._adminRepo.find(query)
                        return admins.map(item => item.toJSON())
                    case(UserType.HEALTH_PROFESSIONAL):
                        const healths: Array<HealthProfessional> = await this._healthRepo.find(query)
                        return healths.map(item => item.toJSON())
                    case(UserType.PATIENT):
                        const patients: Array<Patient> = await this._patientRepo.find(query)
                        return patients.map(item => item.toJSON())
                    default:
                        return new Error('User Type param is required. The mapped values are: admin, ' +
                            'health_professional, patient.')
                }
            })
            .then(() => this._logger.info('Resource users.find successful registered'))
            .catch((err) => this._logger.error(`Error at register resource users.find: ${err.message}`))

        this._eventBus
            .provideResource('pilotstudies.findone', async (pilotId?: string) => {
                if (!(/^[a-fA-F0-9]{24}$/.test(pilotId!))) throw new Error('Invalid pilot id!')
                const query: IQuery = new Query().fromJSON({ filters: { _id: pilotId } })
                const result = await this._pilotRepo.findOneAndPopulate(query)
                return result ? { ...result.toJSON(), patients: result.patients!.map(patient => patient.toJSON()) } : {}
            })
            .then(() => this._logger.info('Resource pilotstudies.findone successful registered'))
            .catch((err) => {
                this._logger.error(`Error at register resource pilotstudies.findone: ${err.message}`)
                return new Error(err.message)
            })
    }

    /**
     * Prepare query string based on defaults parameters and values.
     *
     * @param query
     * @param dateField
     */
    private buildQS(query?: any, dateField?: string): IQuery {
        return new Query().fromJSON(
            qs.parser(query ? query : {}, { pagination: { limit: Number.MAX_SAFE_INTEGER } },
                { use_page: true, date_fields: { start_at: dateField, end_at: dateField } })
        )
    }
}
