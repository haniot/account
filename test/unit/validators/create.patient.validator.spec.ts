import { Patient } from '../../../src/application/domain/model/patient'
import { DefaultEntityMock } from '../../mocks/models/default.entity.mock'
import { assert } from 'chai'
import { CreatePatientValidator } from '../../../src/application/domain/validator/create.patient.validator'

describe('Validators: CreatePatientValidator', () => {
    const patient: Patient = new Patient().fromJSON(DefaultEntityMock.PATIENT)

    it('should return undefined when the validation is successful', () => {
        const result = CreatePatientValidator.validate(patient)
        assert.equal(result, undefined)
    })

    context('when there are validation errors', () => {
        it('should throw an error for does not pass name', () => {
            patient.name = undefined
            try {
                CreatePatientValidator.validate(patient)
            } catch (err) {
                assert.property(err, 'message')
                assert.property(err, 'description')
                assert.propertyVal(err, 'message', 'Required fields were not provided...')
                assert.propertyVal(err, 'description', 'Patient validation: name is required!')
            } finally {
                patient.name = DefaultEntityMock.PATIENT.name
            }
        })

        it('should throw an error for does not pass email', () => {
            patient.email = undefined
            try {
                CreatePatientValidator.validate(patient)
            } catch (err) {
                assert.property(err, 'message')
                assert.property(err, 'description')
                assert.propertyVal(err, 'message', 'Required fields were not provided...')
                assert.propertyVal(err, 'description', 'Patient validation: email is required!')
            } finally {
                patient.email = DefaultEntityMock.PATIENT.email
            }
        })

        it('should throw an error for does not pass password', () => {
            patient.password = undefined
            try {
                CreatePatientValidator.validate(patient)
            } catch (err) {
                assert.property(err, 'message')
                assert.property(err, 'description')
                assert.propertyVal(err, 'message', 'Required fields were not provided...')
                assert.propertyVal(err, 'description', 'Patient validation: password is required!')
            } finally {
                patient.password = DefaultEntityMock.PATIENT.password
            }
        })


        it('should throw an error for does not pass gender', () => {
            patient.gender = undefined
            try {
                CreatePatientValidator.validate(patient)
            } catch (err) {
                assert.property(err, 'message')
                assert.property(err, 'description')
                assert.propertyVal(err, 'message', 'Required fields were not provided...')
                assert.propertyVal(err, 'description', 'Patient validation: gender is required!')
            }
        })

        it('should throw an error for does pass invalid gender', () => {
            patient.gender = 'invalid'
            try {
                CreatePatientValidator.validate(patient)
            } catch (err) {
                assert.property(err, 'message')
                assert.property(err, 'description')
                assert.propertyVal(err, 'message', 'Value not mapped for gender: invalid')
                assert.propertyVal(err, 'description', 'The mapped values are: male, female.')
            } finally {
                patient.gender = DefaultEntityMock.PATIENT.gender
            }
        })

        it('should throw an error for does not pass birth_date', () => {
            patient.birth_date = undefined
            try {
                CreatePatientValidator.validate(patient)
            } catch (err) {
                assert.property(err, 'message')
                assert.property(err, 'description')
                assert.propertyVal(err, 'message', 'Required fields were not provided...')
                assert.propertyVal(err, 'description', 'Patient validation: birth_date is required!')
            }
        })

        it('should throw an error for does pass invalid birth_date', () => {
            patient.birth_date = '20-08-1987'
            try {
                CreatePatientValidator.validate(patient)
            } catch (err) {
                assert.property(err, 'message')
                assert.property(err, 'description')
                assert.propertyVal(err, 'message', 'Date: 20-08-1987 is not in valid ISO 8601 format.')
                assert.propertyVal(err, 'description', 'Date must be in the format: yyyy-MM-dd')
            }
        })
    })
})
