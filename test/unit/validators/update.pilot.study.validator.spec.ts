import { PilotStudy } from '../../../src/application/domain/model/pilot.study'
import { DefaultEntityMock } from '../../mocks/models/default.entity.mock'
import { assert } from 'chai'
import { UpdatePilotStudyValidator } from '../../../src/application/domain/validator/update.pilot.study.validator'
import { HealthProfessional } from '../../../src/application/domain/model/health.professional'
import { Patient } from '../../../src/application/domain/model/patient'

describe('Validators: UpdatePilotStudyValidator', () => {
    const pilot: PilotStudy = new PilotStudy().fromJSON(DefaultEntityMock.PILOT_STUDY)
    pilot.health_professionals = undefined
    pilot.patients = undefined

    it('should return undefined when the validation was successful', () => {
        const result = UpdatePilotStudyValidator.validate(pilot)
        assert.equal(result, undefined)
    })

    context('when does not pass the id', () => {
        pilot.id = undefined
        it('should return undefined when the validation was successful', () => {
            const result = UpdatePilotStudyValidator.validate(pilot)
            assert.equal(result, undefined)
            pilot.id = DefaultEntityMock.PILOT_STUDY.id
        })
    })

    context('when the pilot study parameters was invalid', () => {
        it('should return error for pass a invalid id', () => {
            pilot.id = '123'
            try {
                UpdatePilotStudyValidator.validate(pilot)
            } catch (err) {
                assert.property(err, 'message')
                assert.property(err, 'description')
                assert.equal(err.message, 'Some ID provided does not have a valid format!')
                assert.equal(err.description, 'A 24-byte hex ID similar to this: 507f191e810c19729de860ea is expected.')
            } finally {
                pilot.id = DefaultEntityMock.PILOT_STUDY.id
            }
        })

        it('should throw error for does pass a health_professionals_id list', () => {
            pilot.health_professionals = [new HealthProfessional().fromJSON(DefaultEntityMock.HEALTH_PROFESSIONAL)]
            try {
                UpdatePilotStudyValidator.validate(pilot)
            } catch (err) {
                assert.property(err, 'message')
                assert.property(err, 'description')
                assert.equal(err.message, 'This parameter could not be updated.')
                assert.equal(err.description, 'A specific route to manage health_professionals already exists.')
            } finally {
                pilot.health_professionals = undefined
            }
        })

        it('should throw error for does pass a patients list', () => {
            pilot.patients = [new Patient().fromJSON(DefaultEntityMock.PATIENT)]
            try {
                UpdatePilotStudyValidator.validate(pilot)
            } catch (err) {
                assert.property(err, 'message')
                assert.property(err, 'description')
                assert.equal(err.message, 'This parameter could not be updated.')
                assert.equal(err.description, 'A specific route to manage patients already exists.')
            }
        })
    })
})
