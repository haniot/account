import { Patient } from '../../../src/application/domain/model/patient'
import { DefaultEntityMock } from '../../mocks/models/default.entity.mock'
import { IPatientService } from '../../../src/application/port/patient.service.interface'
import { PatientService } from '../../../src/application/service/patient.service'
import { PatientRepositoryMock } from '../../mocks/repositories/patient.repository.mock'
import { assert } from 'chai'
import { UserRepositoryMock } from '../../mocks/repositories/user.repository.mock'
import { Query } from '../../../src/infrastructure/repository/query/query'
import { EventBusRabbitMQMock } from '../../mocks/eventbus/eventbus.rabbitmq.mock'
import { IntegrationEventRepositoryMock } from '../../mocks/repositories/integration.event.repository.mock'
import { CustomLoggerMock } from '../../mocks/custom.logger.mock'

describe('Services: PatientService', () => {
    const user: Patient = new Patient().fromJSON(DefaultEntityMock.PATIENT)
    user.id = DefaultEntityMock.PATIENT.id
    const service: IPatientService = new PatientService(
        new PatientRepositoryMock(),
        new UserRepositoryMock(),
        new EventBusRabbitMQMock(),
        new IntegrationEventRepositoryMock(),
        new CustomLoggerMock()
    )

    describe('add()', () => {
        context('when save a new user', () => {
            it('should return a saved user', () => {
                return service
                    .add(user)
                    .then(res => {
                        assert.propertyVal(res, 'id', user.id)
                        assert.propertyVal(res, 'email', user.email)
                        assert.propertyVal(res, 'birth_date', user.birth_date)
                        assert.propertyVal(res, 'phone_number', user.phone_number)
                        assert.propertyVal(res, 'selected_pilot_study', user.selected_pilot_study)
                        assert.propertyVal(res, 'language', user.language)
                        assert.propertyVal(res, 'name', user.name)
                        assert.propertyVal(res, 'gender', user.gender)
                    })
            })
        })

        context('when there are validation errors', () => {
            it('should reject a validation error', () => {
                return service.add(new Patient())
                    .catch(err => {
                        assert.propertyVal(err, 'message', 'Required fields were not provided...')
                        assert.propertyVal(err, 'description', 'Patient validation: name, gender, birth_date is ' +
                            'required!')
                    })
            })
        })

        context('when the user already exists', () => {
            it('should reject an error for user already exist', () => {
                user.email = 'exists@mail.com'
                return service.add(user)
                    .catch(err => {
                        assert.propertyVal(err, 'message', 'A user with this email already registered!')
                        user.email = DefaultEntityMock.PATIENT.email
                    })
            })
        })
    })

    describe('getAll()', () => {
        context('when get a collection of users', () => {
            it('should return a list of users', () => {
                return service
                    .getAll(new Query())
                    .then(res => {
                        assert.isArray(res)
                        assert.lengthOf(res, 1)
                        assert.propertyVal(res[0], 'id', user.id)
                        assert.propertyVal(res[0], 'email', user.email)
                        assert.propertyVal(res[0], 'birth_date', user.birth_date)
                        assert.propertyVal(res[0], 'phone_number', user.phone_number)
                        assert.propertyVal(res[0], 'selected_pilot_study', user.selected_pilot_study)
                        assert.propertyVal(res[0], 'language', user.language)
                        assert.propertyVal(res[0], 'name', user.name)
                        assert.propertyVal(res[0], 'gender', user.gender)
                    })
            })
        })

    })

    describe('getById()', () => {
        context('when get a unique user', () => {
            it('should return a user', () => {
                const query: Query = new Query()

                return service
                    .getById(user.id!, query)
                    .then(res => {
                        assert.propertyVal(res, 'id', user.id)
                        assert.propertyVal(res, 'email', user.email)
                        assert.propertyVal(res, 'birth_date', user.birth_date)
                        assert.propertyVal(res, 'phone_number', user.phone_number)
                        assert.propertyVal(res, 'selected_pilot_study', user.selected_pilot_study)
                        assert.propertyVal(res, 'language', user.language)
                        assert.propertyVal(res, 'name', user.name)
                        assert.propertyVal(res, 'gender', user.gender)
                    })
            })
        })

        context('when there are validation errors', () => {
            it('should reject a validation error', () => {
                return service
                    .getById('123', new Query())
                    .catch(err => {
                        assert.propertyVal(err, 'message', 'Some ID provided does not have a valid format!')
                        assert.propertyVal(err, 'description', 'A 24-byte hex ID similar to this: 507f191e810c19729de860ea' +
                            ' is expected.')
                    })
            })
        })
    })

    describe('remove()', () => {
        context('when delete a user', () => {
            it('should return true', () => {
                return service
                    .remove(user.id!)
                    .then(res => {
                        assert.isBoolean(res)
                        assert.isTrue(res)
                    })
            })
        })

        context('when there are validation errors', () => {
            it('should reject a validation error', () => {
                return service
                    .remove('123')
                    .catch(err => {
                        assert.propertyVal(err, 'message', 'Some ID provided does not have a valid format!')
                        assert.propertyVal(err, 'description', 'A 24-byte hex ID similar to this: 507f191e810c19729de860ea' +
                            ' is expected.')
                    })
            })
        })
    })

    describe('update()', () => {
        context('when update a user', () => {
            it('should return the updated user', () => {
                user.password = undefined
                return service
                    .update(user)
                    .then(res => {
                        assert.propertyVal(res, 'id', user.id)
                        assert.propertyVal(res, 'email', user.email)
                        assert.propertyVal(res, 'birth_date', user.birth_date)
                        assert.propertyVal(res, 'phone_number', user.phone_number)
                        assert.propertyVal(res, 'selected_pilot_study', user.selected_pilot_study)
                        assert.propertyVal(res, 'language', user.language)
                        assert.propertyVal(res, 'name', user.name)
                        assert.propertyVal(res, 'gender', user.gender)
                    })
            })
        })

        context('when there are validation errors', () => {
            it('should reject a validation error', () => {
                user.id = '123'
                return service
                    .update(user)
                    .catch(err => {
                        assert.propertyVal(err, 'message', 'Some ID provided does not have a valid format!')
                        assert.propertyVal(err, 'description', 'A 24-byte hex ID similar to this: 507f191e810c19729de860ea' +
                            ' is expected.')
                        user.id = DefaultEntityMock.PATIENT.id
                    })
            })
            it('should throw error for try update password', () => {
                user.password = DefaultEntityMock.PATIENT.password
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
