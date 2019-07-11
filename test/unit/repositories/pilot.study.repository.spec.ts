import sinon from 'sinon'
import { DefaultEntityMock } from '../../mocks/models/default.entity.mock'
import { EntityMapperMock } from '../../mocks/models/entity.mapper.mock'
import { CustomLoggerMock } from '../../mocks/custom.logger.mock'
import { PilotStudyRepoModel } from '../../../src/infrastructure/database/schema/pilot.study.schema'
import { PilotStudyRepository } from '../../../src/infrastructure/repository/pilot.study.repository'
import { PilotStudy } from '../../../src/application/domain/model/pilot.study'
import { Query } from '../../../src/infrastructure/repository/query/query'
import { assert } from 'chai'
import { HealthProfessional } from '../../../src/application/domain/model/health.professional'
import { Patient } from '../../../src/application/domain/model/patient'
import { UserType } from '../../../src/application/domain/utils/user.type'

require('sinon-mongoose')

describe('Repositories: PilotStudyRepository', () => {
    const modelFake: any = PilotStudyRepoModel
    const repo = new PilotStudyRepository(modelFake, new EntityMapperMock(), new CustomLoggerMock())
    const pilot: PilotStudy = new PilotStudy().fromJSON(DefaultEntityMock.PILOT_STUDY)
    pilot.health_professionals = [new HealthProfessional().fromJSON(DefaultEntityMock.HEALTH_PROFESSIONAL)]
    pilot.patients = [new Patient().fromJSON(DefaultEntityMock.PATIENT)]

    afterEach(() => {
        sinon.restore()
    })

    describe('findAndPopulate', () => {
        context('when get a collection of populated pilot studies', () => {
            it('should return a list of pilot studies', () => {
                sinon
                    .mock(modelFake)
                    .expects('find').withArgs({})
                    .chain('select').withArgs({})
                    .chain('sort').withArgs({ created_at: 'desc' })
                    .chain('skip').withArgs(0)
                    .chain('limit').withArgs(100)
                    .chain('populate').withArgs('health_professionals')
                    .chain('populate').withArgs('patients')
                    .chain('exec')
                    .resolves([pilot])

                return repo.findAndPopulate(new Query())
                    .then(res => {
                        assert.isArray(res)
                        assert.lengthOf(res, 1)
                        assert.propertyVal(res[0], 'id', pilot.id)
                        assert.propertyVal(res[0], 'name', pilot.name)
                        assert.propertyVal(res[0], 'is_active', pilot.is_active)
                        assert.property(res[0], 'start')
                        assert.property(res[0], 'end')
                        assert.propertyVal(res[0], 'location', pilot.location)
                        assert.isArray(res[0].health_professionals)
                        assert.isArray(res[0].patients)
                        assert.lengthOf(res[0].health_professionals!, 1)
                        assert.lengthOf(res[0].patients!, 1)
                    })
            })
        })

        context('when a database error occurs', () => {
            it('should reject a error', () => {
                sinon
                    .mock(modelFake)
                    .expects('find').withArgs({})
                    .chain('select').withArgs({})
                    .chain('sort').withArgs({ created_at: 'desc' })
                    .chain('skip').withArgs(0)
                    .chain('limit').withArgs(100)
                    .chain('populate').withArgs('health_professionals')
                    .chain('populate').withArgs('patients')
                    .chain('exec')
                    .rejects({ message: 'An internal error has occurred in the database!' })

                return repo.findAndPopulate(new Query())
                    .catch(err => {
                        assert.propertyVal(err, 'message', 'An internal error has occurred in the database!')
                    })
            })
        })
    })

    describe('findOneAndPopulate', () => {
        context('when get a populated pilot study', () => {
            it('should return a pilot study', () => {
                sinon
                    .mock(modelFake)
                    .expects('findOne').withArgs({ _id: pilot.id })
                    .chain('select').withArgs({})
                    .chain('populate').withArgs('health_professionals')
                    .chain('populate').withArgs('patients')
                    .chain('exec')
                    .resolves(pilot)

                return repo.findOneAndPopulate(new Query().fromJSON({ filters: { _id: pilot.id } }))
                    .then(res => {
                        assert.property(res, 'id')
                        assert.propertyVal(res, 'name', pilot.name)
                        assert.propertyVal(res, 'is_active', pilot.is_active)
                        assert.property(res, 'start')
                        assert.property(res, 'end')
                        assert.propertyVal(res, 'location', pilot.location)
                        assert.propertyVal(res, 'total_health_professionals', 1)
                        assert.propertyVal(res, 'total_patients', 1)
                    })
            })
        })

        context('when the pilot study is not founded', () => {
            it('should return undefined', () => {
                sinon
                    .mock(modelFake)
                    .expects('findOne').withArgs({ _id: pilot.id })
                    .chain('select').withArgs({})
                    .chain('populate').withArgs('health_professionals')
                    .chain('populate').withArgs('patients')
                    .chain('exec')
                    .resolves(undefined)

                return repo.findOneAndPopulate(new Query().fromJSON({ filters: { _id: pilot.id } }))
                    .then(res => {
                        assert.isUndefined(res)
                    })
            })
        })

        context('when a database error occurs', () => {
            it('should reject a error', () => {
                sinon
                    .mock(modelFake)
                    .expects('findOne').withArgs({ _id: pilot.id })
                    .chain('select').withArgs({})
                    .chain('populate').withArgs('health_professionals')
                    .chain('populate').withArgs('patients')
                    .chain('exec')
                    .rejects({ message: 'An internal error has occurred in the database!' })

                return repo.findOneAndPopulate(new Query().fromJSON({ filters: { _id: pilot.id } }))
                    .catch(err => {
                        assert.propertyVal(err, 'message', 'An internal error has occurred in the database!')
                    })
            })
        })
    })

    describe('checkExists()', () => {
        const pilotId: PilotStudy = new PilotStudy()
        pilotId.id = DefaultEntityMock.PILOT_STUDY.id

        context('when check if a pilot exists by id', () => {
            it('should return true', () => {
                sinon
                    .mock(modelFake)
                    .expects('findOne').withArgs({ _id: pilot.id })
                    .chain('select').withArgs({})
                    .chain('exec')
                    .resolves(pilot)

                return repo.checkExists(pilotId)
                    .then(res => {
                        assert.isBoolean(res)
                        assert.isTrue(res)
                    })
            })
        })

        context('when check if a pilot exists by name', () => {
            it('should return true', () => {
                sinon
                    .mock(modelFake)
                    .expects('findOne').withArgs({ name: pilot.name })
                    .chain('select').withArgs({})
                    .chain('exec')
                    .resolves(pilot)

                return repo.checkExists(new PilotStudy().fromJSON({ name: pilot.name }))
                    .then(res => {
                        assert.isBoolean(res)
                        assert.isTrue(res)
                    })
            })
        })

        context('when the pilot is not founded', () => {
            it('should return false for not found by id', () => {
                sinon
                    .mock(modelFake)
                    .expects('findOne').withArgs({ _id: pilot.id })
                    .chain('select').withArgs({})
                    .chain('exec')
                    .resolves(undefined)

                return repo.checkExists(pilotId)
                    .then(res => {
                        assert.isBoolean(res)
                        assert.isFalse(res)
                    })
            })
            it('should return false for not found by name', () => {
                sinon
                    .mock(modelFake)
                    .expects('findOne').withArgs({ name: pilot.name })
                    .chain('select').withArgs({})
                    .chain('exec')
                    .resolves(undefined)

                return repo.checkExists(new PilotStudy().fromJSON({ name: pilot.name }))
                    .then(res => {
                        assert.isBoolean(res)
                        assert.isFalse(res)
                    })
            })
        })

        context('when a database error occurs', () => {
            it('should reject a error', () => {
                sinon
                    .mock(modelFake)
                    .expects('findOne').withArgs({ _id: pilot.id })
                    .chain('select').withArgs({})
                    .chain('exec')
                    .rejects({ message: 'An internal error has occurred in the database!' })

                return repo.checkExists(new PilotStudy().fromJSON({ name: pilot.name }))
                    .catch(err => {
                        assert.propertyVal(err, 'message', 'An internal error has occurred in the database!')
                    })
            })
        })
    })

    describe('associateUser()', () => {
        context('when associate a patient with a pilot study', () => {
            it('should return a pilot study', () => {
                sinon
                    .mock(modelFake)
                    .expects('findOneAndUpdate')
                    .withArgs({ _id: pilot.id }, { $addToSet: { patients: (DefaultEntityMock.PATIENT.id) } })
                    .chain('exec')
                    .resolves(pilot)

                return repo.associateUser(pilot.id!, DefaultEntityMock.PATIENT.id, UserType.PATIENT)
                    .then(res => {
                        assert.property(res, 'id')
                        assert.propertyVal(res, 'name', pilot.name)
                        assert.propertyVal(res, 'is_active', pilot.is_active)
                        assert.property(res, 'start')
                        assert.property(res, 'end')
                        assert.propertyVal(res, 'location', pilot.location)
                        assert.propertyVal(res, 'total_health_professionals', 1)
                        assert.propertyVal(res, 'total_patients', 1)
                    })
            })
        })

        context('when associate a health professional with a pilot study', () => {
            it('should return a pilot study', () => {
                sinon
                    .mock(modelFake)
                    .expects('findOneAndUpdate')
                    .withArgs(
                        { _id: pilot.id },
                        { $addToSet: { health_professionals: (DefaultEntityMock.HEALTH_PROFESSIONAL.id) } })
                    .chain('exec')
                    .resolves(pilot)

                return repo.associateUser(pilot.id!, DefaultEntityMock.HEALTH_PROFESSIONAL.id, UserType.HEALTH_PROFESSIONAL)
                    .then(res => {
                        assert.property(res, 'id')
                        assert.propertyVal(res, 'name', pilot.name)
                        assert.propertyVal(res, 'is_active', pilot.is_active)
                        assert.property(res, 'start')
                        assert.property(res, 'end')
                        assert.propertyVal(res, 'location', pilot.location)
                        assert.propertyVal(res, 'total_health_professionals', 1)
                        assert.propertyVal(res, 'total_patients', 1)
                    })
            })
        })

        context('when the pilot is not updated', () => {
            it('should return undefined', () => {
                sinon
                    .mock(modelFake)
                    .expects('findOneAndUpdate')
                    .withArgs({ _id: pilot.id }, { $addToSet: { patients: (DefaultEntityMock.PATIENT.id) } })
                    .chain('exec')
                    .resolves(undefined)

                return repo.associateUser(pilot.id!, DefaultEntityMock.PATIENT.id, UserType.PATIENT)
                    .then(res => {
                        assert.isUndefined(res)
                    })
            })

        })

        context('when a database error occurs', () => {
            it('should reject a error', () => {
                sinon
                    .mock(modelFake)
                    .expects('findOneAndUpdate')
                    .withArgs({ _id: pilot.id }, { $addToSet: { patients: (DefaultEntityMock.PATIENT.id) } })
                    .chain('exec')
                    .rejects({ message: 'An internal error has occurred in the database!' })

                return repo.associateUser(pilot.id!, DefaultEntityMock.PATIENT.id, UserType.PATIENT)
                    .catch(err => {
                        assert.propertyVal(err, 'message', 'An internal error has occurred in the database!')
                    })
            })
        })
    })

    describe('disassociateUser()', () => {
        context('when associate a patient with a pilot study', () => {
            it('should return a pilot study', () => {
                sinon
                    .mock(modelFake)
                    .expects('findOneAndUpdate')
                    .withArgs({ _id: pilot.id }, { $pull: { patients: (DefaultEntityMock.PATIENT.id) } })
                    .chain('exec')
                    .resolves(pilot)

                return repo.disassociateUser(pilot.id!, DefaultEntityMock.PATIENT.id, UserType.PATIENT)
                    .then(res => {
                        assert.property(res, 'id')
                        assert.propertyVal(res, 'name', pilot.name)
                        assert.propertyVal(res, 'is_active', pilot.is_active)
                        assert.property(res, 'start')
                        assert.property(res, 'end')
                        assert.propertyVal(res, 'location', pilot.location)
                        assert.propertyVal(res, 'total_health_professionals', 1)
                        assert.propertyVal(res, 'total_patients', 1)
                    })
            })
        })

        context('when associate a health professional with a pilot study', () => {
            it('should return a pilot study', () => {
                sinon
                    .mock(modelFake)
                    .expects('findOneAndUpdate')
                    .withArgs(
                        { _id: pilot.id },
                        { $pull: { health_professionals: (DefaultEntityMock.HEALTH_PROFESSIONAL.id) } })
                    .chain('exec')
                    .resolves(pilot)

                return repo.disassociateUser(pilot.id!, DefaultEntityMock.HEALTH_PROFESSIONAL.id, UserType.HEALTH_PROFESSIONAL)
                    .then(res => {
                        assert.property(res, 'id')
                        assert.propertyVal(res, 'name', pilot.name)
                        assert.propertyVal(res, 'is_active', pilot.is_active)
                        assert.property(res, 'start')
                        assert.property(res, 'end')
                        assert.propertyVal(res, 'location', pilot.location)
                        assert.propertyVal(res, 'total_health_professionals', 1)
                        assert.propertyVal(res, 'total_patients', 1)
                    })
            })
        })

        context('when the pilot is not updated', () => {
            it('should return undefined', () => {
                sinon
                    .mock(modelFake)
                    .expects('findOneAndUpdate')
                    .withArgs({ _id: pilot.id }, { $pull: { patients: (DefaultEntityMock.PATIENT.id) } })
                    .chain('exec')
                    .resolves(undefined)

                return repo.disassociateUser(pilot.id!, DefaultEntityMock.PATIENT.id, UserType.PATIENT)
                    .then(res => {
                        assert.isUndefined(res)
                    })
            })

        })

        context('when a database error occurs', () => {
            it('should reject a error', () => {
                sinon
                    .mock(modelFake)
                    .expects('findOneAndUpdate')
                    .withArgs({ _id: pilot.id }, { $pull: { patients: (DefaultEntityMock.PATIENT.id) } })
                    .chain('exec')
                    .rejects({ message: 'An internal error has occurred in the database!' })

                return repo.disassociateUser(pilot.id!, DefaultEntityMock.PATIENT.id, UserType.PATIENT)
                    .catch(err => {
                        assert.propertyVal(err, 'message', 'An internal error has occurred in the database!')
                    })
            })
        })
    })

    describe('count', () => {
        context('when count a collection of pilot studies', () => {
            it('should return a number', () => {
                sinon
                    .mock(modelFake)
                    .expects('countDocuments')
                    .withArgs({})
                    .chain('exec')
                    .resolves(1)

                return repo.count()
                    .then(res => {
                        assert.isNumber(res)
                        assert.equal(res, 1)
                    })
            })
        })
    })

    describe('countHealthProfessionalsFromPilotStudy()', () => {
        context('when count a number of health professionals from pilot study', () => {
            it('should return a number', () => {
                sinon
                    .mock(modelFake)
                    .expects('findOne')
                    .withArgs({ _id: pilot.id })
                    .chain('select')
                    .chain('exec')
                    .resolves(pilot)

                return repo.countHealthProfessionalsFromPilotStudy(pilot.id!)
                    .then(res => {
                        assert.isNumber(res)
                        assert.equal(res, 1)
                    })
            })
        })

        context('when the pilot is not founded', () => {
            it('should return a number', () => {
                sinon
                    .mock(modelFake)
                    .expects('findOne')
                    .withArgs({ _id: pilot.id })
                    .chain('select')
                    .chain('exec')
                    .resolves(undefined)

                return repo.countHealthProfessionalsFromPilotStudy(pilot.id!)
                    .then(res => {
                        assert.isNumber(res)
                        assert.equal(res, 0)
                    })
            })
        })

        context('when a database error occurs', () => {
            it('should reject a error', () => {
                sinon
                    .mock(modelFake)
                    .expects('findOne')
                    .withArgs({ _id: pilot.id })
                    .chain('select')
                    .chain('exec')
                    .rejects({ message: 'An internal error has occurred in the database!' })

                return repo.countHealthProfessionalsFromPilotStudy(pilot.id!)
                    .catch(err => {
                        assert.propertyVal(err, 'message', 'An internal error has occurred in the database!')
                    })
            })
        })
    })

    describe('countPatientsFromPilotStudy()', () => {
        context('when count a number of patients from pilot study', () => {
            it('should return a number', () => {
                sinon
                    .mock(modelFake)
                    .expects('findOne')
                    .withArgs({ _id: pilot.id })
                    .chain('select')
                    .chain('exec')
                    .resolves(pilot)

                return repo.countPatientsFromPilotStudy(pilot.id!)
                    .then(res => {
                        assert.isNumber(res)
                        assert.equal(res, 1)
                    })
            })
        })

        context('when the pilot is not founded', () => {
            it('should return a number', () => {
                sinon
                    .mock(modelFake)
                    .expects('findOne')
                    .withArgs({ _id: pilot.id })
                    .chain('select')
                    .chain('exec')
                    .resolves(undefined)

                return repo.countPatientsFromPilotStudy(pilot.id!)
                    .then(res => {
                        assert.isNumber(res)
                        assert.equal(res, 0)
                    })
            })
        })

        context('when a database error occurs', () => {
            it('should reject a error', () => {
                sinon
                    .mock(modelFake)
                    .expects('findOne')
                    .withArgs({ _id: pilot.id })
                    .chain('select')
                    .chain('exec')
                    .rejects({ message: 'An internal error has occurred in the database!' })

                return repo.countPatientsFromPilotStudy(pilot.id!)
                    .catch(err => {
                        assert.propertyVal(err, 'message', 'An internal error has occurred in the database!')
                    })
            })
        })
    })

    describe('countPatientsFromHealthProfessional()', () => {
        context('when count a number of patients from health professional', () => {
            it('should return a number', () => {
                sinon
                    .mock(modelFake)
                    .expects('distinct')
                    .withArgs('patients', { health_professionals: DefaultEntityMock.HEALTH_PROFESSIONAL.id })
                    .resolves([DefaultEntityMock.PILOT_STUDY_BASIC.id])

                return repo.countPatientsFromHealthProfessional(DefaultEntityMock.HEALTH_PROFESSIONAL.id)
                    .then(res => {
                        assert.isNumber(res)
                        assert.equal(res, 1)
                    })
            })
        })

        context('when a database error occurs', () => {
            it('should reject a error', () => {
                sinon
                    .mock(modelFake)
                    .expects('distinct')
                    .withArgs('patients', { health_professionals: DefaultEntityMock.HEALTH_PROFESSIONAL.id })
                    .rejects({ message: 'An internal error has occurred in the database!' })

                return repo.countPatientsFromHealthProfessional(DefaultEntityMock.HEALTH_PROFESSIONAL.id)
                    .catch(err => {
                        assert.propertyVal(err, 'message', 'An internal error has occurred in the database!')
                    })
            })
        })
    })

    describe('countPilotStudiesFromPatient()', () => {
        context('when count a number of pilot studies from p    atient', () => {
            it('should return a number', () => {
                sinon
                    .mock(modelFake)
                    .expects('countDocuments')
                    .withArgs({ patients: (DefaultEntityMock.PATIENT.id) })
                    .chain('exec')
                    .resolves(1)

                return repo.countPilotStudiesFromPatient(DefaultEntityMock.PATIENT.id)
                    .then(res => {
                        assert.isNumber(res)
                        assert.equal(res, 1)
                    })
            })
        })
    })

    describe('countPilotStudiesFromHealthProfessional()', () => {
        context('when count a number of pilot studies from health professional', () => {
            it('should return a number', () => {
                sinon
                    .mock(modelFake)
                    .expects('countDocuments')
                    .withArgs({ health_professionals: (DefaultEntityMock.HEALTH_PROFESSIONAL.id) })
                    .chain('exec')
                    .resolves(1)

                return repo.countPilotStudiesFromHealthProfessional(DefaultEntityMock.HEALTH_PROFESSIONAL.id)
                    .then(res => {
                        assert.isNumber(res)
                        assert.equal(res, 1)
                    })
            })
        })
    })
})
