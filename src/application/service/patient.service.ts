import { inject, injectable } from 'inversify'
import { Identifier } from '../../di/identifiers'
import { IQuery } from '../port/query.interface'
import { UserType } from '../domain/utils/user.type'
import { ObjectIdValidator } from '../domain/validator/object.id.validator'
import { IPatientService } from '../port/patient.service.interface'
import { IPatientRepository } from '../port/patient.repository.interface'
import { CreatePatientValidator } from '../domain/validator/create.patient.validator'
import { Patient } from '../domain/model/patient'
import { UpdatePatientValidator } from '../domain/validator/update.patient.validator'
import { Strings } from '../../utils/strings'
import { IUserRepository } from '../port/user.repository.interface'
import { ConflictException } from '../domain/exception/conflict.exception'
import { IEventBus } from '../../infrastructure/port/event.bus.interface'
import { IIntegrationEventRepository } from '../port/integration.event.repository.interface'
import { ILogger } from '../../utils/custom.logger'
import { IntegrationEvent } from '../integration-event/event/integration.event'
import { User } from '../domain/model/user'
import { Email } from '../domain/model/email'
import { Default } from '../../utils/default'
import { EmailWelcomeEvent } from '../integration-event/event/email.welcome.event'

@injectable()
export class PatientService implements IPatientService {
    constructor(
        @inject(Identifier.PATIENT_REPOSITORY) private readonly _patientRepository: IPatientRepository,
        @inject(Identifier.USER_REPOSITORY) private readonly _userRepository: IUserRepository,
        @inject(Identifier.RABBITMQ_EVENT_BUS) private readonly _eventBus: IEventBus,
        @inject(Identifier.INTEGRATION_EVENT_REPOSITORY) private readonly _integrationEventRepo: IIntegrationEventRepository,
        @inject(Identifier.LOGGER) private readonly _logger: ILogger
    ) {
    }

    public async add(item: Patient): Promise<Patient> {
        try {
            CreatePatientValidator.validate(item)
            let passwordWithoutCrypt: string | undefined
            if (item.password) passwordWithoutCrypt = item.password

            if (item.email) {
                const exists = await this._userRepository.checkExistByEmail(item.email)
                if (exists) throw new ConflictException(Strings.USER.EMAIL_ALREADY_REGISTERED)
            }

            const result: Patient = await this._patientRepository.create(item)
            if (result && result.email) {
                const mail: Email = new Email().fromJSON({
                    to: {
                        name: item.name,
                        email: item.email
                    },
                    password: passwordWithoutCrypt,
                    action_url: process.env.DASHBOARD_HOST || Default.DASHBOARD_HOST,
                    lang: item.language
                })
                await this.publishEvent(new EmailWelcomeEvent(new Date(), mail), 'emails.welcome')
            }
            return Promise.resolve(result)
        } catch (err) {
            return Promise.reject(err)
        }
    }

    public getAll(query: IQuery): Promise<Array<Patient>> {
        query.addFilter({ type: UserType.PATIENT })
        return this._patientRepository.find(query)
    }

    public getById(id: string, query: IQuery): Promise<Patient> {
        try {
            ObjectIdValidator.validate(id)
            query.addFilter({ _id: id, type: UserType.PATIENT })
            return this._patientRepository.findOne(query)
        } catch (err) {
            return Promise.reject(err)
        }
    }

    public remove(id: string): Promise<boolean> {
        try {
            ObjectIdValidator.validate(id)
            return this._patientRepository.delete(id)
        } catch (err) {
            return Promise.reject(err)
        }
    }

    public async update(item: Patient): Promise<Patient> {
        try {
            UpdatePatientValidator.validate(item)
            if (item.email) {
                const exists = await this._userRepository.checkExistByEmail(item.email)
                if (exists) throw new ConflictException(Strings.USER.EMAIL_ALREADY_REGISTERED)
            }
            item.last_login = undefined
            return this._patientRepository.update(item)
        } catch (err) {
            return Promise.reject(err)
        }
    }

    public count(): Promise<number> {
        return this._patientRepository.count()
    }

    public async publishEvent(event: IntegrationEvent<User>, routingKey: string): Promise<void> {
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
