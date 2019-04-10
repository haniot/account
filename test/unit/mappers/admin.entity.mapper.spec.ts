import { assert } from 'chai'
import { AdminEntityMapper } from '../../../src/infrastructure/entity/mapper/admin.entity.mapper'
import { DefaultEntityMock } from '../../mocks/models/default.entity.mock'
import { Admin } from '../../../src/application/domain/model/admin'
import { AdminEntity } from '../../../src/infrastructure/entity/admin.entity'

describe('Mappers: AdminEntityMapper', () => {
    const mapper = new AdminEntityMapper()
    const userModel: Admin = new Admin().fromJSON(DefaultEntityMock.ADMIN)

    describe('transform()', () => {
        context('when the parameter is a json', () => {
            it('should call the jsonToModel() method', () => {
                const result = mapper.transform(DefaultEntityMock.ADMIN)
                assert.property(result, 'id')
                assert.propertyVal(result, 'id', userModel.id)
                assert.property(result, 'type')
                assert.propertyVal(result, 'type', userModel.type)
                assert.property(result, 'scopes')
                assert.deepPropertyVal(result, 'scopes', userModel.scopes)
                assert.property(result, 'password')
                assert.propertyVal(result, 'password', userModel.password)
                assert.property(result, 'email')
                assert.propertyVal(result, 'email', userModel.email)
            })

            it('should return model without parameters for empty json', () => {
                const result = mapper.transform({})
                assert.property(result, 'id')
                assert.propertyVal(result, 'id', undefined)
                assert.property(result, 'type')
                assert.propertyVal(result, 'type', 'admin')
                assert.property(result, 'scopes')
                assert.deepPropertyVal(result, 'scopes', userModel.scopes)
                assert.property(result, 'password')
                assert.propertyVal(result, 'password', undefined)
                assert.property(result, 'email')
                assert.propertyVal(result, 'email', undefined)
            })

            it('should return model without parameter for undefined json', () => {
                const result = mapper.transform(undefined)
                assert.property(result, 'id')
                assert.propertyVal(result, 'id', undefined)
                assert.property(result, 'type')
                assert.propertyVal(result, 'type', 'admin')
                assert.property(result, 'scopes')
                assert.deepPropertyVal(result, 'scopes', userModel.scopes)
                assert.property(result, 'password')
                assert.propertyVal(result, 'password', undefined)
                assert.property(result, 'email')
                assert.propertyVal(result, 'email', undefined)
            })

        })

        context('when the parameter is a model', () => {
            it('should call the modelToModelEntity() method', () => {
                const result = mapper.transform(userModel)
                assert.property(result, 'password')
                assert.propertyVal(result, 'password', userModel.password)
                assert.property(result, 'type')
                assert.propertyVal(result, 'type', userModel.type)
                assert.property(result, 'scopes')
                assert.deepPropertyVal(result, 'scopes', userModel.scopes)
            })

            it('should return a model entity with basic parameters for empty model', () => {
                const result = mapper.transform(new Admin())
                assert.property(result, 'type')
                assert.propertyVal(result, 'type', 'admin')
                assert.property(result, 'scopes')
                assert.deepPropertyVal(result, 'scopes', userModel.scopes)
            })
        })
    })

    describe('modelEntityToModel()', () => {
        context('when try to use modelEntityToModel() function', () => {
            it('should throw an error', () => {
                try {
                    mapper.modelEntityToModel(new AdminEntity())
                } catch (err) {
                    assert.property(err, 'message')
                    assert.property(err, 'message', 'Not implemented!')
                }
            })
        })
    })
})
