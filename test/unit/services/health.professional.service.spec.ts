import { assert } from 'chai'
import { HealthProfessionalService } from '../../../src/application/service/health.professional.service'
import { HealthProfessionalRepositoryMock } from '../../mocks/repositories/health.professional.repository.mock'
import { HealthProfessional } from '../../../src/application/domain/model/health.professional'
import { DefaultEntityMock } from '../../mocks/models/default.entity.mock'
import { UserRepositoryMock } from '../../mocks/repositories/user.repository.mock'
import { PilotStudyRepositoryMock } from '../../mocks/repositories/pilot.study.repository.mock'
import { Query } from '../../../src/infrastructure/repository/query/query'

describe('Services: HealthProfessionalService', () => {
    const service = new HealthProfessionalService(
        new HealthProfessionalRepositoryMock(), new UserRepositoryMock(), new PilotStudyRepositoryMock())
    const user: HealthProfessional = new HealthProfessional().fromJSON(DefaultEntityMock.HEALTH_PROFESSIONAL)

    describe('add()', () => {
        context('when save a new health professional', () => {
            it('should return the saved user', () => {
                return service.add(user)
                    .then(res => {
                        assert.propertyVal(res, 'id', user.id)
                        assert.propertyVal(res, 'email', user.email)
                        assert.propertyVal(res, 'birth_date', user.birth_date)
                        assert.propertyVal(res, 'phone_number', user.phone_number)
                        assert.propertyVal(res, 'selected_pilot_study', user.selected_pilot_study)
                        assert.propertyVal(res, 'language', user.language)
                        assert.propertyVal(res, 'name', user.name)
                        assert.propertyVal(res, 'health_area', user.health_area)
                    })
            })
        })

        context('when there are validation errors', () => {
            it('should throw an error for does not pass email', () => {
                user.email = undefined
                return service.add(user)
                    .catch(err => {
                        assert.propertyVal(err, 'message', 'Required fields were not provided...')
                        assert.propertyVal(err, 'description', 'User validation: email required!')
                    })
            })
        })

        context('when the user already exists', () => {
            it('should reject an error for user already exist', () => {
                user.email = 'exists@mail.com'
                return service.add(user)
                    .catch(err => {
                        assert.propertyVal(err, 'message', 'A user with this email already registered!')
                        user.email = DefaultEntityMock.HEALTH_PROFESSIONAL.email
                    })
            })
        })
    })

    describe('getAll()', () => {
        context('when want get a collection of users', () => {
            it('should return a list of users', () => {
                return service.getAll(new Query())
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
                        assert.propertyVal(res[0], 'health_area', user.health_area)
                    })
            })
        })
    })

    describe('getById()', () => {
        context('when want recover a unique user', () => {
            it('should return a user', () => {
                return service.getById(user.id!, new Query())
                    .then(res => {
                        assert.propertyVal(res, 'id', user.id)
                        assert.propertyVal(res, 'email', user.email)
                        assert.propertyVal(res, 'birth_date', user.birth_date)
                        assert.propertyVal(res, 'phone_number', user.phone_number)
                        assert.propertyVal(res, 'selected_pilot_study', user.selected_pilot_study)
                        assert.propertyVal(res, 'language', user.language)
                        assert.propertyVal(res, 'name', user.name)
                        assert.propertyVal(res, 'health_area', user.health_area)
                    })
            })
        })

        context('when there are validation errors', () => {
            it('should throw an error for invalid id', () => {
                return service.getById('123', new Query())
                    .catch(err => {
                        assert.propertyVal(err, 'message', 'Some ID provided does not have a valid format!')
                        assert.propertyVal(err, 'description', 'A 24-byte hex ID similar to this: 507f191e810c19729de860ea' +
                            ' is expected.')
                    })
            })
        })
    })

    describe('remove()', () => {
        context('when want remove a user', () => {
            it('should return true', () => {
                return service.remove(user.id!)
                    .then(res => {
                        assert.isBoolean(res)
                        assert.isTrue(res)
                    })
            })
        })

        context('when the are validation errors', () => {
            it('should throw an error for invalid id', () => {
                return service.remove('123')
                    .catch(err => {
                        assert.property(err, 'message')
                        assert.property(err, 'description')
                        assert.propertyVal(err, 'message', 'Some ID provided does not have a valid format!')
                        assert.propertyVal(err, 'description', 'A 24-byte hex ID similar to this: 507f191e810c19729de860ea ' +
                            'is expected.')
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
                        assert.propertyVal(res, 'name', user.name)
                        assert.propertyVal(res, 'health_area', user.health_area)
                    })
            })
        })

        context('when there are validation errors', () => {
            it('should throw an error for invalid email', () => {
                user.email = 'invalid'
                return service.update(user)
                    .catch(err => {
                        assert.property(err, 'message')
                        assert.propertyVal(err, 'message', 'Invalid email address!')
                        user.email = DefaultEntityMock.HEALTH_PROFESSIONAL.email
                    })
            })

            it('should throw error for try update password', () => {
                user.password = DefaultEntityMock.HEALTH_PROFESSIONAL.password
                return service.update(user)
                    .catch(err => {
                        assert.property(err, 'message')
                        assert.property(err, 'description')
                        assert.propertyVal(err, 'message', 'This parameter could not be updated.')
                        assert.propertyVal(err, 'description', 'A specific route to update user password already exists.' +
                            ` Access: PATCH /v1/auth/password to update your password.`)
                        user.password = DefaultEntityMock.HEALTH_PROFESSIONAL.password
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
