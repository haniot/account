import { assert } from 'chai'
import { AdminService } from '../../../src/application/service/admin.service'
import { AdminRepositoryMock } from '../../mocks/repositories/admin.repository.mock'
import { Admin } from '../../../src/application/domain/model/admin'
import { DefaultEntityMock } from '../../mocks/models/default.entity.mock'
import { UserRepositoryMock } from '../../mocks/repositories/user.repository.mock'
import { PilotStudyRepositoryMock } from '../../mocks/repositories/pilot.study.repository.mock'
import { Query } from '../../../src/infrastructure/repository/query/query'
import { EventBusRabbitMQMock } from '../../mocks/eventbus/eventbus.rabbitmq.mock'
import { CustomLoggerMock } from '../../mocks/custom.logger.mock'
import { IntegrationEventRepositoryMock } from '../../mocks/repositories/integration.event.repository.mock'

describe('Services: AdminService', () => {
    const service = new AdminService(
        new AdminRepositoryMock(),
        new UserRepositoryMock(),
        new PilotStudyRepositoryMock(),
        new EventBusRabbitMQMock(),
        new IntegrationEventRepositoryMock(),
        new CustomLoggerMock())

    const user: Admin = new Admin().fromJSON(DefaultEntityMock.ADMIN)

    describe('add()', () => {
        context('when want save a new user', () => {
            it('should return the saved user', () => {
                return service.add(user)
                    .then(res => {
                        assert.propertyVal(res, 'id', user.id)
                        assert.propertyVal(res, 'email', user.email)
                        assert.propertyVal(res, 'password', user.password)
                        assert.propertyVal(res, 'birth_date', user.birth_date)
                        assert.propertyVal(res, 'phone_number', user.phone_number)
                        assert.propertyVal(res, 'selected_pilot_study', user.selected_pilot_study)
                        assert.propertyVal(res, 'language', user.language)
                    })
            })
        })

        context('when the user is not saved', () => {
            it('should return undefined', () => {
                user.name = 'Another Name'
                return service.add(user)
                    .then(res => {
                        assert.isUndefined(res)
                        user.name = DefaultEntityMock.ADMIN.name
                    })
            })
        })

        context('when user with email already exists', () => {
            it('should reject an error for user already exist', () => {
                user.email = 'exists@mail.com'
                return service.add(user)
                    .catch(err => {
                        assert.propertyVal(err, 'message', 'A user with this email already registered!')
                        user.email = DefaultEntityMock.ADMIN.email
                    })
            })
        })

        context('when there are validation errors', () => {
            it('should throw an error for invalid parameters', () => {
                user.email = undefined
                return service.add(user)
                    .catch(err => {
                        assert.propertyVal(err, 'message', 'Required fields were not provided...')
                        assert.propertyVal(err, 'description', 'Admin validation: email required!')
                        user.email = DefaultEntityMock.ADMIN.email
                    })
            })
        })
    })

    describe('getAll', () => {
        context('when get a collection of users', () => {
            it('should return a list of users', () => {
                return service.getAll(new Query())
                    .then(res => {
                        assert.isArray(res)
                        assert.lengthOf(res, 1)
                        assert.propertyVal(res[0], 'id', user.id)
                        assert.propertyVal(res[0], 'email', user.email)
                        assert.propertyVal(res[0], 'password', user.password)
                        assert.propertyVal(res[0], 'birth_date', user.birth_date)
                        assert.propertyVal(res[0], 'phone_number', user.phone_number)
                        assert.propertyVal(res[0], 'selected_pilot_study', user.selected_pilot_study)
                        assert.propertyVal(res[0], 'language', user.language)
                    })
            })
        })
    })

    describe('getById()', () => {
        context('when get a unique user', () => {
            it('should return the required user', () => {
                return service.getById(user.id!, new Query())
                    .then(res => {
                        assert.propertyVal(res, 'id', user.id)
                        assert.propertyVal(res, 'email', user.email)
                        assert.propertyVal(res, 'password', user.password)
                        assert.propertyVal(res, 'birth_date', user.birth_date)
                        assert.propertyVal(res, 'phone_number', user.phone_number)
                        assert.propertyVal(res, 'selected_pilot_study', user.selected_pilot_study)
                        assert.propertyVal(res, 'language', user.language)
                    })
            })
        })

        context('when there are validation errors', () => {
            it('should throw an error for invalid id', () => {
                return service.getById('123', new Query())
                    .catch(err => {
                        assert.propertyVal(err, 'message', 'Some ID provided does not have a valid format!')
                        assert.propertyVal(err, 'description', 'A 24-byte hex ID similar to this: 507f191e810c19729de860ea is' +
                            ' expected.')
                    })
            })
        })
    })

    describe('remove()', () => {
        context('when delete a user', () => {
            it('should return true', () => {
                return service.remove(user.id!)
                    .then(res => {
                        assert.isBoolean(res)
                        assert.isTrue(res)
                    })
            })
        })

        context('when the id is invalid', () => {
            it('should throw an error for invalid id', () => {
                return service.remove('123')
                    .catch(err => {
                        assert.propertyVal(err, 'message', 'Some ID provided does not have a valid format!')
                        assert.propertyVal(err, 'description', 'A 24-byte hex ID similar to this: 507f191e810c19729de860ea is ' +
                            'expected.')
                    })
            })
        })
    })

    describe('update()', () => {
        context('when want update a user', () => {
            it('should return the updated user', () => {
                user.password = undefined
                return service.update(user)
                    .then(res => {
                        assert.propertyVal(res, 'id', user.id)
                        assert.propertyVal(res, 'email', user.email)
                        assert.propertyVal(res, 'birth_date', user.birth_date)
                        assert.propertyVal(res, 'phone_number', user.phone_number)
                        assert.propertyVal(res, 'selected_pilot_study', user.selected_pilot_study)
                        assert.propertyVal(res, 'language', user.language)
                    })
            })

            it('should return the updated user without update email', () => {
                user.email = undefined
                return service.update(user)
                    .then(res => {
                        assert.propertyVal(res, 'id', user.id)
                        assert.propertyVal(res, 'email', DefaultEntityMock.ADMIN.email)
                        assert.propertyVal(res, 'birth_date', user.birth_date)
                        assert.propertyVal(res, 'phone_number', user.phone_number)
                        assert.propertyVal(res, 'selected_pilot_study', user.selected_pilot_study)
                        assert.propertyVal(res, 'language', user.language)
                    })
            })
        })

        context('when user with email already exists', () => {
            it('should reject an error for user already exist', () => {
                user.email = 'exists@mail.com'
                return service.update(user)
                    .catch(err => {
                        assert.propertyVal(err, 'message', 'A user with this email already registered!')
                        user.email = DefaultEntityMock.ADMIN.email
                    })
            })
        })

        context('when there are validation errors', () => {
            it('should throw error for pass invalid email', () => {
                user.email = 'anything'
                return service.update(user)
                    .catch(err => {
                        assert.propertyVal(err, 'message', 'Invalid email address!')
                        user.email = DefaultEntityMock.ADMIN.email
                    })
            })

            it('should throw error for try update password', () => {
                user.password = DefaultEntityMock.ADMIN.password
                return service.update(user)
                    .catch(err => {
                        assert.propertyVal(err, 'message', 'This parameter could not be updated.')
                        assert.propertyVal(err, 'description', 'A specific route to update user password already exists.' +
                            ` Access: PATCH /v1/auth/password to update your password.`)
                    })
            })
        })
    })

    describe('count()', () => {
        context('when want count users', () => {
            it('should return a number of users', () => {
                return service.count()
                    .then(res => {
                        assert.isNumber(res)
                        assert.equal(res, 1)
                    })
            })
        })
    })
})
