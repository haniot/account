import { IAdminService } from '../port/admin.service.interface'
import { inject, injectable } from 'inversify'
import { Identifier } from '../../di/identifiers'
import { IAdminRepository } from '../port/admin.repository.interface'
import { IQuery } from '../port/query.interface'
import { Admin } from '../domain/model/admin'
import { CreateAdminValidator } from '../domain/validator/create.admin.validator'
import { UserType } from '../domain/utils/user.type'
import { ObjectIdValidator } from '../domain/validator/object.id.validator'
import { UpdateAdminValidator } from '../domain/validator/update.admin.validator'
import { IUserRepository } from '../port/user.repository.interface'
import { Strings } from '../../utils/strings'
import { ConflictException } from '../domain/exception/conflict.exception'
import { IPilotStudyRepository } from '../port/pilot.study.repository.interface'
import { IntegrationEvent } from '../integration-event/event/integration.event'
import { User } from '../domain/model/user'
import { IEventBus } from '../../infrastructure/port/event.bus.interface'
import { IIntegrationEventRepository } from '../port/integration.event.repository.interface'
import { ILogger } from '../../utils/custom.logger'
import { EmailWelcomeEvent } from '../integration-event/event/email.welcome.event'
import { Email } from '../domain/model/email'
import { Default } from '../../utils/default'

@injectable()
export class AdminService implements IAdminService {
    constructor(
        @inject(Identifier.ADMIN_REPOSITORY) private readonly _adminRepository: IAdminRepository,
        @inject(Identifier.USER_REPOSITORY) private readonly _userRepository: IUserRepository,
        @inject(Identifier.PILOT_STUDY_REPOSITORY) private readonly _pilotStudyRepository: IPilotStudyRepository,
        @inject(Identifier.RABBITMQ_EVENT_BUS) private readonly _eventBus: IEventBus,
        @inject(Identifier.INTEGRATION_EVENT_REPOSITORY) private readonly _integrationEventRepo: IIntegrationEventRepository,
        @inject(Identifier.LOGGER) private readonly _logger: ILogger
    ) {
    }

    public async add(item: Admin): Promise<Admin> {
        try {
            CreateAdminValidator.validate(item)
            const exists = await this._userRepository.checkExistByEmail(item.email)
            if (exists) throw new ConflictException(Strings.USER.EMAIL_ALREADY_REGISTERED)
            const result: Admin = await this._adminRepository.create(item)
            if (result) {
                const mail: Email = new Email().fromJSON({
                    to: {
                        name: item.name,
                        email: item.email
                    },
                    password: item.password,
                    action_url: process.env.DASHBOARD_HOST || Default.DASHBOARD_HOST,
                    lang: item.language
                })
                await this.publishEvent(new EmailWelcomeEvent(new Date(), mail), 'emails.welcome')
            }
            return Promise.resolve(this.addReadOnlyInformation(result))
        } catch (err) {
            return Promise.reject(err)
        }
    }

    public async getAll(query: IQuery): Promise<Array<Admin>> {
        query.addFilter({ type: UserType.ADMIN })
        const result = await this._adminRepository.find(query)
        return Promise.resolve(this.addMultipleReadOnlyInformation(result))
    }

    public async getById(id: string, query: IQuery): Promise<Admin> {
        try {
            ObjectIdValidator.validate(id)
            query.addFilter({ _id: id, type: UserType.ADMIN })

            const result: Admin = await this._adminRepository.findOne(query)
            return Promise.resolve(this.addReadOnlyInformation(result))
        } catch (err) {
            return Promise.reject(err)
        }
    }

    public remove(id: string): Promise<boolean> {
        try {
            ObjectIdValidator.validate(id)
            return this._adminRepository.delete(id)
        } catch (err) {
            return Promise.reject(err)
        }
    }

    public async update(item: Admin): Promise<Admin> {
        try {
            UpdateAdminValidator.validate(item)
            if (item.email) {
                const exists = await this._userRepository.checkExistByEmail(item.email)
                if (exists) throw new ConflictException(Strings.USER.EMAIL_ALREADY_REGISTERED)
            }
            item.last_login = undefined
            const result = await this._adminRepository.update(item)
            return Promise.resolve(this.addReadOnlyInformation(result))
        } catch (err) {
            return Promise.reject(err)
        }
    }

    public count(): Promise<number> {
        return this._adminRepository.count()
    }

    private async addMultipleReadOnlyInformation(item: Array<Admin>): Promise<Array<Admin>> {
        if (item && item.length) {
            try {
                for (let i = 0; i < item.length; i++) item[i] = await this.addReadOnlyInformation(item[i])
            } catch (err) {
                return Promise.reject(err)
            }
        }
        return Promise.resolve(item)
    }

    private async addReadOnlyInformation(item: Admin): Promise<Admin> {
        if (item) {
            try {
                item.total_admins = await this._userRepository.countAdmins()
                item.total_health_professionals = await this._userRepository.countHealthProfessionals()
                item.total_patients = await this._userRepository.countPatients()
                item.total_pilot_studies = await this._pilotStudyRepository.count()
            } catch (err) {
                return Promise.reject(err)
            }
        }
        return item
    }

    private async publishEvent(event: IntegrationEvent<User>, routingKey: string): Promise<void> {
        try {
            const successPublish = await this._eventBus.publish(event, routingKey)
            if (!successPublish) throw new Error('')
            this._logger.info(`User with email: ${event.toJSON().email.to.email} has been saved and published on event bus...`)
        } catch (err) {
            const saveEvent: any = event.toJSON()
            this._integrationEventRepo.create({
                ...saveEvent,
                __routing_key: routingKey,
                __operation: 'publish'
            })
                .then(() => {
                    this._logger.warn(`Could not publish the event named ${event.event_name}.`
                        .concat(` The event was saved in the database for a possible recovery.`))
                })
                .catch(err => {
                    this._logger.error(`There was an error trying to save the name event: ${event.event_name}.`
                        .concat(`Error: ${err.message}. Event: ${JSON.stringify(saveEvent)}`))
                })
        }
    }
}
