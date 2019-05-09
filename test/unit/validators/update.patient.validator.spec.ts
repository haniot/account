import { Patient } from '../../../src/application/domain/model/patient'
import { DefaultEntityMock } from '../../mocks/models/default.entity.mock'
import { UpdatePatientValidator } from '../../../src/application/domain/validator/update.patient.validator'
import { assert } from 'chai'
import { Strings } from '../../../src/utils/strings'

describe('Validators: UpdatePatientValidator', () => {
    const patient: Patient = new Patient().fromJSON(DefaultEntityMock.PATIENT)
    patient.id = undefined
    patient.pilotstudy_id = undefined
    patient.password = undefined

    it('should return undefined when the validation is successful', () => {
        const result = UpdatePatientValidator.validate(patient)
        assert.equal(result, undefined)
    })

    context('when there are validation errors', () => {
        it('should throw an error for pass invalid id', () => {
            patient.id = '123'
            try {
                UpdatePatientValidator.validate(patient)
            } catch (err) {
                assert.property(err, 'message')
                assert.property(err, 'description')
                assert.propertyVal(err, 'message', Strings.ERROR_MESSAGE.UUID_NOT_VALID_FORMAT)
                assert.propertyVal(err, 'description', Strings.ERROR_MESSAGE.UUID_NOT_VALID_FORMAT_DESC)
            } finally {
                patient.id = undefined
            }
        })

        it('should throw an error for does pass pilotstudy_id', () => {
            patient.pilotstudy_id = DefaultEntityMock.PATIENT.pilotstudy_id
            try {
                UpdatePatientValidator.validate(patient)
            } catch (err) {
                assert.property(err, 'message')
                assert.propertyVal(err, 'message', 'pilotstudy_id: '.concat(Strings.PARAMETERS.COULD_NOT_BE_UPDATED))
            } finally {
                patient.pilotstudy_id = undefined
            }
        })

        it('should throw an error for does pass invalid gender', () => {
            patient.gender = 'invalid'
            try {
                UpdatePatientValidator.validate(patient)
            } catch (err) {
                assert.property(err, 'message')
                assert.property(err, 'description')
                assert.propertyVal(err, 'message', 'Value not mapped for gender: invalid')
                assert.propertyVal(err, 'description', 'The mapped values are: male, female.')
            } finally {
                patient.gender = undefined
            }
        })

        it('should throw an error for does pass invalid birth_date', () => {
            patient.birth_date = '20-08-1987'
            try {
                UpdatePatientValidator.validate(patient)
            } catch (err) {
                assert.property(err, 'message')
                assert.property(err, 'description')
                assert.propertyVal(err, 'message', 'Date: 20-08-1987 is not in valid ISO 8601 format.')
                assert.propertyVal(err, 'description', 'Date must be in the format: yyyy-MM-dd')
            }
        })
    })

})
