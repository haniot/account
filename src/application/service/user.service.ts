import { inject, injectable } from 'inversify'
import { IUserService } from '../port/user.service.interface'
import { Identifier } from '../../di/identifiers'
import { IUserRepository } from '../port/user.repository.interface'
import { IQuery } from '../port/query.interface'
import { User } from '../domain/model/user'
import { ObjectIdValidator } from '../domain/validator/object.id.validator'
import { IPilotStudyRepository } from '../port/pilot.study.repository.interface'
import { Query } from '../../infrastructure/repository/query/query'
import { PilotStudy } from '../domain/model/pilot.study'
import { UserType } from '../domain/utils/user.type'
import { IEventBus } from '../../infrastructure/port/event.bus.interface'
import { IntegrationEvent } from '../integration-event/event/integration.event'
import { IIntegrationEventRepository } from '../port/integration.event.repository.interface'
import { ILogger } from '../../utils/custom.logger'
import { UserDeleteEvent } from '../integration-event/event/user.delete.event'
import { ValidationException } from '../domain/exception/validation.exception'

/**
 * Implementing User Service.
 *
 * @implements {IUserService}
 */
@injectable()
export class UserService implements IUserService {
    constructor(
        @inject(Identifier.USER_REPOSITORY) private readonly _userRepository: IUserRepository,
        @inject(Identifier.PILOT_STUDY_REPOSITORY) private readonly _pilotStudyRepository: IPilotStudyRepository,
        @inject(Identifier.RABBITMQ_EVENT_BUS) private readonly _eventBus: IEventBus,
        @inject(Identifier.INTEGRATION_EVENT_REPOSITORY) private readonly _integrationEventRepo: IIntegrationEventRepository,
        @inject(Identifier.LOGGER) private readonly _logger: ILogger
    ) {
    }

    /**
     * Remove the user according to their unique identifier.
     *
     * @param id - Unique identifier.
     * @return {Promise<boolean>}
     * @throws {ValidationException | RepositoryException}
     */
    public async remove(id: string): Promise<boolean> {
        try {
            ObjectIdValidator.validate(id)
            const user: User = await this._userRepository.findOne(new Query().fromJSON({ filters: { _id: id } }))

            if (user && user.type === UserType.ADMIN && user.protected) {
                throw new ValidationException(
                    'The operation could not be completed as the user in question cannot be removed.'
                )
            }

            const result: boolean = await this._userRepository.delete(id)
            if (result) {
                if (user && user.type !== UserType.ADMIN) {
                    const query: Query = new Query()
                    query.addFilter(user.type === UserType.PATIENT ? { patients: user.id } : { health_professionals: user.id })
                    const pilots: Array<PilotStudy> = await this._pilotStudyRepository.find(query)

                    await pilots.forEach(async pilot => {
                        await this._pilotStudyRepository.disassociateUser(pilot.id!, user.id!, user.type!)
                    })
                }
                await this.publishEvent(new UserDeleteEvent(new Date(), user), 'users.delete')
            }
            return Promise.resolve(result)
        } catch (err) {
            return Promise.reject(err)
        }
    }

    public add(item: User): Promise<User> {
        throw Error('Not implemented!')
    }

    public getAll(query: IQuery): Promise<Array<User>> {
        throw Error('Not implemented!')
    }

    public getById(id: string, query: IQuery): Promise<User> {
        throw Error('Not implemented!')
    }

    public update(item: User): Promise<User> {
        throw Error('Not implemented!')
    }

    private async publishEvent(event: IntegrationEvent<User>, routingKey: string): Promise<void> {
        try {
            const successPublish = await this._eventBus.publish(event, routingKey)
            if (!successPublish) throw new Error('')
            this._logger.info(`User with ID: ${event.toJSON().user.id} has been deleted and published on event bus...`)
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
