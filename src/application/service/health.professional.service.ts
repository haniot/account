import { IHealthProfessionalService } from '../port/health.professional.service.interface'
import { inject, injectable } from 'inversify'
import { HealthProfessional } from '../domain/model/health.professional'
import { IQuery } from '../port/query.interface'
import { Identifier } from '../../di/identifiers'
import { IHealthProfessionalRepository } from '../port/health.professional.repository.interface'
import { CreateHealthProfessionalValidator } from '../domain/validator/create.health.professional.validator'
import { UserType } from '../domain/utils/user.type'
import { ObjectIdValidator } from '../domain/validator/object.id.validator'
import { UpdateHealthProfessionalValidator } from '../domain/validator/update.health.professional.validator'
import { Strings } from '../../utils/strings'
import { IUserRepository } from '../port/user.repository.interface'
import { ConflictException } from '../domain/exception/conflict.exception'
import { IPilotStudyRepository } from '../port/pilot.study.repository.interface'
import { IntegrationEvent } from '../integration-event/event/integration.event'
import { User } from '../domain/model/user'
import { IEventBus } from '../../infrastructure/port/event.bus.interface'
import { IIntegrationEventRepository } from '../port/integration.event.repository.interface'
import { ILogger } from '../../utils/custom.logger'
import { EmailWelcomeEvent } from '../integration-event/event/email.welcome.event'
import { Email } from '../domain/model/email'

@injectable()
export class HealthProfessionalService implements IHealthProfessionalService {
    constructor(
        @inject(Identifier.HEALTH_PROFESSIONAL_REPOSITORY) private readonly _healthProfessionalRepository:
            IHealthProfessionalRepository,
        @inject(Identifier.USER_REPOSITORY) private readonly _userRepository: IUserRepository,
        @inject(Identifier.PILOT_STUDY_REPOSITORY) private readonly _pilotStudyRepository: IPilotStudyRepository,
        @inject(Identifier.RABBITMQ_EVENT_BUS) private readonly _eventBus: IEventBus,
        @inject(Identifier.INTEGRATION_EVENT_REPOSITORY) private readonly _integrationEventRepo: IIntegrationEventRepository,
        @inject(Identifier.LOGGER) private readonly _logger: ILogger
    ) {
    }

    public async add(item: HealthProfessional): Promise<HealthProfessional> {
        try {
            CreateHealthProfessionalValidator.validate(item)
            const exists = await this._userRepository.checkExistByEmail(item.email)
            if (exists) throw new ConflictException(Strings.USER.EMAIL_ALREADY_REGISTERED)
            const result: HealthProfessional = await this._healthProfessionalRepository.create(item)
            if (result) {
                result.total_pilot_studies = 0
                result.total_patients = 0
                const mail: Email = new Email().fromJSON({
                    to: {
                        name: result.name,
                        email: result.email
                    },
                    password: result.password,
                    lang: result.language
                })
                await this.publishEvent(new EmailWelcomeEvent(new Date(), mail), 'emails.welcome')
            }
            return Promise.resolve(result)
        } catch (err) {
            return Promise.reject(err)
        }

    }

    public async getAll(query: IQuery): Promise<Array<HealthProfessional>> {
        query.addFilter({ type: UserType.HEALTH_PROFESSIONAL })
        const result: Array<HealthProfessional> = await this._healthProfessionalRepository.find(query)
        return Promise.resolve(await this.addMultipleReadOnlyInformation(result))
    }

    public async getById(id: string, query: IQuery): Promise<HealthProfessional> {
        try {
            ObjectIdValidator.validate(id)
            query.addFilter({ _id: id, type: UserType.HEALTH_PROFESSIONAL })
            const result: HealthProfessional = await this._healthProfessionalRepository.findOne(query)
            return Promise.resolve(await this.addReadOnlyInformation(result))
        } catch (err) {
            return Promise.reject(err)
        }
    }

    public remove(id: string): Promise<boolean> {
        try {
            ObjectIdValidator.validate(id)
        } catch (err) {
            return Promise.reject(err)
        }
        return this._healthProfessionalRepository.delete(id)
    }

    public async update(item: HealthProfessional): Promise<HealthProfessional> {
        try {
            UpdateHealthProfessionalValidator.validate(item)
            if (item.email) {
                const exists = await this._userRepository.checkExistByEmail(item.email)
                if (exists) throw new ConflictException(Strings.USER.EMAIL_ALREADY_REGISTERED)
            }
            item.last_login = undefined
            const result: HealthProfessional = await this._healthProfessionalRepository.update(item)
            return Promise.resolve(this.addReadOnlyInformation(result))
        } catch (err) {
            return Promise.reject(err)
        }
    }

    public count(): Promise<number> {
        return this._healthProfessionalRepository.count()
    }

    private async addMultipleReadOnlyInformation(item: Array<HealthProfessional>): Promise<Array<HealthProfessional>> {
        if (item && item.length) {
            try {
                for (let i = 0; i < item.length; i++) item[i] = await this.addReadOnlyInformation(item[i])
            } catch (err) {
                return Promise.reject(err)
            }
        }
        return Promise.resolve(item)
    }

    private async addReadOnlyInformation(item: HealthProfessional): Promise<HealthProfessional> {
        if (item) {
            try {
                item.total_pilot_studies = await this._pilotStudyRepository.countPilotStudiesFromHealthProfessional(item.id!)
                item.total_patients = await this._pilotStudyRepository.countPatientsFromHealthProfessional(item.id!)
            } catch (err) {
                return Promise.reject(err)
            }
        }
        return Promise.resolve(item)
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
