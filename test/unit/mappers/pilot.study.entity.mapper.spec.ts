import { DefaultEntityMock } from '../../mocks/models/default.entity.mock'
import { assert } from 'chai'
import { PilotStudyEntityMapper } from '../../../src/infrastructure/entity/mapper/pilot.study.entity.mapper'
import { PilotStudy } from '../../../src/application/domain/model/pilot.study'
import { PilotStudyEntity } from '../../../src/infrastructure/entity/pilot.study.entity'

describe('Mappers: PilotStudyEntityMapper', () => {
    const mapper = new PilotStudyEntityMapper()
    const pilotModel: PilotStudy = new PilotStudy().fromJSON(DefaultEntityMock.PILOT_STUDY)

    describe('transform()', () => {
        context('when the parameter is a json', () => {
            it('should call the jsonToModel() method', () => {
                const result = mapper.transform(DefaultEntityMock.PILOT_STUDY)
                assert.property(result, 'id')
                assert.propertyVal(result, 'name', pilotModel.name)
                assert.property(result, 'is_active')
                assert.propertyVal(result, 'is_active', pilotModel.is_active)
                assert.property(result, 'start')
                assert.property(result, 'end')
                assert.property(result, 'health_professionals_id')
            })

            it('should return model without parameters for empty json', () => {
                const result = mapper.transform({})
                assert.property(result, 'id')
                assert.propertyVal(result, 'name', undefined)
                assert.property(result, 'is_active')
                assert.propertyVal(result, 'is_active', undefined)
                assert.property(result, 'start')
                assert.propertyVal(result, 'start', undefined)
                assert.property(result, 'end')
                assert.propertyVal(result, 'end', undefined)
                assert.property(result, 'health_professionals_id')
            })
            it('should return model without parameter for undefined json', () => {
                const result = mapper.transform(undefined)
                assert.property(result, 'id')
                assert.propertyVal(result, 'name', undefined)
                assert.property(result, 'is_active')
                assert.propertyVal(result, 'is_active', undefined)
                assert.property(result, 'start')
                assert.propertyVal(result, 'start', undefined)
                assert.property(result, 'end')
                assert.propertyVal(result, 'end', undefined)
                assert.property(result, 'health_professionals_id')
            })

        })

        context('when the parameter is a model', () => {
            it('should call the modelToModelEntity() method', () => {
                const result = mapper.transform(pilotModel)
                assert.property(result, 'id')
                assert.propertyVal(result, 'id', pilotModel.id)
                assert.property(result, 'id')
                assert.propertyVal(result, 'name', pilotModel.name)
                assert.property(result, 'is_active')
                assert.propertyVal(result, 'is_active', pilotModel.is_active)
                assert.property(result, 'start')
                assert.property(result, 'end')
                assert.property(result, 'health_professionals_id')
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
                    assert.property(err, 'message')
                    assert.property(err, 'message', 'Not implemented!')
                }
            })
        })
    })
})
