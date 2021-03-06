import { assert } from 'chai'
import { Admin } from '../../../src/application/domain/model/admin'
import { DefaultEntityMock } from '../../mocks/models/default.entity.mock'
import { UserType } from '../../../src/application/domain/utils/user.type'

describe('Models: Admin', () => {
    describe('fromJSON()', () => {
        context('when pass a complete json', () => {
            it('should return a complete admin model', () => {
                const result = new Admin().fromJSON(DefaultEntityMock.ADMIN)
                assert.property(result, 'id')
                assert.propertyVal(result, 'type', UserType.ADMIN)
                assert.property(result, 'scopes')
                assert.propertyVal(result, 'email', DefaultEntityMock.ADMIN.email)
                assert.propertyVal(result, 'password', DefaultEntityMock.ADMIN.password)
                assert.propertyVal(result, 'birth_date', DefaultEntityMock.ADMIN.birth_date)
                assert.propertyVal(result, 'phone_number', DefaultEntityMock.ADMIN.phone_number)
                assert.propertyVal(result, 'selected_pilot_study', DefaultEntityMock.ADMIN.selected_pilot_study)
                assert.propertyVal(result, 'language', DefaultEntityMock.ADMIN.language)
            })
        })

        context('when does not pass a json', () => {
            it('should return a admin with some undefined parameters for undefined json', () => {
                const result = new Admin().fromJSON(undefined)
                assert.propertyVal(result, 'id', undefined)
                assert.propertyVal(result, 'type', UserType.ADMIN)
                assert.property(result, 'scopes')
                assert.propertyVal(result, 'email', undefined)
                assert.propertyVal(result, 'password', undefined)
                assert.propertyVal(result, 'birth_date', undefined)
                assert.propertyVal(result, 'phone_number', undefined)
                assert.propertyVal(result, 'selected_pilot_study', undefined)
                assert.propertyVal(result, 'total_pilot_studies', undefined)
                assert.propertyVal(result, 'total_admins', undefined)
                assert.propertyVal(result, 'total_health_professionals', undefined)
                assert.propertyVal(result, 'total_patients', undefined)
            })

            it('should return a admin with some undefined parameters for empty json', () => {
                const result = new Admin().fromJSON({})
                assert.propertyVal(result, 'id', undefined)
                assert.propertyVal(result, 'type', UserType.ADMIN)
                assert.property(result, 'scopes')
                assert.propertyVal(result, 'email', undefined)
                assert.propertyVal(result, 'password', undefined)
                assert.propertyVal(result, 'birth_date', undefined)
                assert.propertyVal(result, 'phone_number', undefined)
                assert.propertyVal(result, 'selected_pilot_study', undefined)
                assert.propertyVal(result, 'total_pilot_studies', undefined)
                assert.propertyVal(result, 'total_admins', undefined)
                assert.propertyVal(result, 'total_health_professionals', undefined)
                assert.propertyVal(result, 'total_patients', undefined)
            })
        })

        context('when does pass a json as string', () => {
            it('should return a complete admin model', () => {
                const result = new Admin().fromJSON(JSON.stringify(DefaultEntityMock.ADMIN))
                assert.property(result, 'id')
                assert.propertyVal(result, 'type', UserType.ADMIN)
                assert.property(result, 'scopes')
                assert.propertyVal(result, 'email', DefaultEntityMock.ADMIN.email)
                assert.propertyVal(result, 'password', DefaultEntityMock.ADMIN.password)
                assert.propertyVal(result, 'birth_date', DefaultEntityMock.ADMIN.birth_date)
                assert.propertyVal(result, 'phone_number', DefaultEntityMock.ADMIN.phone_number)
                assert.propertyVal(result, 'selected_pilot_study', DefaultEntityMock.ADMIN.selected_pilot_study)
                assert.propertyVal(result, 'language', DefaultEntityMock.ADMIN.language)
            })

            it('should return a admin with id model', () => {
                const result = new Admin().fromJSON(DefaultEntityMock.ADMIN.id)
                assert.property(result, 'id')
                assert.propertyVal(result, 'type', UserType.ADMIN)
                assert.property(result, 'scopes')
            })

            it('should return a admin with some undefined parameters for empty string', () => {
                const result = new Admin().fromJSON('')
                assert.propertyVal(result, 'id', undefined)
                assert.propertyVal(result, 'type', UserType.ADMIN)
                assert.property(result, 'scopes')
                assert.propertyVal(result, 'email', undefined)
                assert.propertyVal(result, 'password', undefined)
                assert.propertyVal(result, 'birth_date', undefined)
                assert.propertyVal(result, 'phone_number', undefined)
                assert.propertyVal(result, 'selected_pilot_study', undefined)
                assert.propertyVal(result, 'total_pilot_studies', undefined)
                assert.propertyVal(result, 'total_admins', undefined)
                assert.propertyVal(result, 'total_health_professionals', undefined)
                assert.propertyVal(result, 'total_patients', undefined)
            })

            it('should return a admin with some undefined parameters for invalid string', () => {
                const result = new Admin().fromJSON('d52215d412')
                assert.propertyVal(result, 'type', UserType.ADMIN)
                assert.property(result, 'scopes')
                assert.propertyVal(result, 'email', undefined)
                assert.propertyVal(result, 'password', undefined)
                assert.propertyVal(result, 'birth_date', undefined)
                assert.propertyVal(result, 'phone_number', undefined)
                assert.propertyVal(result, 'selected_pilot_study', undefined)
                assert.propertyVal(result, 'total_pilot_studies', undefined)
                assert.propertyVal(result, 'total_admins', undefined)
                assert.propertyVal(result, 'total_health_professionals', undefined)
                assert.propertyVal(result, 'total_patients', undefined)
            })
        })
    })

    describe('toJSON()', () => {
        it('should return a admin as JSON', () => {
            const admin = new Admin().fromJSON(DefaultEntityMock.ADMIN)
            const result = admin.toJSON()
            assert.property(result, 'id')
            assert.propertyVal(result, 'type', UserType.ADMIN)
            assert.propertyVal(result, 'email', DefaultEntityMock.ADMIN.email)
            assert.propertyVal(result, 'birth_date', DefaultEntityMock.ADMIN.birth_date)
            assert.propertyVal(result, 'phone_number', DefaultEntityMock.ADMIN.phone_number)
            assert.propertyVal(result, 'selected_pilot_study', DefaultEntityMock.ADMIN.selected_pilot_study)
            assert.propertyVal(result, 'language', DefaultEntityMock.ADMIN.language)
        })
    })
})
