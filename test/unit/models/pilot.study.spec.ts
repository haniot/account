import { DefaultEntityMock } from '../../mocks/models/default.entity.mock'
import { assert } from 'chai'
import { PilotStudy } from '../../../src/application/domain/model/pilot.study'
import { HealthProfessional } from '../../../src/application/domain/model/health.professional'
import { Patient } from '../../../src/application/domain/model/patient'

describe('Models: PilotStudy', () => {
    describe('addHealthProfessional()', () => {
        context('when add a new health professional in a health professionals list', () => {
            it('should return a list of health professionals', () => {
                const pilot: PilotStudy = new PilotStudy().fromJSON(DefaultEntityMock.PILOT_STUDY)
                pilot.addHealthProfessional(new HealthProfessional().fromJSON(DefaultEntityMock.HEALTH_PROFESSIONAL.id))
                assert.lengthOf(pilot.health_professionals!, 1)
            })
        })

        context('when the health professionals list is undefined', () => {
            it('should return a list of health professionals', () => {
                const pilot: PilotStudy = new PilotStudy()
                pilot.addHealthProfessional(new HealthProfessional().fromJSON(DefaultEntityMock.HEALTH_PROFESSIONAL.id))
                assert.lengthOf(pilot.health_professionals!, 1)
            })
        })
    })

    describe('addPatients()', () => {
        context('when add a new patient in patients list', () => {
            it('should return a list of patients', () => {
                const pilot: PilotStudy = new PilotStudy().fromJSON(DefaultEntityMock.PILOT_STUDY)
                pilot.addPatient(new Patient().fromJSON(DefaultEntityMock.PATIENT.id))
                assert.lengthOf(pilot.patients!, 1)
            })
        })

        context('when the patients list is undefined', () => {
            it('should return a list of patients', () => {
                const pilot: PilotStudy = new PilotStudy()
                pilot.addPatient(new Patient().fromJSON(DefaultEntityMock.PATIENT.id))
                assert.lengthOf(pilot.patients!, 1)
            })
        })
    })

    describe('convertDatetimeString()', () => {
        const pilot: PilotStudy = new PilotStudy()
        context('when the param is a date string in iso format', () => {
            it('should return a new date', () => {
                const date = pilot.convertDatetimeString('2019-04-09T00:01:02')
                assert.equal(typeof date, 'object')
            })
        })
        context('when the param is a date but is not a string', () => {
            it('should return a new date', () => {
                const date = pilot.convertDatetimeString(new Date())
                assert.equal(typeof date, 'object')
            })
        })
    })

    describe('fromJSON()', () => {
        context('when pass a complete json', () => {
            it('should return a complete pilot study model', () => {
                const result = new PilotStudy().fromJSON(DefaultEntityMock.PILOT_STUDY)
                assert.property(result, 'id')
                assert.propertyVal(result, 'name', DefaultEntityMock.PILOT_STUDY.name)
                assert.propertyVal(result, 'is_active', DefaultEntityMock.PILOT_STUDY.is_active)
                assert.property(result, 'start')
                assert.property(result, 'end')
                assert.propertyVal(result, 'location', DefaultEntityMock.PILOT_STUDY.location)
            })
        })

        context('when does not pass a json', () => {
            it('should return a pilot study with some undefined parameters', () => {
                const result = new PilotStudy().fromJSON(undefined)
                assert.propertyVal(result, 'id', undefined)
                assert.propertyVal(result, 'name', undefined)
                assert.propertyVal(result, 'is_active', undefined)
                assert.propertyVal(result, 'start', undefined)
                assert.propertyVal(result, 'end', undefined)
                assert.propertyVal(result, 'total_health_professionals', undefined)
                assert.propertyVal(result, 'total_patients', undefined)
                assert.propertyVal(result, 'health_professionals', undefined)
                assert.propertyVal(result, 'patients', undefined)
                assert.propertyVal(result, 'location', undefined)
            })
        })

        context('when does pass a empty json', () => {
            it('should return a pilot study with some undefined parameters', () => {
                const result = new PilotStudy().fromJSON({})
                assert.propertyVal(result, 'id', undefined)
                assert.propertyVal(result, 'name', undefined)
                assert.propertyVal(result, 'is_active', undefined)
                assert.propertyVal(result, 'start', undefined)
                assert.propertyVal(result, 'end', undefined)
                assert.propertyVal(result, 'total_health_professionals', undefined)
                assert.propertyVal(result, 'total_patients', undefined)
                assert.propertyVal(result, 'health_professionals', undefined)
                assert.propertyVal(result, 'patients', undefined)
                assert.propertyVal(result, 'location', undefined)
            })
        })

        context('when does pass a json as string', () => {
            it('should return a complete pilot study model', () => {
                const result = new PilotStudy().fromJSON(JSON.stringify(DefaultEntityMock.PILOT_STUDY))
                assert.property(result, 'id')
                assert.propertyVal(result, 'name', DefaultEntityMock.PILOT_STUDY.name)
                assert.propertyVal(result, 'is_active', DefaultEntityMock.PILOT_STUDY.is_active)
                assert.property(result, 'start')
                assert.property(result, 'end')
                assert.propertyVal(result, 'location', DefaultEntityMock.PILOT_STUDY.location)
            })

            it('should return a complete pilot study model with id', () => {
                const result = new PilotStudy().fromJSON(DefaultEntityMock.PILOT_STUDY.id)
                assert.propertyVal(result, 'id', DefaultEntityMock.PILOT_STUDY.id)
            })

            it('should return a pilot study with some undefined parameters for empty string', () => {
                const result = new PilotStudy().fromJSON('')
                assert.propertyVal(result, 'id', undefined)
                assert.propertyVal(result, 'id', undefined)
                assert.propertyVal(result, 'name', undefined)
                assert.propertyVal(result, 'is_active', undefined)
                assert.propertyVal(result, 'start', undefined)
                assert.propertyVal(result, 'end', undefined)
                assert.propertyVal(result, 'total_health_professionals', undefined)
                assert.propertyVal(result, 'total_patients', undefined)
                assert.propertyVal(result, 'health_professionals', undefined)
                assert.propertyVal(result, 'patients', undefined)
                assert.propertyVal(result, 'location', undefined)
            })

            it('should return a pilot study with some undefined parameters for invalid string', () => {
                const result = new PilotStudy().fromJSON(123)
                assert.propertyVal(result, 'id', undefined)
                assert.propertyVal(result, 'name', undefined)
                assert.propertyVal(result, 'is_active', undefined)
                assert.propertyVal(result, 'start', undefined)
                assert.propertyVal(result, 'end', undefined)
                assert.propertyVal(result, 'total_health_professionals', undefined)
                assert.propertyVal(result, 'total_patients', undefined)
                assert.propertyVal(result, 'health_professionals', undefined)
                assert.propertyVal(result, 'patients', undefined)
                assert.propertyVal(result, 'location', undefined)
            })
        })
    })

    describe('toJSON()', () => {
        it('should return a pilot study as JSON', () => {
            const pilot = new PilotStudy().fromJSON(DefaultEntityMock.PILOT_STUDY)
            const result = pilot.toJSON()
            assert.propertyVal(result, 'name', DefaultEntityMock.PILOT_STUDY.name)
            assert.propertyVal(result, 'is_active', DefaultEntityMock.PILOT_STUDY.is_active)
            assert.property(result, 'start')
            assert.property(result, 'end')
            assert.propertyVal(result, 'location', DefaultEntityMock.PILOT_STUDY.location)
        })

        context('when does not have a health professionals or patients list', () => {
            it('should return a empty array for both parameters', () => {
                const pilot = new PilotStudy().fromJSON(DefaultEntityMock.PILOT_STUDY)
                pilot.health_professionals = undefined
                pilot.patients = undefined
                const result = pilot.toJSON()
                assert.propertyVal(result, 'name', DefaultEntityMock.PILOT_STUDY.name)
                assert.propertyVal(result, 'is_active', DefaultEntityMock.PILOT_STUDY.is_active)
                assert.property(result, 'start')
                assert.property(result, 'end')
                assert.propertyVal(result, 'location', DefaultEntityMock.PILOT_STUDY.location)
            })
        })
    })
})
