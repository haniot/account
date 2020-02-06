import { assert } from 'chai'
import { DefaultEntityMock } from '../../mocks/models/default.entity.mock'
import { PatientEntityMapper } from '../../../src/infrastructure/entity/mapper/patient.entity.mapper'
import { PatientEntity } from '../../../src/infrastructure/entity/patient.entity'
import { Patient } from '../../../src/application/domain/model/patient'

describe('Mappers: PatientEntityMapper', () => {
    const mapper = new PatientEntityMapper()
    const user: Patient = new Patient().fromJSON(DefaultEntityMock.PATIENT)
    user.id = DefaultEntityMock.PATIENT.id
    user.change_password = DefaultEntityMock.PATIENT.change_password
    user.email_verified = DefaultEntityMock.PATIENT.email_verified
    user.type = 'user'

    describe('transform()', () => {
        context('when the parameter is a json', () => {
            it('should call the jsonToModel() method', () => {
                const result = mapper.transform(DefaultEntityMock.PATIENT)
                assert.property(result, 'scopes')
                assert.propertyVal(result, 'id', user.id)
                assert.propertyVal(result, 'email', user.email)
                assert.propertyVal(result, 'password', user.password)
                assert.propertyVal(result, 'change_password', user.change_password)
                assert.propertyVal(result, 'email_verified', user.email_verified)
                assert.propertyVal(result, 'birth_date', user.birth_date)
                assert.propertyVal(result, 'phone_number', user.phone_number)
                assert.propertyVal(result, 'selected_pilot_study', user.selected_pilot_study)
                assert.propertyVal(result, 'language', user.language)
                assert.propertyVal(result, 'gender', user.gender)
            })

            it('should return model without parameters for empty json', () => {
                const result = mapper.transform({})
                assert.property(result, 'scopes')
                assert.propertyVal(result, 'id', undefined)
                assert.propertyVal(result, 'email', undefined)
                assert.propertyVal(result, 'password', undefined)
                assert.propertyVal(result, 'birth_date', undefined)
                assert.propertyVal(result, 'phone_number', undefined)
                assert.propertyVal(result, 'selected_pilot_study', undefined)
                assert.propertyVal(result, 'gender', undefined)
            })

            it('should return model without parameter for undefined json', () => {
                const result = mapper.transform(undefined)
                assert.property(result, 'scopes')
                assert.propertyVal(result, 'id', undefined)
                assert.propertyVal(result, 'email', undefined)
                assert.propertyVal(result, 'password', undefined)
                assert.propertyVal(result, 'birth_date', undefined)
                assert.propertyVal(result, 'phone_number', undefined)
                assert.propertyVal(result, 'selected_pilot_study', undefined)
                assert.propertyVal(result, 'gender', undefined)
            })

        })

        context('when the parameter is a model', () => {
            it('should call the modelToModelEntity() method', () => {
                const result = mapper.transform(user)
                assert.property(result, 'scopes')
                assert.propertyVal(result, 'id', user.id)
                assert.propertyVal(result, 'email', user.email)
                assert.propertyVal(result, 'password', user.password)
                assert.propertyVal(result, 'change_password', user.change_password)
                assert.propertyVal(result, 'email_verified', user.email_verified)
                assert.propertyVal(result, 'birth_date', user.birth_date)
                assert.propertyVal(result, 'phone_number', user.phone_number)
                assert.propertyVal(result, 'selected_pilot_study', user.selected_pilot_study)
                assert.propertyVal(result, 'language', user.language)
                assert.propertyVal(result, 'gender', user.gender)
            })

            it('should return a model entity with basic parameters for empty model', () => {
                const patient: Patient = new Patient()
                patient.scopes = undefined!
                patient.type = undefined
                patient.language = undefined
                patient.goals = undefined!
                patient.external_services = undefined!
                patient.change_password = undefined
                patient.email_verified = undefined
                const result = mapper.transform(patient)
                assert.isEmpty(result)
            })
        })
    })

    describe('modelEntityToModel()', () => {
        context('when try to use modelEntityToModel() function', () => {
            it('should throw an error', () => {
                try {
                    mapper.modelEntityToModel(new PatientEntity())
                } catch (err) {
                    assert.property(err, 'message', 'Not implemented!')
                }
            })
        })
    })
})
