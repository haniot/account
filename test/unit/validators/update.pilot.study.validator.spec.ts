import { PilotStudy } from '../../../src/application/domain/model/pilot.study'
import { DefaultEntityMock } from '../../mocks/default.entity.mock'
import { assert } from 'chai'
import { UpdatePilotStudyValidator } from '../../../src/application/domain/validator/update.pilot.study.validator'

describe('Validators: UpdatePilotStudyValidator', () => {
    const pilot: PilotStudy = new PilotStudy().fromJSON(DefaultEntityMock.PILOT_STUDY)

    it('should return undefined when the validation was successful', () => {
        const result = UpdatePilotStudyValidator.validate(pilot)
        assert.equal(result, undefined)
        pilot.id = undefined
    })

    context('when the pilot study parameters was invalid', () => {
        it('should throw error for does pass a health professional in health_professionals_id without id', () => {
            pilot.health_professionals_id![0].id = undefined

            try {
                UpdatePilotStudyValidator.validate(pilot)
            } catch (err) {
                assert.property(err, 'message')
                assert.property(err, 'description')
                assert.equal(err.message, 'Pilot study parameters are invalid...')
                assert.equal(err.description, 'Pilot Study update validation: Collection with health_professional IDs ' +
                    '(ID cannot be empty) required!')
            } finally {
                pilot.health_professionals_id = DefaultEntityMock.PILOT_STUDY.health_professionals_id
            }
        })

        it('should throw error for does pass a health professional in health_professionals_id with invalid id', () => {
            pilot.health_professionals_id![0].id = '123'

            try {
                UpdatePilotStudyValidator.validate(pilot)
            } catch (err) {
                assert.property(err, 'message')
                assert.property(err, 'description')
                assert.equal(err.message, 'Some ID provided does not have a valid format!')
                assert.equal(err.description, 'A 24-byte hex ID similar to this: 507f191e810c19729de860ea is expected.')
            } finally {
                pilot.health_professionals_id = DefaultEntityMock.PILOT_STUDY.health_professionals_id
            }
        })
    })
})
