import { assert } from 'chai'
import { DefaultEntityMock } from '../../mocks/models/default.entity.mock'
import { HealthProfessionalEntityMapper } from '../../../src/infrastructure/entity/mapper/health.professional.entity.mapper'
import { HealthProfessional } from '../../../src/application/domain/model/health.professional'
import { HealthProfessionalEntity } from '../../../src/infrastructure/entity/health.professional.entity'

describe('Mappers: HealthProfessionalEntityMapper', () => {
    const mapper = new HealthProfessionalEntityMapper()
    const userModel: HealthProfessional = new HealthProfessional().fromJSON(DefaultEntityMock.HEALTH_PROFESSIONAL)

    describe('transform()', () => {
        context('when the parameter is a json', () => {
            it('should call the jsonToModel() method', () => {
                const result = mapper.transform(DefaultEntityMock.HEALTH_PROFESSIONAL)
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
                assert.propertyVal(result, 'type', 'health_professional')
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
                assert.propertyVal(result, 'type', 'health_professional')
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
                const result = mapper.transform(new HealthProfessional())
                assert.property(result, 'type')
                assert.propertyVal(result, 'type', 'health_professional')
                assert.property(result, 'scopes')
                assert.deepPropertyVal(result, 'scopes', userModel.scopes)
            })
        })
    })

    describe('modelEntityToModel()', () => {
        context('when try to use modelEntityToModel() function', () => {
            it('should throw an error', () => {
                try {
                    mapper.modelEntityToModel(new HealthProfessionalEntity())
                } catch (err) {
                    assert.property(err, 'message')
                    assert.property(err, 'message', 'Not implemented!')
                }
            })
        })
    })
})
