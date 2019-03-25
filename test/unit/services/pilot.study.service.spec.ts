import { PilotStudy } from '../../../src/application/domain/model/pilot.study'
import { DefaultEntityMock } from '../../mocks/default.entity.mock'
import { PilotStudyService } from '../../../src/application/service/pilot.study.service'
import { PilotStudyRepositoryMock } from '../../mocks/pilot.study.repository.mock'
import { HealthProfessionalRepositoryMock } from '../../mocks/health.professional.repository.mock'
import { assert } from 'chai'
import { Strings } from '../../../src/utils/strings'

describe('Services: PilotStudyService', () => {
    const service = new PilotStudyService(new PilotStudyRepositoryMock(), new HealthProfessionalRepositoryMock())
    const pilot: PilotStudy = new PilotStudy().fromJSON(DefaultEntityMock.PILOT_STUDY)

    describe('add()', () => {
        context('when add new a pilot study', () => {
            it('should return a saved pilot study', () => {
                return service.add(pilot)
                    .then(result => {
                        console.log(result)
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

            it('should throw an error for name already exists', () => {
                pilot.name = 'exists'
                return service.add(pilot)
                    .catch(err => {
                        assert.property(err, 'message')
                        assert.equal(err.message, Strings.PILOT_STUDY.NAME_ALREADY_REGISTERED)
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
        })
    })
    // describe('getAll()')
    // describe('getById()')
    // describe('remove()')
    // describe('update()')
    // describe('associateHealthProfessional()')
    // describe('disassociateHealthProfessional()')
    // describe('getAllHealthProfessionals()')
})
