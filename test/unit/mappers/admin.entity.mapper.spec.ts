import { assert } from 'chai'
import { AdminEntityMapper } from '../../../src/infrastructure/entity/mapper/admin.entity.mapper'
import { DefaultEntityMock } from '../../mocks/models/default.entity.mock'
import { Admin } from '../../../src/application/domain/model/admin'
import { AdminEntity } from '../../../src/infrastructure/entity/admin.entity'

describe('Mappers: AdminEntityMapper', () => {
    const mapper = new AdminEntityMapper()
    const user: Admin = new Admin().fromJSON(DefaultEntityMock.ADMIN)
    user.id = DefaultEntityMock.ADMIN.id
    user.change_password = DefaultEntityMock.ADMIN.change_password
    user.email_verified = DefaultEntityMock.ADMIN.email_verified

    describe('transform()', () => {
        context('when the parameter is a json', () => {
            it('should call the jsonToModel() method', () => {
                const result = mapper.transform(DefaultEntityMock.ADMIN)
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
            })

            it('should return model without parameters for empty json', () => {
                const result = mapper.transform({})
                assert.property(result, 'scopes')
                assert.propertyVal(result, 'id', undefined)
                assert.propertyVal(result, 'email', undefined)
                assert.propertyVal(result, 'password', undefined)
                assert.propertyVal(result, 'change_password', undefined)
                assert.propertyVal(result, 'email_verified', undefined)
                assert.propertyVal(result, 'birth_date', undefined)
                assert.propertyVal(result, 'phone_number', undefined)
                assert.propertyVal(result, 'selected_pilot_study', undefined)
                assert.propertyVal(result, 'language', undefined)
            })

            it('should return model without parameter for undefined json', () => {
                const result = mapper.transform(undefined)
                assert.property(result, 'scopes')
                assert.propertyVal(result, 'id', undefined)
                assert.propertyVal(result, 'email', undefined)
                assert.propertyVal(result, 'password', undefined)
                assert.propertyVal(result, 'change_password', undefined)
                assert.propertyVal(result, 'email_verified', undefined)
                assert.propertyVal(result, 'birth_date', undefined)
                assert.propertyVal(result, 'phone_number', undefined)
                assert.propertyVal(result, 'selected_pilot_study', undefined)
                assert.propertyVal(result, 'language', undefined)
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
            })

            it('should return a model entity with basic parameters for empty model', () => {
                const admin: Admin = new Admin()
                admin.scopes = undefined!
                admin.type = undefined
                const result = mapper.transform(admin)
                assert.isEmpty(result)
            })
        })
    })

    describe('modelEntityToModel()', () => {
        context('when try to use modelEntityToModel() function', () => {
            it('should throw an error', () => {
                try {
                    mapper.modelEntityToModel(new AdminEntity())
                } catch (err) {
                    assert.property(err, 'message', 'Not implemented!')
                }
            })
        })
    })
})
