import { assert } from 'chai'
import { DefaultEntityMock } from '../../mocks/models/default.entity.mock'
import { UserEntityMapper } from '../../../src/infrastructure/entity/mapper/user.entity.mapper'
import { User } from '../../../src/application/domain/model/user'
import { UserEntity } from '../../../src/infrastructure/entity/user.entity'

describe('Mappers: UserEntityMapper', () => {
    const mapper = new UserEntityMapper()
    const user: User = new User().fromJSON(DefaultEntityMock.USER)
    user.id = DefaultEntityMock.USER.id
    user.change_password = DefaultEntityMock.USER.change_password
    user.email_verified = DefaultEntityMock.USER.email_verified

    describe('transform()', () => {
        context('when the parameter is a json', () => {
            it('should call the jsonToModel() method', () => {
                const result = mapper.transform(DefaultEntityMock.USER)
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
                assert.propertyVal(result, 'change_password', false)
                assert.propertyVal(result, 'email_verified', false)
                assert.propertyVal(result, 'birth_date', undefined)
                assert.propertyVal(result, 'phone_number', undefined)
                assert.propertyVal(result, 'selected_pilot_study', undefined)
            })

            it('should return model without parameter for undefined json', () => {
                const result = mapper.transform(undefined)
                assert.property(result, 'scopes')
                assert.propertyVal(result, 'id', undefined)
                assert.propertyVal(result, 'email', undefined)
                assert.propertyVal(result, 'password', undefined)
                assert.propertyVal(result, 'change_password', false)
                assert.propertyVal(result, 'email_verified', false)
                assert.propertyVal(result, 'birth_date', undefined)
                assert.propertyVal(result, 'phone_number', undefined)
                assert.propertyVal(result, 'selected_pilot_study', undefined)
            })

        })

        context('when the parameter is a model', () => {
            it('should call the modelToModelEntity() method', () => {
                const result = mapper.transform(user)
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
                const admin: User = new User()
                admin.scopes = undefined!
                admin.type = undefined
                admin.language = undefined
                admin.change_password = undefined
                admin.email_verified = undefined
                const result = mapper.transform(admin)
                assert.isEmpty(result)
            })
        })
    })

    describe('modelEntityToModel()', () => {
        context('when try to use modelEntityToModel() function', () => {
            it('should throw an error', () => {
                try {
                    mapper.modelEntityToModel(new UserEntity())
                } catch (err) {
                    assert.property(err, 'message', 'Not implemented!')
                }
            })
        })
    })
})
