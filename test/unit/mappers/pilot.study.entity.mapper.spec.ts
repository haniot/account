import { DefaultEntityMock } from '../../mocks/models/default.entity.mock'
import { assert } from 'chai'
import { PilotStudyEntityMapper } from '../../../src/infrastructure/entity/mapper/pilot.study.entity.mapper'
import { PilotStudy } from '../../../src/application/domain/model/pilot.study'
import { PilotStudyEntity } from '../../../src/infrastructure/entity/pilot.study.entity'

describe('Mappers: PilotStudyEntityMapper', () => {
    const mapper = new PilotStudyEntityMapper()
    const pilot: PilotStudy = new PilotStudy().fromJSON(DefaultEntityMock.PILOT_STUDY)

    describe('transform()', () => {
        context('when the parameter is a json', () => {
            it('should call the jsonToModel() method', () => {
                const result = mapper.transform(DefaultEntityMock.PILOT_STUDY)
                assert.propertyVal(result, 'id', pilot.id)
                assert.propertyVal(result, 'name', pilot.name)
                assert.propertyVal(result, 'is_active', pilot.is_active)
                assert.property(result, 'start')
                assert.property(result, 'end')
                assert.lengthOf(result.health_professionals!, 1)
                assert.lengthOf(result.patients!, 1)
                assert.propertyVal(result, 'location', pilot.location)
            })

            it('should return model without parameters for empty json', () => {
                const result = mapper.transform({})
                assert.propertyVal(result, 'id', undefined)
                assert.propertyVal(result, 'name', undefined)
                assert.propertyVal(result, 'is_active', undefined)
                assert.propertyVal(result, 'start', undefined)
                assert.propertyVal(result, 'end', undefined)
                assert.propertyVal(result, 'health_professionals', undefined)
                assert.propertyVal(result, 'patients', undefined)
                assert.propertyVal(result, 'location', undefined)
            })

            it('should return model without parameter for undefined json', () => {
                const result = mapper.transform(undefined)
                assert.propertyVal(result, 'id', undefined)
                assert.propertyVal(result, 'name', undefined)
                assert.propertyVal(result, 'is_active', undefined)
                assert.propertyVal(result, 'start', undefined)
                assert.propertyVal(result, 'end', undefined)
                assert.propertyVal(result, 'health_professionals', undefined)
                assert.propertyVal(result, 'patients', undefined)
                assert.propertyVal(result, 'location', undefined)
            })

        })

        context('when the parameter is a model', () => {
            it('should call the modelToModelEntity() method', () => {
                const result = mapper.transform(pilot)
                assert.propertyVal(result, 'id', pilot.id)
                assert.propertyVal(result, 'name', pilot.name)
                assert.propertyVal(result, 'is_active', pilot.is_active)
                assert.property(result, 'start')
                assert.property(result, 'end')
                assert.propertyVal(result, 'location', pilot.location)
            })

            it('should return a model entity without parameters for empty model', () => {
                const result = mapper.transform(new PilotStudy())
                assert.isEmpty(result)
            })
        })
    })

    describe('modelEntityToModel()', () => {
        context('when try to use modelEntityToModel() function', () => {
            it('should throw an error', () => {
                try {
                    mapper.modelEntityToModel(new PilotStudyEntity())
                } catch (err) {
                    assert.property(err, 'message', 'Not implemented!')
                }
            })
        })
    })
})
