import { PilotStudy } from '../../../src/application/domain/model/pilot.study'
import { DefaultEntityMock } from '../../mocks/models/default.entity.mock'
import { PilotStudyService } from '../../../src/application/service/pilot.study.service'
import { PilotStudyRepositoryMock } from '../../mocks/repositories/pilot.study.repository.mock'
import { HealthProfessionalRepositoryMock } from '../../mocks/repositories/health.professional.repository.mock'
import { assert } from 'chai'
import { PatientRepositoryMock } from '../../mocks/repositories/patient.repository.mock'
import { Query } from '../../../src/infrastructure/repository/query/query'

describe('Services: PilotStudyService', () => {
    const service = new PilotStudyService(
        new PilotStudyRepositoryMock(), new HealthProfessionalRepositoryMock(), new PatientRepositoryMock())
    const pilot: PilotStudy = new PilotStudy().fromJSON(DefaultEntityMock.PILOT_STUDY)
    pilot.id = DefaultEntityMock.PILOT_STUDY.id

    // describe('add()', () => {
    //     context('when add new a pilot study', () => {
    //         it('should return a saved pilot study', () => {
    //             return service.add(pilot)
    //                 .then(res => {
    //                     assert.property(res, 'id')
    //                     assert.propertyVal(res, 'id', pilot.id)
    //                     assert.property(res, 'name')
    //                     assert.propertyVal(res, 'name', pilot.name)
    //                     assert.property(res, 'is_active')
    //                     assert.propertyVal(res, 'is_active', pilot.is_active)
    //                     assert.property(res, 'start')
    //                     assert.equal(res.start!.toString(), pilot.start!.toString())
    //                     assert.property(res, 'end')
    //                     assert.equal(res.end!.toString(), pilot.end!.toString())
    //                     assert.property(res, 'health_professionals_id')
    //                 })
    //         })
    //     })
    //
    //     context('when there are invalid parameters', () => {
    //         it('should throw an error for does not pass name', () => {
    //             pilot.name = undefined
    //             return service.add(pilot)
    //                 .catch(err => {
    //                     assert.property(err, 'message')
    //                     assert.property(err, 'description')
    //                     assert.equal(err.message, 'Required fields were not provided...')
    //                     assert.equal(err.description, 'Pilot Study validation: name required!')
    //                     pilot.name = DefaultEntityMock.PILOT_STUDY.name
    //                 })
    //         })
    //
    //         it('should throw an error for does not pass is_active', () => {
    //             pilot.is_active = undefined
    //             return service.add(pilot)
    //                 .catch(err => {
    //                     assert.property(err, 'message')
    //                     assert.property(err, 'description')
    //                     assert.equal(err.message, 'Required fields were not provided...')
    //                     assert.equal(err.description, 'Pilot Study validation: is_active required!')
    //                     pilot.is_active = DefaultEntityMock.PILOT_STUDY.is_active
    //                 })
    //         })
    //
    //         it('should throw an error for does not pass start', () => {
    //             pilot.start = undefined
    //             return service.add(pilot)
    //                 .catch(err => {
    //                     assert.property(err, 'message')
    //                     assert.property(err, 'description')
    //                     assert.equal(err.message, 'Required fields were not provided...')
    //                     assert.equal(err.description, 'Pilot Study validation: start required!')
    //                     pilot.start = DefaultEntityMock.PILOT_STUDY.start
    //                 })
    //         })
    //
    //         it('should throw an error for does not pass end', () => {
    //             pilot.end = undefined
    //             return service.add(pilot)
    //                 .catch(err => {
    //                     assert.property(err, 'message')
    //                     assert.property(err, 'description')
    //                     assert.equal(err.message, 'Required fields were not provided...')
    //                     assert.equal(err.description, 'Pilot Study validation: end required!')
    //                     pilot.end = DefaultEntityMock.PILOT_STUDY.end
    //                 })
    //         })
    //
    //         it('should throw an error for does not pass health_professionals_id', () => {
    //             pilot.health_professionals_id = undefined
    //             return service.add(pilot)
    //                 .catch(err => {
    //                     assert.property(err, 'message')
    //                     assert.property(err, 'description')
    //                     assert.equal(err.message, 'Required fields were not provided...')
    //                     assert.equal(err.description, 'Pilot Study validation: Collection with health_professional IDs ' +
    //                         'required!')
    //                     pilot.health_professionals_id = DefaultEntityMock.PILOT_STUDY.health_professionals_id
    //                 })
    //         })
    //
    //         it('should throw an error for does pass health_professionals_id as empty list', () => {
    //             pilot.health_professionals_id = []
    //             return service.add(pilot)
    //                 .catch(err => {
    //                     assert.property(err, 'message')
    //                     assert.property(err, 'description')
    //                     assert.equal(err.message, 'Required fields were not provided...')
    //                     assert.equal(err.description, 'Pilot Study validation: Collection with health_professional IDs ' +
    //                         'required!')
    //                     pilot.health_professionals_id = DefaultEntityMock.PILOT_STUDY.health_professionals_id
    //                 })
    //         })
    //
    //         it('should throw an error for does pass a health professional in health_professionals_id without id', () => {
    //             pilot.health_professionals_id![0].id = undefined
    //             return service.add(pilot)
    //                 .catch(err => {
    //                     assert.property(err, 'message')
    //                     assert.property(err, 'description')
    //                     assert.equal(err.message, 'Required fields were not provided...')
    //                     assert.equal(err.description, 'Pilot Study validation: Collection with health_professional IDs ' +
    //                         '(ID cannot be empty) required!')
    //                     pilot.health_professionals_id = DefaultEntityMock.PILOT_STUDY.health_professionals_id
    //                 })
    //         })
    //
    //         it('should throw an error for does pass a health professional in health_professionals_id with invalid id', () => {
    //             pilot.health_professionals_id![0].id = '123'
    //             return service.add(pilot)
    //                 .catch(err => {
    //                     assert.property(err, 'message')
    //                     assert.property(err, 'description')
    //                     assert.equal(err.message, 'Some ID provided does not have a valid format!')
    //                     assert.equal(err.description, 'A 24-byte hex ID similar to this: 507f191e810c19729de860ea is ' +
    //                         'expected.')
    //                     pilot.health_professionals_id = DefaultEntityMock.PILOT_STUDY.health_professionals_id
    //                 })
    //         })
    //
    //         it('should throw an error for does pass a health professional in health_professionals_id with unknown id', () => {
    //             pilot.health_professionals_id![0].id = `${new ObjectID()}`
    //             return service.add(pilot)
    //                 .catch(err => {
    //                     assert.property(err, 'message')
    //                     assert.equal(err.message, 'Health professional not found!')
    //                     pilot.health_professionals_id = DefaultEntityMock.PILOT_STUDY.health_professionals_id
    //                 })
    //         })
    //     })
    // })

    describe('getAll()', () => {
        context('when get all pilot studies', () => {
            it('should return a list of pilot studies', () => {
                return service.getAll(new Query())
                    .then(res => {
                        assert.isArray(res)
                        assert.lengthOf(res, 1)
                        assert.propertyVal(res[0], 'id', pilot.id)
                        assert.propertyVal(res[0], 'name', pilot.name)
                        assert.propertyVal(res[0], 'is_active', pilot.is_active)
                        assert.property(res[0], 'start')
                        assert.property(res[0], 'end')
                        assert.propertyVal(res[0], 'total_health_professionals', 0)
                        assert.propertyVal(res[0], 'total_patients', 0)
                        assert.propertyVal(res[0], 'location', pilot.location)
                    })
            })
        })
    })

    describe('getById()', () => {
        context('when get a unique pilot study', () => {
            it('should return a pilot study', () => {
                return service.getById(pilot.id!, new Query())
                    .then(res => {
                        assert.propertyVal(res, 'id', pilot.id)
                        assert.propertyVal(res, 'name', pilot.name)
                        assert.propertyVal(res, 'is_active', pilot.is_active)
                        assert.property(res, 'start')
                        assert.property(res, 'end')
                        assert.propertyVal(res, 'total_health_professionals', 0)
                        assert.propertyVal(res, 'total_patients', 0)
                        assert.propertyVal(res, 'location', pilot.location)
                    })
            })
        })

        context('when there are validation errors', () => {
            it('should throw an error for invalid id', () => {
                return service.getById('123', new Query())
                    .catch(err => {
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
                    .then(res => {
                        assert.isBoolean(res)
                        assert.isTrue(res)
                    })
            })
        })

        context('when there are validation errors', () => {
            it('should throw an error for invalid id', () => {
                return service.remove('123')
                    .catch(err => {
                        assert.equal(err.message, 'Some ID provided does not have a valid format!')
                        assert.equal(err.description, 'A 24-byte hex ID similar to this: 507f191e810c19729de860ea is expected.')
                    })
            })
        })

    })

    // describe('update()', () => {
    //     context('when update a pilot study', () => {
    //         it('should return the updated pilot study', () => {
    //             pilot.health_professionals_id = undefined
    //             return service.update(pilot)
    //                 .then(res => {
    //                     assert.property(res, 'id')
    //                     assert.propertyVal(res, 'id', pilot.id)
    //                     assert.property(res, 'name')
    //                     assert.propertyVal(res, 'name', pilot.name)
    //                     assert.property(res, 'is_active')
    //                     assert.propertyVal(res, 'is_active', pilot.is_active)
    //                     assert.property(res, 'start')
    //                     assert.property(res, 'end')
    //                 })
    //         })
    //     })
    //
    //     context('when the pilot study parameters was invalid', () => {
    //         it('should return error for pass a invalid id', () => {
    //             pilot.id = '123'
    //             return service.update(pilot)
    //                 .catch(err => {
    //                     assert.property(err, 'message')
    //                     assert.property(err, 'description')
    //                     assert.equal(err.message, 'Some ID provided does not have a valid format!')
    //                     assert.equal(err.description, 'A 24-byte hex ID similar to this: 507f191e810c19729de860ea is expected.')
    //                     pilot.id = DefaultEntityMock.PILOT_STUDY.id
    //                 })
    //         })
    //
    //         it('should throw error for does pass a health_professionals_id list', () => {
    //             pilot.health_professionals_id = DefaultEntityMock.PILOT_STUDY.health_professionals_id
    //             return service.update(pilot)
    //                 .catch(err => {
    //                     assert.property(err, 'message')
    //                     assert.property(err, 'description')
    //                     assert.equal(err.message, 'This parameter could not be updated.')
    //                     assert.equal(err.description, 'A specific route to manage health_professionals_id already exists.')
    //                 })
    //         })
    //     })
    // })

    // describe('getAllHealthProfessionals()', () => {
    //     context('when want get all health professionals from pilot study', () => {
    //         it('should return a list of health professionals', () => {
    //             return service.getAllHealthProfessionals(pilot.id!, new Query())
    //                 .then(res => {
    //                     assert.isArray(res!)
    //                     assert.lengthOf(res!, 1)
    //                     assert.property(res![0], 'id')
    //                     assert.propertyVal(res![0], 'id', DefaultEntityMock.HEALTH_PROFESSIONAL.id)
    //                     assert.property(res![0], 'email')
    //                     assert.propertyVal(res![0], 'email', DefaultEntityMock.HEALTH_PROFESSIONAL.email)
    //                     assert.property(res![0], 'password')
    //                     assert.propertyVal(res![0], 'password', DefaultEntityMock.HEALTH_PROFESSIONAL.password)
    //                     assert.property(res![0], 'name')
    //                     assert.propertyVal(res![0], 'name', DefaultEntityMock.HEALTH_PROFESSIONAL.name)
    //                     assert.property(res![0], 'health_area')
    //                     assert.propertyVal(res![0], 'health_area', DefaultEntityMock.HEALTH_PROFESSIONAL.health_area)
    //                 })
    //         })
    //     })
    // })
})
