import { assert } from 'chai'
import { HealthProfessionalService } from '../../../src/application/service/health.professional.service'
import { HealthProfessionalRepositoryMock } from '../../mocks/repositories/health.professional.repository.mock'
import { PilotStudyRepositoryMock } from '../../mocks/repositories/pilot.study.repository.mock'
import { HealthProfessional } from '../../../src/application/domain/model/health.professional'
import { DefaultEntityMock } from '../../mocks/models/default.entity.mock'
import { Query } from '../../../src/infrastructure/repository/query/query'
import { PilotStudy } from '../../../src/application/domain/model/pilot.study'

describe('Services: HealthProfessionalService', () => {
    const service = new HealthProfessionalService(
        new HealthProfessionalRepositoryMock(),
        new PilotStudyRepositoryMock()
    )
    const user: HealthProfessional = new HealthProfessional().fromJSON(DefaultEntityMock.HEALTH_PROFESSIONAL)
    const pilot: PilotStudy = new PilotStudy().fromJSON(DefaultEntityMock.PILOT_STUDY)

    describe('add()', () => {
        context('when save a new health professional', () => {
            it('should return the saved user', () => {
                return service.add(user)
                    .then(result => {
                        assert.property(result, 'id')
                        assert.propertyVal(result, 'id', user.id)
                        assert.property(result, 'email')
                        assert.propertyVal(result, 'email', user.email)
                        assert.property(result, 'password')
                        assert.propertyVal(result, 'password', user.password)
                        assert.property(result, 'name')
                        assert.propertyVal(result, 'name', user.name)
                        assert.property(result, 'health_area')
                        assert.propertyVal(result, 'health_area', user.health_area)
                    })
            })
        })

        context('when the user was incomplete or invalid', () => {
            it('should throw an error for does not pass email', () => {
                user.email = undefined
                return service.add(user)
                    .catch(err => {
                        assert.property(err, 'message')
                        assert.property(err, 'description')
                        assert.equal(err.message, 'Required fields were not provided...')
                        assert.equal(err.description, 'User validation: email required!')
                        user.email = DefaultEntityMock.HEALTH_PROFESSIONAL.email
                    })
            })

            it('should throw an error for invalid email', () => {
                user.email = 'invalid'
                return service.add(user)
                    .catch(err => {
                        assert.property(err, 'message')
                        assert.equal(err.message, 'Invalid email address!')
                        user.email = DefaultEntityMock.HEALTH_PROFESSIONAL.email
                    })
            })

            it('should throw an error for does not pass password', () => {
                user.password = undefined
                return service.add(user)
                    .catch(err => {
                        assert.property(err, 'message')
                        assert.property(err, 'description')
                        assert.equal(err.message, 'Required fields were not provided...')
                        assert.equal(err.description, 'User validation: password required!')
                        user.password = DefaultEntityMock.HEALTH_PROFESSIONAL.password
                    })
            })

            it('should throw an error for does not pass name', () => {
                user.name = undefined
                return service.add(user)
                    .catch(err => {
                        assert.property(err, 'message')
                        assert.property(err, 'description')
                        assert.equal(err.message, 'Required fields were not provided...')
                        assert.equal(err.description, 'User validation: name required!')
                        user.name = DefaultEntityMock.HEALTH_PROFESSIONAL.name
                    })
            })

            it('should throw an error for does not pass health area', () => {
                user.health_area = undefined

                return service.add(user)
                    .catch(err => {
                        assert.property(err, 'message')
                        assert.property(err, 'description')
                        assert.equal(err.message, 'Required fields were not provided...')
                        assert.equal(err.description, 'User validation: health_area required!')
                        user.health_area = DefaultEntityMock.HEALTH_PROFESSIONAL.health_area
                    })
            })

            it('should throw an error for pass invalid health area', () => {
                user.health_area = 'oncologist'

                return service.add(user)
                    .catch(err => {
                        assert.property(err, 'message')
                        assert.property(err, 'description')
                        assert.equal(err.message, 'Health Area not mapped!')
                        assert.equal(err.description, 'The mapped areas are: nutrition, dentistry.')
                        user.health_area = DefaultEntityMock.HEALTH_PROFESSIONAL.health_area
                    })
            })
        })
    })

    describe('getAll()', () => {
        context('when want recover all health professionals', () => {
            it('should return a list of health professionals', () => {
                return service.getAll(new Query())
                    .then(result => {
                        assert.isArray(result)
                        assert.lengthOf(result, 1)
                        assert.property(result[0], 'id')
                        assert.propertyVal(result[0], 'id', user.id)
                        assert.property(result[0], 'email')
                        assert.propertyVal(result[0], 'email', user.email)
                        assert.property(result[0], 'password')
                        assert.propertyVal(result[0], 'password', user.password)
                        assert.property(result[0], 'name')
                        assert.propertyVal(result[0], 'name', user.name)
                        assert.property(result[0], 'health_area')
                        assert.propertyVal(result[0], 'health_area', user.health_area)
                    })
            })
        })
    })

    describe('getById()', () => {
        context('when want recover a unique user', () => {
            it('should return a user', () => {
                return service.getById(user.id!, new Query())
                    .then(result => {
                        assert.property(result, 'id')
                        assert.propertyVal(result, 'id', user.id)
                        assert.property(result, 'email')
                        assert.propertyVal(result, 'email', user.email)
                        assert.property(result, 'password')
                        assert.propertyVal(result, 'password', user.password)
                        assert.property(result, 'name')
                        assert.propertyVal(result, 'name', user.name)
                        assert.property(result, 'health_area')
                        assert.propertyVal(result, 'health_area', user.health_area)
                    })
            })
        })

        context('when the id is invalid', () => {
            it('should throw an error for invalid id', () => {
                return service.getById('123', new Query())
                    .catch(err => {
                        assert.property(err, 'message')
                        assert.property(err, 'description')
                        assert.equal(err.message, 'Some ID provided does not have a valid format!')
                        assert.equal(err.description, 'A 24-byte hex ID similar to this: 507f191e810c19729de860ea is expected.')
                    })
            })
        })
    })

    describe('remove()', () => {
        context('when want remove a user', () => {
            it('should return true', () => {
                return service.remove(user.id!)
                    .then(result => {
                        assert.isBoolean(result)
                        assert.isTrue(result)
                    })
            })
        })

        context('when the id is invalid', () => {
            it('should throw an error for invalid id', () => {
                return service.remove('123')
                    .catch(err => {
                        assert.property(err, 'message')
                        assert.property(err, 'description')
                        assert.equal(err.message, 'Some ID provided does not have a valid format!')
                        assert.equal(err.description, 'A 24-byte hex ID similar to this: 507f191e810c19729de860ea is expected.')
                    })
            })
        })
    })

    describe('update()', () => {
        context('when want update a user', () => {
            it('should return the updated user', () => {
                user.password = undefined
                return service.update(user)
                    .then(result => {
                        assert.property(result, 'id')
                        assert.propertyVal(result, 'id', user.id)
                        assert.property(result, 'email')
                        assert.propertyVal(result, 'email', user.email)
                        assert.property(result, 'name')
                        assert.propertyVal(result, 'name', user.name)
                        assert.property(result, 'health_area')
                        assert.propertyVal(result, 'health_area', user.health_area)
                        user.password = DefaultEntityMock.HEALTH_PROFESSIONAL.password
                    })
            })
        })

        context('when there are invalid parameters', () => {
            it('should throw an error for invalid email', () => {
                user.email = 'invalid'
                return service.update(user)
                    .catch(err => {
                        assert.property(err, 'message')
                        assert.equal(err.message, 'Invalid email address!')
                        user.email = DefaultEntityMock.HEALTH_PROFESSIONAL.email
                    })
            })

            it('should throw an error for invalid health area', () => {
                user.health_area = 'invalid'
                return service.update(user)
                    .catch(err => {
                        assert.property(err, 'message')
                        assert.property(err, 'description')
                        assert.equal(err.message, 'Health Area not mapped!')
                        assert.equal(err.description, 'The mapped areas are: nutrition, dentistry.')
                        user.health_area = DefaultEntityMock.HEALTH_PROFESSIONAL.health_area
                    })
            })

            it('should throw error for try update password', () => {
                return service.update(user)
                    .catch(err => {
                        assert.property(err, 'message')
                        assert.property(err, 'description')
                        assert.equal(err.message, 'This parameter could not be updated.')
                        assert.equal(err.description, 'A specific route to update user password already exists.' +
                            ` Access: PATCH /users/${user.id}/password to update your password.`)
                    })
            })
        })
    })

    describe('getAllPilotStudies()', () => {
        context('when want get all pilot studies associated with a health professional', () => {
            it('should return a list of pilot studies', () => {
                return service.getAllPilotStudies(user.id!, new Query())
                    .then(result => {
                        assert.isArray(result)
                        assert.lengthOf(result!, 1)
                        assert.property(result![0], 'name')
                        assert.propertyVal(result![0], 'name', pilot.name)
                        assert.property(result![0], 'is_active')
                        assert.propertyVal(result![0], 'is_active', pilot.is_active)
                        assert.property(result![0], 'start')
                        assert.equal(result![0].start!.toString(), pilot.start!.toString())
                        assert.property(result![0], 'end')
                        assert.equal(result![0].end!.toString(), pilot.end!.toString())
                    })
            })
        })

        context('when a repository error occurs', () => {
            it('should reject a error', () => {
                user.id = undefined
                return service.getAllPilotStudies(user.id!, new Query())
                    .catch(err => {
                        assert.property(err, 'message')
                        assert.propertyVal(err, 'message', 'Some ID provided does not have a valid format!')
                    })
            })
        })
    })
})
