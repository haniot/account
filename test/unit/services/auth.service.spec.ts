import { assert } from 'chai'
import { AuthService } from '../../../src/application/service/auth.service'
import { AuthRepositoryMock } from '../../mocks/repositories/auth.repository.mock'
import { DefaultEntityMock } from '../../mocks/models/default.entity.mock'
import { UserRepositoryMock } from '../../mocks/repositories/user.repository.mock'
import { User } from '../../../src/application/domain/model/user'
import { EventBusRabbitMQMock } from '../../mocks/eventbus/eventbus.rabbitmq.mock'
import { CustomLoggerMock } from '../../mocks/custom.logger.mock'
import { IntegrationEventRepositoryMock } from '../../mocks/repositories/integration.event.repository.mock'
import { JwtRepositoryMock } from '../../mocks/repositories/jwt.repository.mock'

describe('Services: AuthService', () => {
    const service = new AuthService(
        new AuthRepositoryMock(),
        new UserRepositoryMock(),
        new EventBusRabbitMQMock(),
        new IntegrationEventRepositoryMock(),
        new CustomLoggerMock()
    )

    const user: User = new User().fromJSON(DefaultEntityMock.USER)

    describe('authenticate()', () => {
        context('when authenticate a user', () => {
            it('should return a authentication token', () => {
                return service.authenticate(user.email!, user.password!)
                    .then(res => {
                        assert.propertyVal(res, 'access_token', 'token')
                    })

            })
        })

        context('when the authentication is not successful', () => {
            it('should not update the last login', () => {
                return service.authenticate('any@mail.com', '123')
                    .then(res => {
                        assert.isUndefined(res)
                    })
            })
        })
    })

    describe('forgotPassword()', () => {
        context('when make a forgot password request', () => {
            it('should return a message', () => {
                return service.forgotPassword(user.email!)
                    .then(res => {
                        assert.propertyVal(res, 'message', 'If a matching account is found, an email has been ' +
                            `sent to ${user.email} to allow you to reset your password.`)
                    })
            })
        })

        context('when the request is not successful', () => {
            it('should return a message', () => {
                return service.forgotPassword('another@mail.com')
                    .then(res => {
                        assert.propertyVal(res, 'message', 'If a matching account is found, an email has been ' +
                            'sent to another@mail.com to allow you to reset your password.')
                    })
            })
        })

        context('when the email is invalid', () => {
            it('should reject an error for invalid email', () => {
                return service.forgotPassword('invalid')
                    .catch(err => {
                        assert.propertyVal(err, 'message', 'Invalid email address!')
                    })
            })
        })
    })

    describe('changePassword()', () => {
        context('when change the password', () => {
            it('should return true', async () => {
                const token: string = await JwtRepositoryMock.generateResetPasswordToken(user, false)
                return service.changePassword(user.email!, user.password!, user.password!, token)
                    .then(res => {
                        assert.isTrue(res)
                    })
            })
        })

        context('when reset the password', () => {
            it('should return true', async () => {
                const token: string = await JwtRepositoryMock.generateResetPasswordToken(user, true)
                return service.changePassword(user.email!, user.password!, user.password!, token)
                    .then(res => {
                        assert.isTrue(res)
                    })
            })
        })

        context('when the user is not founded', () => {
            it('should return true', async () => {
                const token: string = await JwtRepositoryMock.generateResetPasswordToken(user, true)
                return service.changePassword('another@mail.com', user.password!, user.password!, token)
                    .then(res => {
                        assert.isFalse(res)
                    })
            })
        })

        context('when there are validation errors', () => {
            it('should reject an error for invalid email', () => {
                return service.changePassword('invalid', user.password!, user.password!, 'token')
                    .catch(err => {
                        assert.propertyVal(err, 'message', 'Invalid email address!')
                    })
            })

            it('should reject an error for invalid token', () => {
                return service.changePassword(user.email!, user.password!, user.password!, 'invalidtoken')
                    .catch(err => {
                        assert.propertyVal(err, 'message', 'Invalid password reset token!')
                        assert.propertyVal(err, 'description', 'Token probably expired or already used. You can ' +
                            'only use the reset token once while it is within its validity period.')
                    })
            })
        })
    })
})
