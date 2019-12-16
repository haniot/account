import { assert } from 'chai'
import { DefaultEntityMock } from '../../mocks/models/default.entity.mock'
import { UserType } from '../../../src/application/domain/utils/user.type'
import { HealthProfessional } from '../../../src/application/domain/model/health.professional'

describe('Models: HealthProfessional', () => {
    describe('fromJSON()', () => {
        context('when pass a complete json', () => {
            it('should return a complete admin model', () => {
                const result = new HealthProfessional().fromJSON(DefaultEntityMock.HEALTH_PROFESSIONAL)
                assert.property(result, 'id')
                assert.propertyVal(result, 'type', UserType.HEALTH_PROFESSIONAL)
                assert.property(result, 'scopes')
                assert.propertyVal(result, 'name', DefaultEntityMock.HEALTH_PROFESSIONAL.name)
                assert.propertyVal(result, 'email', DefaultEntityMock.HEALTH_PROFESSIONAL.email)
                assert.propertyVal(result, 'password', DefaultEntityMock.HEALTH_PROFESSIONAL.password)
                assert.propertyVal(result, 'birth_date', DefaultEntityMock.HEALTH_PROFESSIONAL.birth_date)
                assert.propertyVal(result, 'phone_number', DefaultEntityMock.HEALTH_PROFESSIONAL.phone_number)
                assert.propertyVal(result, 'selected_pilot_study', DefaultEntityMock.HEALTH_PROFESSIONAL.selected_pilot_study)
                assert.propertyVal(result, 'language', DefaultEntityMock.HEALTH_PROFESSIONAL.language)
                assert.propertyVal(result, 'health_area', DefaultEntityMock.HEALTH_PROFESSIONAL.health_area)
            })
        })

        context('when does not pass a json', () => {
            it('should return a admin with some undefined parameters for undefined json', () => {
                const result = new HealthProfessional().fromJSON(undefined)
                assert.propertyVal(result, 'id', undefined)
                assert.propertyVal(result, 'type', UserType.HEALTH_PROFESSIONAL)
                assert.property(result, 'scopes')
                assert.propertyVal(result, 'email', undefined)
                assert.propertyVal(result, 'password', undefined)
                assert.propertyVal(result, 'birth_date', undefined)
                assert.propertyVal(result, 'phone_number', undefined)
                assert.propertyVal(result, 'selected_pilot_study', undefined)
                assert.propertyVal(result, 'total_pilot_studies', undefined)
                assert.propertyVal(result, 'total_patients', undefined)
                assert.propertyVal(result, 'health_area', undefined)
            })

            it('should return a admin with some undefined parameters for empty json', () => {
                const result = new HealthProfessional().fromJSON({})
                assert.propertyVal(result, 'id', undefined)
                assert.propertyVal(result, 'type', UserType.HEALTH_PROFESSIONAL)
                assert.property(result, 'scopes')
                assert.propertyVal(result, 'email', undefined)
                assert.propertyVal(result, 'password', undefined)
                assert.propertyVal(result, 'birth_date', undefined)
                assert.propertyVal(result, 'phone_number', undefined)
                assert.propertyVal(result, 'selected_pilot_study', undefined)
                assert.propertyVal(result, 'total_pilot_studies', undefined)
                assert.propertyVal(result, 'total_patients', undefined)
                assert.propertyVal(result, 'health_area', undefined)
            })
        })

        context('when does pass a json as string', () => {
            it('should return a complete admin model', () => {
                const result = new HealthProfessional().fromJSON(JSON.stringify(DefaultEntityMock.HEALTH_PROFESSIONAL))
                assert.property(result, 'id')
                assert.propertyVal(result, 'type', UserType.HEALTH_PROFESSIONAL)
                assert.property(result, 'scopes')
                assert.propertyVal(result, 'email', DefaultEntityMock.HEALTH_PROFESSIONAL.email)
                assert.propertyVal(result, 'password', DefaultEntityMock.HEALTH_PROFESSIONAL.password)
                assert.propertyVal(result, 'birth_date', DefaultEntityMock.HEALTH_PROFESSIONAL.birth_date)
                assert.propertyVal(result, 'phone_number', DefaultEntityMock.HEALTH_PROFESSIONAL.phone_number)
                assert.propertyVal(result, 'selected_pilot_study', DefaultEntityMock.HEALTH_PROFESSIONAL.selected_pilot_study)
                assert.propertyVal(result, 'language', DefaultEntityMock.HEALTH_PROFESSIONAL.language)
                assert.propertyVal(result, 'health_area', DefaultEntityMock.HEALTH_PROFESSIONAL.health_area)
            })

            it('should return a admin with id model', () => {
                const result = new HealthProfessional().fromJSON(DefaultEntityMock.HEALTH_PROFESSIONAL.id)
                assert.property(result, 'id')
                assert.propertyVal(result, 'type', UserType.HEALTH_PROFESSIONAL)
                assert.property(result, 'scopes')
            })

            it('should return a admin with some undefined parameters for empty string', () => {
                const result = new HealthProfessional().fromJSON('')
                assert.propertyVal(result, 'id', undefined)
                assert.propertyVal(result, 'type', UserType.HEALTH_PROFESSIONAL)
                assert.property(result, 'scopes')
                assert.propertyVal(result, 'email', undefined)
                assert.propertyVal(result, 'password', undefined)
                assert.propertyVal(result, 'birth_date', undefined)
                assert.propertyVal(result, 'phone_number', undefined)
                assert.propertyVal(result, 'selected_pilot_study', undefined)
                assert.propertyVal(result, 'total_pilot_studies', undefined)
                assert.propertyVal(result, 'total_patients', undefined)
                assert.propertyVal(result, 'health_area', undefined)
            })

            it('should return a admin with some undefined parameters for invalid string', () => {
                const result = new HealthProfessional().fromJSON('d52215d412')
                assert.propertyVal(result, 'type', UserType.HEALTH_PROFESSIONAL)
                assert.property(result, 'scopes')
                assert.propertyVal(result, 'email', undefined)
                assert.propertyVal(result, 'password', undefined)
                assert.propertyVal(result, 'birth_date', undefined)
                assert.propertyVal(result, 'phone_number', undefined)
                assert.propertyVal(result, 'selected_pilot_study', undefined)
                assert.propertyVal(result, 'total_pilot_studies', undefined)
                assert.propertyVal(result, 'total_patients', undefined)
                assert.propertyVal(result, 'health_area', undefined)
            })
        })
    })

    describe('toJSON()', () => {
        it('should return a admin as JSON', () => {
            const admin = new HealthProfessional().fromJSON(DefaultEntityMock.HEALTH_PROFESSIONAL)
            const result = admin.toJSON()
            assert.property(result, 'id')
            assert.propertyVal(result, 'type', UserType.HEALTH_PROFESSIONAL)
            assert.propertyVal(result, 'email', DefaultEntityMock.HEALTH_PROFESSIONAL.email)
            assert.propertyVal(result, 'birth_date', DefaultEntityMock.HEALTH_PROFESSIONAL.birth_date)
            assert.propertyVal(result, 'phone_number', DefaultEntityMock.HEALTH_PROFESSIONAL.phone_number)
            assert.propertyVal(result, 'selected_pilot_study', DefaultEntityMock.HEALTH_PROFESSIONAL.selected_pilot_study)
            assert.propertyVal(result, 'language', DefaultEntityMock.HEALTH_PROFESSIONAL.language)
            assert.propertyVal(result, 'health_area', DefaultEntityMock.HEALTH_PROFESSIONAL.health_area)
        })
    })
})
