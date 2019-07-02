import { assert } from 'chai'
import { CreatePilotStudyValidator } from '../../../src/application/domain/validator/create.pilot.study.validator'
import { DefaultEntityMock } from '../../mocks/models/default.entity.mock'
import { PilotStudy } from '../../../src/application/domain/model/pilot.study'
import { HealthProfessional } from '../../../src/application/domain/model/health.professional'

describe('Validators: CreatePilotStudyValidator', () => {
    const pilot: PilotStudy = new PilotStudy().fromJSON(DefaultEntityMock.PILOT_STUDY)

    it('should return undefined when the validation was successful', () => {
        const result = CreatePilotStudyValidator.validate(pilot)
        assert.equal(result, undefined)
    })

    context('when there are missing or invalid parameters', () => {
        it('should throw error for does not pass name', () => {
            pilot.name = undefined

            try {
                CreatePilotStudyValidator.validate(pilot)
            } catch (err) {
                assert.propertyVal(err, 'message', 'Required fields were not provided...')
                assert.propertyVal(err, 'description', 'Pilot Study validation: name required!')
            } finally {
                pilot.name = DefaultEntityMock.PILOT_STUDY.name
            }
        })

        it('should throw error for does not pass is_active', () => {
            pilot.is_active = undefined

            try {
                CreatePilotStudyValidator.validate(pilot)
            } catch (err) {
                assert.propertyVal(err, 'message', 'Required fields were not provided...')
                assert.propertyVal(err, 'description', 'Pilot Study validation: is_active required!')
            } finally {
                pilot.is_active = DefaultEntityMock.PILOT_STUDY.is_active
            }
        })

        it('should throw error for does not pass start', () => {
            pilot.start = undefined

            try {
                CreatePilotStudyValidator.validate(pilot)
            } catch (err) {
                assert.propertyVal(err, 'message', 'Required fields were not provided...')
                assert.propertyVal(err, 'description', 'Pilot Study validation: start required!')
            } finally {
                pilot.start = DefaultEntityMock.PILOT_STUDY.start
            }
        })

        it('should throw error for does not pass end', () => {
            pilot.end = undefined

            try {
                CreatePilotStudyValidator.validate(pilot)
            } catch (err) {
                assert.propertyVal(err, 'message', 'Required fields were not provided...')
                assert.propertyVal(err, 'description', 'Pilot Study validation: end required!')
            } finally {
                pilot.end = DefaultEntityMock.PILOT_STUDY.end
            }
        })

        it('should throw error for does pass health professional without id', () => {
            pilot.health_professionals = [new HealthProfessional()]
            try {
                CreatePilotStudyValidator.validate(pilot)
            } catch (err) {
                assert.propertyVal(err, 'message', 'Required fields were not provided...')
                assert.propertyVal(err, 'description', 'Pilot Study validation: Collection with health_professional IDs ' +
                    '(ID cannot be empty) required!')
            }
        })

        it('should throw error for does pass health professional with invalid id', () => {
            pilot.health_professionals = [new HealthProfessional().fromJSON('1a2b3c')]
            try {
                CreatePilotStudyValidator.validate(pilot)
            } catch (err) {
                assert.propertyVal(err, 'message', 'Some ID provided does not have a valid format!')
                assert.propertyVal(err, 'description', 'A 24-byte hex ID similar to this: 507f191e810c19729de860ea is expected.')
            } finally {
                pilot.health_professionals = undefined
            }

        })
    })
})
