/**
 * Implementing auth Service.
 *
 */
import { inject, injectable } from 'inversify'
import { Identifier } from '../../di/identifiers'
import { IAuthService } from '../port/auth.service.interface'
import { IAuthRepository } from '../port/auth.repository.interface'
import { AuthValidator } from '../domain/validator/auth.validator'
import { IUserRepository } from '../port/user.repository.interface'
import { IntegrationEvent } from '../integration-event/event/integration.event'
import { IEventBus } from '../../infrastructure/port/event.bus.interface'
import { IIntegrationEventRepository } from '../port/integration.event.repository.interface'
import { EmailValidator } from '../domain/validator/email.validator'
import { User } from '../domain/model/user'
import { Email } from '../domain/model/email'
import { EmailResetPasswordEvent } from '../integration-event/event/email.reset.password.event'
import { ILogger } from '../../utils/custom.logger'
import { Default } from '../../utils/default'
import { ChangePasswordValidator } from '../domain/validator/change.password.validator'
import { ResetPasswordValidator } from '../domain/validator/reset.password.validator'
import { EmailUpdatePasswordEvent } from '../integration-event/event/email.update.password.event'

@injectable()
export class AuthService implements IAuthService {

    constructor(
        @inject(Identifier.AUTH_REPOSITORY) private readonly _authRepository: IAuthRepository,
        @inject(Identifier.USER_REPOSITORY) private readonly _userRepository: IUserRepository,
        @inject(Identifier.RABBITMQ_EVENT_BUS) private readonly _eventBus: IEventBus,
        @inject(Identifier.INTEGRATION_EVENT_REPOSITORY) private readonly _integrationEventRepo: IIntegrationEventRepository,
        @inject(Identifier.LOGGER) private readonly _logger: ILogger
    ) {
    }

    public async authenticate(email: string, password: string): Promise<object> {
        AuthValidator.validate(email, password)
        const result: object = await this._authRepository.authenticate(email, password)
        if (result) await this._userRepository.updateLastLogin(email)
        return Promise.resolve(result)
    }

    public async forgotPassword(email: string): Promise<object> {
        try {
            const host: string = process.env.DASHBOARD_HOST || Default.DASHBOARD_HOST
            EmailValidator.validate(email)
            const result: User = await this._authRepository.resetPassword(email)
            if (result) {
                const mail: Email = new Email().fromJSON({
                    to: {
                        name: result.name,
                        email: result.email
                    },
                    action_url: `${host}/${result.language}/password-reset?token=${result.reset_password_token}`,
                    lang: result.language
                })
                await this.publishEvent(new EmailResetPasswordEvent(new Date(), mail), 'emails.reset-password')
            }
            return Promise.resolve({
                message: `If a matching account is found, an email has been sent to ${email} to allow you to reset your password.`
            })
        } catch (err) {
            return Promise.reject(err)
        }
    }

    public async changePassword(email: string, old_password: string, new_password: string, token: string): Promise<boolean> {
        try {
            EmailValidator.validate(email)
            const isValid: boolean = await this._authRepository.validateToken(token)
            if (!isValid) return Promise.resolve(false)
            const payload = await this._authRepository.getTokenPayload(token)
            if (!payload.reset_password) {
                ChangePasswordValidator.validate(email, old_password, new_password)
                return this._userRepository.changePassword(email, old_password, new_password)
            }
            ResetPasswordValidator.validate(email, new_password)
            const encryptPassword: string = await this._userRepository.encryptPassword(new_password)
            const result = await this._authRepository.updatePassword(payload.sub, email, encryptPassword, token)
            if (result) {
                const mail: Email = new Email().fromJSON({
                    to: {
                        name: result.name,
                        email: result.email
                    },
                    action_url: process.env.DASHBOARD_HOST || Default.DASHBOARD_HOST,
                    lang: result.language
                })
                await this.publishEvent(new EmailUpdatePasswordEvent(new Date(), mail), 'emails.update-password')
            }
            return Promise.resolve(!!result)
        } catch (err) {
            return Promise.reject(err)
        }
    }

    private async publishEvent(event: IntegrationEvent<Email>, routingKey: string): Promise<void> {
        try {
            const successPublish = await this._eventBus.publish(event, routingKey)
            if (!successPublish) throw new Error('')
            this._logger.info(`User with email: ${event.toJSON().email.to.email} has been successful ` +
                `${routingKey.split('.')[1]} request and published on event bus...`)
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
