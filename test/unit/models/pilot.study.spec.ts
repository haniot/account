import { DefaultEntityMock } from '../../mocks/default.entity.mock'
import { assert } from 'chai'
import { PilotStudy } from '../../../src/application/domain/model/pilot.study'

describe('Models: PilotStudy', () => {
    describe('fromJSON()', () => {
        context('when pass a complete json', () => {
            it('should return a complete pilot study model', () => {
                const result = new PilotStudy().fromJSON(DefaultEntityMock.PILOT_STUDY)
                assert.property(result, 'id')
                assert.propertyVal(result, 'id', DefaultEntityMock.PILOT_STUDY.id)
                assert.property(result, 'name')
                assert.propertyVal(result, 'name', DefaultEntityMock.PILOT_STUDY.name)
                assert.property(result, 'is_active')
                assert.property(result, 'start')
                assert.property(result, 'end')
                assert.property(result, 'health_professionals_id')
            })
        })

        context('when does not pass a json', () => {
            it('should return a pilot study with some undefined parameters', () => {
                const result = new PilotStudy().fromJSON(undefined)
                assert.property(result, 'id')
                assert.propertyVal(result, 'id', undefined)
                assert.property(result, 'name')
                assert.propertyVal(result, 'name', undefined)
                assert.property(result, 'is_active')
                assert.propertyVal(result, 'is_active', undefined)
                assert.property(result, 'start')
                assert.propertyVal(result, 'start', undefined)
                assert.property(result, 'end')
                assert.propertyVal(result, 'end', undefined)
                assert.property(result, 'health_professionals_id')
                assert.propertyVal(result, 'health_professionals_id', undefined)
            })
        })

        context('when does pass a json as string', () => {
            it('should return a complete pilot study model', () => {
                const result = new PilotStudy().fromJSON(JSON.stringify(DefaultEntityMock.PILOT_STUDY))
                assert.property(result, 'id')
                assert.property(result, 'name')
                assert.propertyVal(result, 'name', DefaultEntityMock.PILOT_STUDY.name)
                assert.property(result, 'is_active')
                assert.propertyVal(result, 'is_active', DefaultEntityMock.PILOT_STUDY.is_active)
                assert.property(result, 'start')
                assert.property(result, 'end')
                assert.property(result, 'health_professionals_id')
            })

            it('should return a complete pilot study model with id', () => {
                const result = new PilotStudy().fromJSON(DefaultEntityMock.PILOT_STUDY.id)
                assert.property(result, 'id')
                assert.property(result, 'name')
                assert.propertyVal(result, 'name', undefined)
                assert.property(result, 'is_active')
                assert.propertyVal(result, 'is_active', undefined)
                assert.property(result, 'start')
                assert.propertyVal(result, 'start', undefined)
                assert.property(result, 'end')
                assert.propertyVal(result, 'end', undefined)
                assert.property(result, 'health_professionals_id')
                assert.propertyVal(result, 'health_professionals_id', undefined)
            })

            it('should return a pilot study with some undefined parameters', () => {
                const result = new PilotStudy().fromJSON('')
                assert.property(result, 'id')
                assert.propertyVal(result, 'id', undefined)
                assert.property(result, 'name')
                assert.propertyVal(result, 'name', undefined)
                assert.property(result, 'is_active')
                assert.propertyVal(result, 'is_active', undefined)
                assert.property(result, 'start')
                assert.propertyVal(result, 'start', undefined)
                assert.property(result, 'end')
                assert.propertyVal(result, 'end', undefined)
                assert.property(result, 'health_professionals_id')
                assert.propertyVal(result, 'health_professionals_id', undefined)
            })
        })
    })

    describe('toJSON()', () => {
        it('should return a pilot study as JSON', () => {
            const pilot = new PilotStudy().fromJSON(DefaultEntityMock.PILOT_STUDY)
            const result = pilot.toJSON()
            assert.property(result, 'id')
            assert.propertyVal(result, 'id', DefaultEntityMock.PILOT_STUDY.id)
            assert.property(result, 'name')
            assert.propertyVal(result, 'name', DefaultEntityMock.PILOT_STUDY.name)
            assert.property(result, 'is_active')
            assert.propertyVal(result, 'is_active', DefaultEntityMock.PILOT_STUDY.is_active)
            assert.property(result, 'start')
            assert.property(result, 'end')
            assert.property(result, 'health_professionals_id')
        })
    })
})
