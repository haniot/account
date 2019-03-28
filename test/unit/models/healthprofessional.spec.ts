import { DefaultEntityMock } from '../../mocks/default.entity.mock'
import { assert } from 'chai'
import { UserType } from '../../../src/application/domain/utils/user.type'
import { HealthProfessional } from '../../../src/application/domain/model/health.professional'

describe('Models: HealthProfessional', () => {
    describe('fromJSON()', () => {
        context('when pass a complete json', () => {
            it('should return a complete health professional model', () => {
                const result = new HealthProfessional().fromJSON(DefaultEntityMock.HEALTH_PROFESSIONAL)
                assert.property(result, 'id')
                assert.propertyVal(result, 'id', DefaultEntityMock.HEALTH_PROFESSIONAL.id)
                assert.property(result, 'type')
                assert.propertyVal(result, 'type', UserType.HEALTH_PROFESSIONAL)
                assert.property(result, 'scopes')
                assert.property(result, 'email')
                assert.propertyVal(result, 'email', DefaultEntityMock.HEALTH_PROFESSIONAL.email)
                assert.property(result, 'password')
                assert.propertyVal(result, 'password', DefaultEntityMock.HEALTH_PROFESSIONAL.password)
                assert.property(result, 'name')
                assert.propertyVal(result, 'name', DefaultEntityMock.HEALTH_PROFESSIONAL.name)
                assert.property(result, 'health_area')
                assert.propertyVal(result, 'health_area', DefaultEntityMock.HEALTH_PROFESSIONAL.health_area)
            })
        })

        context('when does not pass a json', () => {
            it('should return a health professional with some undefined parameters', () => {
                const result = new HealthProfessional().fromJSON(undefined)
                assert.property(result, 'id')
                assert.propertyVal(result, 'id', undefined)
                assert.property(result, 'type')
                assert.propertyVal(result, 'type', UserType.HEALTH_PROFESSIONAL)
                assert.property(result, 'scopes')
                assert.property(result, 'email')
                assert.propertyVal(result, 'email', undefined)
                assert.property(result, 'password')
                assert.propertyVal(result, 'password', undefined)
                assert.property(result, 'name')
                assert.propertyVal(result, 'name', undefined)
                assert.property(result, 'health_area')
                assert.propertyVal(result, 'health_area', undefined)
            })
        })

        context('when does pass a json as string', () => {
            it('should return a complete health professional model', () => {
                const result = new HealthProfessional().fromJSON(JSON.stringify(DefaultEntityMock.HEALTH_PROFESSIONAL))
                assert.property(result, 'id')
                assert.property(result, 'type')
                assert.propertyVal(result, 'type', UserType.HEALTH_PROFESSIONAL)
                assert.property(result, 'scopes')
                assert.property(result, 'email')
                assert.propertyVal(result, 'email', DefaultEntityMock.HEALTH_PROFESSIONAL.email)
                assert.property(result, 'password')
                assert.propertyVal(result, 'password', DefaultEntityMock.HEALTH_PROFESSIONAL.password)
                assert.property(result, 'name')
                assert.propertyVal(result, 'name', DefaultEntityMock.HEALTH_PROFESSIONAL.name)
                assert.property(result, 'health_area')
                assert.propertyVal(result, 'health_area', DefaultEntityMock.HEALTH_PROFESSIONAL.health_area)
            })

            it('should return a complete health professional model with id', () => {
                const result = new HealthProfessional().fromJSON(DefaultEntityMock.HEALTH_PROFESSIONAL.id)
                assert.property(result, 'id')
                assert.property(result, 'type')
                assert.propertyVal(result, 'type', UserType.HEALTH_PROFESSIONAL)
                assert.property(result, 'scopes')
                assert.property(result, 'email')
                assert.propertyVal(result, 'email', undefined)
                assert.property(result, 'password')
                assert.propertyVal(result, 'password', undefined)
                assert.property(result, 'name')
                assert.propertyVal(result, 'name', undefined)
                assert.property(result, 'health_area')
                assert.propertyVal(result, 'health_area', undefined)
            })

            it('should return a health professional with some undefined parameters', () => {
                const result = new HealthProfessional().fromJSON('')
                assert.property(result, 'id')
                assert.propertyVal(result, 'id', undefined)
                assert.property(result, 'type')
                assert.propertyVal(result, 'type', UserType.HEALTH_PROFESSIONAL)
                assert.property(result, 'scopes')
                assert.property(result, 'email')
                assert.propertyVal(result, 'email', undefined)
                assert.property(result, 'password')
                assert.propertyVal(result, 'password', undefined)
                assert.property(result, 'name')
                assert.propertyVal(result, 'name', undefined)
                assert.property(result, 'health_area')
                assert.propertyVal(result, 'health_area', undefined)
            })
        })
    })

    describe('toJSON()', () => {
        it('should return a health professional as JSON', () => {
            const health = new HealthProfessional().fromJSON(DefaultEntityMock.HEALTH_PROFESSIONAL)
            const result = health.toJSON()
            assert.property(result, 'id')
            assert.propertyVal(result, 'id', DefaultEntityMock.HEALTH_PROFESSIONAL.id)
            assert.property(result, 'type')
            assert.propertyVal(result, 'type', UserType.HEALTH_PROFESSIONAL)
            assert.property(result, 'email')
            assert.propertyVal(result, 'email', DefaultEntityMock.HEALTH_PROFESSIONAL.email)
            assert.property(result, 'name')
            assert.propertyVal(result, 'name', DefaultEntityMock.HEALTH_PROFESSIONAL.name)
            assert.property(result, 'health_area')
            assert.propertyVal(result, 'health_area', DefaultEntityMock.HEALTH_PROFESSIONAL.health_area)
        })
    })
})
