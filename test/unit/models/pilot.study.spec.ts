import { DefaultEntityMock } from '../../mocks/models/default.entity.mock'
import { assert } from 'chai'
import { PilotStudy } from '../../../src/application/domain/model/pilot.study'
import { HealthProfessional } from '../../../src/application/domain/model/health.professional'
import { HealthAreaTypes } from '../../../src/application/domain/utils/health.area.types'

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

        context('when does pass a empty json', () => {
            it('should return a pilot study with some undefined parameters', () => {
                const result = new PilotStudy().fromJSON({})
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

    describe('addHealthProfessional', () => {
        context('when add a health professional in health professionals list', () => {
            it('should add a health professional in health professionals list', () => {
                const pilot = new PilotStudy().fromJSON(DefaultEntityMock.PILOT_STUDY)
                pilot.addHealthProfessional(new HealthProfessional().fromJSON({
                    id: '5ca4b4648c9d775c7eb9f8b2',
                    username: 'health2',
                    password: 'health123',
                    email: 'health2@mail.com',
                    name: 'health pro',
                    health_area: HealthAreaTypes.NUTRITION
                }))
                assert.lengthOf(pilot.health_professionals_id!, 2)
            })
        })

        context('when the health professionals id list does not exists', () => {
            it('should create a empty array before add the health professional', () => {
                const pilot = new PilotStudy().fromJSON(DefaultEntityMock.PILOT_STUDY)
                pilot.health_professionals_id = undefined
                pilot.addHealthProfessional(new HealthProfessional().fromJSON(DefaultEntityMock.HEALTH_PROFESSIONAL))
                assert.lengthOf(pilot.health_professionals_id!, 1)
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

        context('when does not have a health professionals id list', () => {
            it('should return a empty array', () => {
                const pilot = new PilotStudy().fromJSON(DefaultEntityMock.PILOT_STUDY)
                pilot.health_professionals_id = undefined
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
})
