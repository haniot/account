import { assert } from 'chai'
import { DefaultEntityMock } from '../../mocks/models/default.entity.mock'
import { UserType } from '../../../src/application/domain/utils/user.type'
import { Patient } from '../../../src/application/domain/model/patient'

describe('Models: Patient', () => {
    describe('fromJSON()', () => {
        context('when pass a complete json', () => {
            it('should return a complete admin model', () => {
                const result = new Patient().fromJSON(DefaultEntityMock.PATIENT)
                assert.property(result, 'id')
                assert.propertyVal(result, 'type', UserType.PATIENT)
                assert.property(result, 'scopes')
                assert.propertyVal(result, 'name', DefaultEntityMock.PATIENT.name)
                assert.propertyVal(result, 'email', DefaultEntityMock.PATIENT.email)
                assert.propertyVal(result, 'password', DefaultEntityMock.PATIENT.password)
                assert.propertyVal(result, 'birth_date', DefaultEntityMock.PATIENT.birth_date)
                assert.propertyVal(result, 'phone_number', DefaultEntityMock.PATIENT.phone_number)
                assert.propertyVal(result, 'selected_pilot_study', DefaultEntityMock.PATIENT.selected_pilot_study)
                assert.propertyVal(result, 'language', DefaultEntityMock.PATIENT.language)
                assert.propertyVal(result, 'gender', DefaultEntityMock.PATIENT.gender)
            })
        })

        context('when does not pass a json', () => {
            it('should return a admin with some undefined parameters for undefined json', () => {
                const result = new Patient().fromJSON(undefined)
                assert.propertyVal(result, 'id', undefined)
                assert.propertyVal(result, 'type', UserType.PATIENT)
                assert.property(result, 'scopes')
                assert.propertyVal(result, 'email', undefined)
                assert.propertyVal(result, 'password', undefined)
                assert.propertyVal(result, 'birth_date', undefined)
                assert.propertyVal(result, 'phone_number', undefined)
                assert.propertyVal(result, 'selected_pilot_study', undefined)
                assert.propertyVal(result, 'language', undefined)
                assert.propertyVal(result, 'gender', undefined)
            })

            it('should return a admin with some undefined parameters for empty json', () => {
                const result = new Patient().fromJSON({})
                assert.propertyVal(result, 'id', undefined)
                assert.propertyVal(result, 'type', UserType.PATIENT)
                assert.property(result, 'scopes')
                assert.propertyVal(result, 'email', undefined)
                assert.propertyVal(result, 'password', undefined)
                assert.propertyVal(result, 'birth_date', undefined)
                assert.propertyVal(result, 'phone_number', undefined)
                assert.propertyVal(result, 'selected_pilot_study', undefined)
                assert.propertyVal(result, 'language', undefined)
                assert.propertyVal(result, 'gender', undefined)
            })
        })

        context('when does pass a json as string', () => {
            it('should return a complete admin model', () => {
                const result = new Patient().fromJSON(JSON.stringify(DefaultEntityMock.PATIENT))
                assert.property(result, 'id')
                assert.propertyVal(result, 'type', UserType.PATIENT)
                assert.property(result, 'scopes')
                assert.propertyVal(result, 'email', DefaultEntityMock.PATIENT.email)
                assert.propertyVal(result, 'password', DefaultEntityMock.PATIENT.password)
                assert.propertyVal(result, 'birth_date', DefaultEntityMock.PATIENT.birth_date)
                assert.propertyVal(result, 'phone_number', DefaultEntityMock.PATIENT.phone_number)
                assert.propertyVal(result, 'selected_pilot_study', DefaultEntityMock.PATIENT.selected_pilot_study)
                assert.propertyVal(result, 'language', DefaultEntityMock.PATIENT.language)
                assert.propertyVal(result, 'gender', DefaultEntityMock.PATIENT.gender)
            })

            it('should return a admin with id model', () => {
                const result = new Patient().fromJSON(DefaultEntityMock.PATIENT.id)
                assert.property(result, 'id')
                assert.propertyVal(result, 'type', UserType.PATIENT)
                assert.property(result, 'scopes')
            })

            it('should return a admin with some undefined parameters for empty string', () => {
                const result = new Patient().fromJSON('')
                assert.propertyVal(result, 'id', undefined)
                assert.propertyVal(result, 'type', UserType.PATIENT)
                assert.property(result, 'scopes')
                assert.propertyVal(result, 'email', undefined)
                assert.propertyVal(result, 'password', undefined)
                assert.propertyVal(result, 'birth_date', undefined)
                assert.propertyVal(result, 'phone_number', undefined)
                assert.propertyVal(result, 'selected_pilot_study', undefined)
                assert.propertyVal(result, 'language', undefined)
                assert.propertyVal(result, 'gender', undefined)
            })

            it('should return a admin with some undefined parameters for invalid string', () => {
                const result = new Patient().fromJSON('d52215d412')
                assert.propertyVal(result, 'type', UserType.PATIENT)
                assert.property(result, 'scopes')
                assert.propertyVal(result, 'email', undefined)
                assert.propertyVal(result, 'password', undefined)
                assert.propertyVal(result, 'birth_date', undefined)
                assert.propertyVal(result, 'phone_number', undefined)
                assert.propertyVal(result, 'selected_pilot_study', undefined)
                assert.propertyVal(result, 'language', undefined)
                assert.propertyVal(result, 'gender', undefined)
            })
        })
    })

    describe('toJSON()', () => {
        it('should return a admin as JSON', () => {
            const admin = new Patient().fromJSON(DefaultEntityMock.PATIENT)
            const result = admin.toJSON()
            assert.property(result, 'id')
            assert.propertyVal(result, 'type', UserType.PATIENT)
            assert.propertyVal(result, 'email', DefaultEntityMock.PATIENT.email)
            assert.propertyVal(result, 'birth_date', DefaultEntityMock.PATIENT.birth_date)
            assert.propertyVal(result, 'phone_number', DefaultEntityMock.PATIENT.phone_number)
            assert.propertyVal(result, 'selected_pilot_study', DefaultEntityMock.PATIENT.selected_pilot_study)
            assert.propertyVal(result, 'language', DefaultEntityMock.PATIENT.language)
            assert.propertyVal(result, 'gender', DefaultEntityMock.PATIENT.gender)
        })
    })
})
