import { PilotStudy } from '../../../src/application/domain/model/pilot.study'
import { DefaultEntityMock } from '../../mocks/default.entity.mock'
import { PilotStudyService } from '../../../src/application/service/pilot.study.service'
import { PilotStudyRepositoryMock } from '../../mocks/pilot.study.repository.mock'
import { HealthProfessionalRepositoryMock } from '../../mocks/health.professional.repository.mock'
import { assert } from 'chai'
import { Query } from '../../../src/infrastructure/repository/query/query'
import { ObjectID } from 'bson'

describe('Services: PilotStudyService', () => {
    const service = new PilotStudyService(new PilotStudyRepositoryMock(), new HealthProfessionalRepositoryMock())
    const pilot: PilotStudy = new PilotStudy().fromJSON(DefaultEntityMock.PILOT_STUDY)

    describe('add()', () => {
        context('when add new a pilot study', () => {
            it('should return a saved pilot study', () => {
                return service.add(pilot)
                    .then(result => {
                        assert.property(result, 'id')
                        assert.propertyVal(result, 'id', pilot.id)
                        assert.property(result, 'name')
                        assert.propertyVal(result, 'name', pilot.name)
                        assert.property(result, 'is_active')
                        assert.propertyVal(result, 'is_active', pilot.is_active)
                        assert.propertyVal(result, 'start', pilot.start)
                        assert.property(result, 'end')
                        assert.propertyVal(result, 'end', pilot.end)
                        assert.property(result, 'health_professionals_id')
                    })
            })
        })

        context('when there are invalid parameters', () => {
            it('should throw an error for does not pass name', () => {
                pilot.name = undefined
                return service.add(pilot)
                    .catch(err => {
                        assert.property(err, 'message')
                        assert.property(err, 'description')
                        assert.equal(err.message, 'Required fields were not provided...')
                        assert.equal(err.description, 'Pilot Study validation: name required!')
                        pilot.name = DefaultEntityMock.PILOT_STUDY.name
                    })
            })

            it('should throw an error for does not pass is_active', () => {
                pilot.is_active = undefined
                return service.add(pilot)
                    .catch(err => {
                        assert.property(err, 'message')
                        assert.property(err, 'description')
                        assert.equal(err.message, 'Required fields were not provided...')
                        assert.equal(err.description, 'Pilot Study validation: is_active required!')
                        pilot.is_active = DefaultEntityMock.PILOT_STUDY.is_active
                    })
            })

            it('should throw an error for does not pass start', () => {
                pilot.start = undefined
                return service.add(pilot)
                    .catch(err => {
                        assert.property(err, 'message')
                        assert.property(err, 'description')
                        assert.equal(err.message, 'Required fields were not provided...')
                        assert.equal(err.description, 'Pilot Study validation: start required!')
                        pilot.start = DefaultEntityMock.PILOT_STUDY.start
                    })
            })

            it('should throw an error for does not pass end', () => {
                pilot.end = undefined
                return service.add(pilot)
                    .catch(err => {
                        assert.property(err, 'message')
                        assert.property(err, 'description')
                        assert.equal(err.message, 'Required fields were not provided...')
                        assert.equal(err.description, 'Pilot Study validation: end required!')
                        pilot.end = DefaultEntityMock.PILOT_STUDY.end
                    })
            })

            it('should throw an error for does not pass health_professionals_id', () => {
                pilot.health_professionals_id = undefined
                return service.add(pilot)
                    .catch(err => {
                        assert.property(err, 'message')
                        assert.property(err, 'description')
                        assert.equal(err.message, 'Required fields were not provided...')
                        assert.equal(err.description, 'Pilot Study validation: Collection with health_professional IDs ' +
                            'required!')
                        pilot.health_professionals_id = DefaultEntityMock.PILOT_STUDY.health_professionals_id
                    })
            })

            it('should throw an error for does pass health_professionals_id as empty list', () => {
                pilot.health_professionals_id = []
                return service.add(pilot)
                    .catch(err => {
                        assert.property(err, 'message')
                        assert.property(err, 'description')
                        assert.equal(err.message, 'Required fields were not provided...')
                        assert.equal(err.description, 'Pilot Study validation: Collection with health_professional IDs ' +
                            'required!')
                        pilot.health_professionals_id = DefaultEntityMock.PILOT_STUDY.health_professionals_id
                    })
            })

            it('should throw an error for does pass a health professional in health_professionals_id without id', () => {
                pilot.health_professionals_id![0].id = undefined
                return service.add(pilot)
                    .catch(err => {
                        assert.property(err, 'message')
                        assert.property(err, 'description')
                        assert.equal(err.message, 'Required fields were not provided...')
                        assert.equal(err.description, 'Pilot Study validation: Collection with health_professional IDs ' +
                            '(ID cannot be empty) required!')
                        pilot.health_professionals_id = DefaultEntityMock.PILOT_STUDY.health_professionals_id
                    })
            })

            it('should throw an error for does pass a health professional in health_professionals_id with invalid id', () => {
                pilot.health_professionals_id![0].id = '123'
                return service.add(pilot)
                    .catch(err => {
                        assert.property(err, 'message')
                        assert.property(err, 'description')
                        assert.equal(err.message, 'Some ID provided does not have a valid format!')
                        assert.equal(err.description, 'A 24-byte hex ID similar to this: 507f191e810c19729de860ea is ' +
                            'expected.')
                        pilot.health_professionals_id = DefaultEntityMock.PILOT_STUDY.health_professionals_id
                    })
            })

            it('should throw an error for does pass a health professional in health_professionals_id with unknown id', () => {
                pilot.health_professionals_id![0].id = `${new ObjectID()}`
                return service.add(pilot)
                    .catch(err => {
                        assert.property(err, 'message')
                        assert.equal(err.message, 'Health professional not found!')
                        pilot.health_professionals_id = DefaultEntityMock.PILOT_STUDY.health_professionals_id
                    })
            })
        })
    })

    describe('getAll()', () => {
        context('when get all pilot studies', () => {
            it('should return a list of pilot studies', () => {
                return service.getAll(new Query())
                    .then(result => {
                        assert.isArray(result)
                        assert.lengthOf(result, 1)
                        assert.property(result[0], 'id')
                        assert.propertyVal(result[0], 'id', pilot.id)
                        assert.property(result[0], 'name')
                        assert.propertyVal(result[0], 'name', pilot.name)
                        assert.property(result[0], 'is_active')
                        assert.propertyVal(result[0], 'is_active', pilot.is_active)
                        assert.propertyVal(result[0], 'start', pilot.start)
                        assert.property(result[0], 'end')
                        assert.propertyVal(result[0], 'end', pilot.end)
                        assert.property(result[0], 'health_professionals_id')
                    })
            })
        })
    })

    describe('getById()', () => {
        context('when get a unique pilot study', () => {
            it('should return a pilot study', () => {
                return service.getById(pilot.id!, new Query())
                    .then(result => {
                        assert.property(result, 'id')
                        assert.propertyVal(result, 'id', pilot.id)
                        assert.property(result, 'name')
                        assert.propertyVal(result, 'name', pilot.name)
                        assert.property(result, 'is_active')
                        assert.propertyVal(result, 'is_active', pilot.is_active)
                        assert.propertyVal(result, 'start', pilot.start)
                        assert.property(result, 'end')
                        assert.propertyVal(result, 'end', pilot.end)
                        assert.property(result, 'health_professionals_id')
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
        context('when remove a pilot study', () => {
            it('should return true', () => {
                return service.remove(pilot.id!)
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
        context('when update a pilot study', () => {
            it('should return the updated pilot study', () => {
                const pilotNew = pilot.toJSON()
                delete pilotNew.health_professionals_id
                return service.update(new PilotStudy().fromJSON(pilotNew))
                    .then(result => {
                        assert.property(result, 'id')
                        assert.propertyVal(result, 'id', pilot.id)
                        assert.property(result, 'name')
                        assert.propertyVal(result, 'name', pilot.name)
                        assert.property(result, 'is_active')
                        assert.propertyVal(result, 'is_active', pilot.is_active)
                        assert.propertyVal(result, 'start', pilot.start)
                        assert.property(result, 'end')
                        assert.propertyVal(result, 'end', pilot.end)
                    })
            })
        })

        context('when the pilot study parameters was invalid', () => {
            it('should return error for pass a invalid id', () => {
                pilot.id = '123'
                return service.update(pilot)
                    .catch(err => {
                        assert.property(err, 'message')
                        assert.property(err, 'description')
                        assert.equal(err.message, 'Some ID provided does not have a valid format!')
                        assert.equal(err.description, 'A 24-byte hex ID similar to this: 507f191e810c19729de860ea is expected.')
                        pilot.id = DefaultEntityMock.PILOT_STUDY.id
                    })
            })

            it('should throw error for does pass a health_professionals_id list', () => {
                pilot.health_professionals_id = DefaultEntityMock.PILOT_STUDY.health_professionals_id
                return service.update(pilot)
                    .catch(err => {
                        assert.property(err, 'message')
                        assert.property(err, 'description')
                        assert.equal(err.message, 'This parameter could not be updated.')
                        assert.equal(err.description, 'A specific route to manage health_professionals_id already exists.')
                    })
            })
        })
    })

    // describe('associateHealthProfessional()')
    // describe('disassociateHealthProfessional()')
    describe('getAllHealthProfessionals()', () => {
        context('when want get all health professionals from pilot study', () => {
            it('should return a list of health professionals', () => {
                return service.getAllHealthProfessionals(pilot.id!, new Query())
                    .then(result => {
                        assert.isArray(result!)
                        assert.lengthOf(result!, 1)
                        assert.property(result![0], 'id')
                        assert.propertyVal(result![0], 'id', DefaultEntityMock.HEALTH_PROFESSIONAL.id)
                        assert.property(result![0], 'email')
                        assert.propertyVal(result![0], 'email', DefaultEntityMock.HEALTH_PROFESSIONAL.email)
                        assert.property(result![0], 'password')
                        assert.propertyVal(result![0], 'password', DefaultEntityMock.HEALTH_PROFESSIONAL.password)
                        assert.property(result![0], 'name')
                        assert.propertyVal(result![0], 'name', DefaultEntityMock.HEALTH_PROFESSIONAL.name)
                        assert.property(result![0], 'health_area')
                        assert.propertyVal(result![0], 'health_area', DefaultEntityMock.HEALTH_PROFESSIONAL.health_area)
                    })
            })
        })
    })
})
