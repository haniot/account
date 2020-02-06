import { assert } from 'chai'
import { DefaultEntityMock } from '../../mocks/models/default.entity.mock'
import { HealthProfessional } from '../../../src/application/domain/model/health.professional'
import { HealthProfessionalEntity } from '../../../src/infrastructure/entity/health.professional.entity'
import { HealthProfessionalEntityMapper } from '../../../src/infrastructure/entity/mapper/health.professional.entity.mapper'

describe('Mappers: HealthProfessionalEntityMapper', () => {
    const mapper = new HealthProfessionalEntityMapper()
    const user: HealthProfessional = new HealthProfessional().fromJSON(DefaultEntityMock.HEALTH_PROFESSIONAL)
    user.id = DefaultEntityMock.HEALTH_PROFESSIONAL.id
    user.change_password = DefaultEntityMock.HEALTH_PROFESSIONAL.change_password
    user.email_verified = DefaultEntityMock.HEALTH_PROFESSIONAL.email_verified

    describe('transform()', () => {
        context('when the parameter is a json', () => {
            it('should call the jsonToModel() method', () => {
                const result = mapper.transform(DefaultEntityMock.HEALTH_PROFESSIONAL)
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
                assert.propertyVal(result, 'health_area', user.health_area)
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
                assert.propertyVal(result, 'health_area', undefined)
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
                assert.propertyVal(result, 'health_area', undefined)
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
                assert.propertyVal(result, 'health_area', user.health_area)
            })

            it('should return a model entity with basic parameters for empty model', () => {
                const health: HealthProfessional = new HealthProfessional()
                health.scopes = undefined!
                health.type = undefined
                health.language = undefined
                health.change_password = undefined
                health.email_verified = undefined
                const result = mapper.transform(health)
                assert.isEmpty(result)
            })
        })
    })

    describe('modelEntityToModel()', () => {
        context('when try to use modelEntityToModel() function', () => {
            it('should throw an error', () => {
                try {
                    mapper.modelEntityToModel(new HealthProfessionalEntity())
                } catch (err) {
                    assert.property(err, 'message', 'Not implemented!')
                }
            })
        })
    })
})
