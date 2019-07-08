import { PilotStudy } from '../../../src/application/domain/model/pilot.study'
import { DefaultEntityMock } from '../../mocks/models/default.entity.mock'
import { PilotStudyService } from '../../../src/application/service/pilot.study.service'
import { PilotStudyRepositoryMock } from '../../mocks/repositories/pilot.study.repository.mock'
import { HealthProfessionalRepositoryMock } from '../../mocks/repositories/health.professional.repository.mock'
import { assert } from 'chai'
import { PatientRepositoryMock } from '../../mocks/repositories/patient.repository.mock'
import { Query } from '../../../src/infrastructure/repository/query/query'
import { HealthProfessional } from '../../../src/application/domain/model/health.professional'
import { Patient } from '../../../src/application/domain/model/patient'
import { ObjectID } from 'bson'

describe('Services: PilotStudyService', () => {
    const service = new PilotStudyService(
        new PilotStudyRepositoryMock(), new HealthProfessionalRepositoryMock(), new PatientRepositoryMock())
    const pilot: PilotStudy = new PilotStudy().fromJSON(DefaultEntityMock.PILOT_STUDY)
    const health: HealthProfessional = new HealthProfessional().fromJSON(DefaultEntityMock.HEALTH_PROFESSIONAL)
    const patient: Patient = new Patient().fromJSON(DefaultEntityMock.PATIENT)

    pilot.id = DefaultEntityMock.PILOT_STUDY.id
    health.id = DefaultEntityMock.HEALTH_PROFESSIONAL.id
    patient.id = DefaultEntityMock.PATIENT.id

    describe('add()', () => {
        context('when add new a pilot study without pilot study', () => {
            it('should return a saved pilot study', () => {
                return service.add(pilot)
                    .then(res => {
                        assert.property(res, 'id')
                        assert.propertyVal(res, 'name', pilot.name)
                        assert.propertyVal(res, 'is_active', pilot.is_active)
                        assert.property(res, 'start')
                        assert.property(res, 'end')
                        assert.propertyVal(res, 'location', pilot.location)
                        assert.propertyVal(res, 'total_health_professionals', 0)
                        assert.propertyVal(res, 'total_patients', 0)
                    })
            })

            it('should return a saved pilot study without health professionals', () => {
                return service.add(new PilotStudy().fromJSON(DefaultEntityMock.PILOT_STUDY_BASIC))
                    .then(res => {
                        assert.property(res, 'id')
                        assert.propertyVal(res, 'name', pilot.name)
                        assert.propertyVal(res, 'is_active', pilot.is_active)
                        assert.property(res, 'start')
                        assert.property(res, 'end')
                        assert.propertyVal(res, 'total_health_professionals', 0)
                        assert.propertyVal(res, 'total_patients', 0)
                        assert.propertyVal(res, 'location', pilot.location)
                    })
            })

        })

        context('when there are validation errors', () => {
            it('should throw an error for does not pass the required parameters', () => {
                return service.add(new PilotStudy())
                    .catch(err => {
                        assert.propertyVal(err, 'message', 'Required fields were not provided...')
                        assert.propertyVal(err, 'description', 'Pilot Study validation: name, is_active, start, end required!')
                    })
            })

            it('should throw an error for does pass invalid parameters', () => {
                pilot.health_professionals = [new HealthProfessional().fromJSON('123')]
                pilot.patients = []
                return service.add(pilot)
                    .catch(err => {
                        assert.propertyVal(err, 'message', 'Some ID provided does not have a valid format!')
                        assert.propertyVal(err, 'description', 'A 24-byte hex ID similar to this: 507f191e810c19729de860ea is ' +
                            'expected.')
                        pilot.patients = undefined
                        pilot.health_professionals = undefined

                    })
            })
        })
    })

    describe('getAll()', () => {
        context('when get all pilot studies', () => {
            it('should return a list of pilot studies', () => {
                return service.getAll(new Query())
                    .then(res => {
                        assert.isArray(res)
                        assert.lengthOf(res, 1)
                        assert.propertyVal(res[0], 'id', pilot.id)
                        assert.propertyVal(res[0], 'name', pilot.name)
                        assert.propertyVal(res[0], 'is_active', pilot.is_active)
                        assert.property(res[0], 'start')
                        assert.property(res[0], 'end')
                        assert.propertyVal(res[0], 'total_health_professionals', 0)
                        assert.propertyVal(res[0], 'total_patients', 0)
                        assert.propertyVal(res[0], 'location', pilot.location)
                    })
            })
        })
    })

    describe('getById()', () => {
        context('when get a unique pilot study', () => {
            it('should return a pilot study', () => {
                return service.getById(pilot.id!, new Query())
                    .then(res => {
                        assert.propertyVal(res, 'id', pilot.id)
                        assert.propertyVal(res, 'name', pilot.name)
                        assert.propertyVal(res, 'is_active', pilot.is_active)
                        assert.property(res, 'start')
                        assert.property(res, 'end')
                        assert.propertyVal(res, 'total_health_professionals', 0)
                        assert.propertyVal(res, 'total_patients', 0)
                        assert.propertyVal(res, 'location', pilot.location)
                    })
            })
        })

        context('when there are validation errors', () => {
            it('should throw an error for invalid id', () => {
                return service.getById('123', new Query())
                    .catch(err => {
                        assert.propertyVal(err, 'message', 'Some ID provided does not have a valid format!')
                        assert.propertyVal(err, 'description', 'A 24-byte hex ID similar to this: 507f191e810c19729de860ea is ' +
                            'expected.')
                    })
            })
        })
    })

    describe('remove()', () => {
        context('when remove a pilot study', () => {
            it('should return true', () => {
                return service.remove(pilot.id!)
                    .then(res => {
                        assert.isBoolean(res)
                        assert.isTrue(res)
                    })
            })
        })

        context('when there are validation errors', () => {
            it('should throw an error for invalid id', () => {
                return service.remove('123')
                    .catch(err => {
                        assert.propertyVal(err, 'message', 'Some ID provided does not have a valid format!')
                        assert.propertyVal(err, 'description', 'A 24-byte hex ID similar to this: 507f191e810c19729de860ea is ' +
                            'expected.')
                    })
            })
        })

    })

    describe('update()', () => {
        context('when update a pilot study', () => {
            it('should return the updated pilot study', () => {
                return service.update(pilot)
                    .then(res => {
                        assert.property(res, 'id')
                        assert.propertyVal(res, 'name', pilot.name)
                        assert.propertyVal(res, 'is_active', pilot.is_active)
                        assert.property(res, 'start')
                        assert.property(res, 'end')
                        assert.propertyVal(res, 'total_health_professionals', 0)
                        assert.propertyVal(res, 'total_patients', 0)
                        assert.propertyVal(res, 'location', pilot.location)
                    })
            })
        })

        context('when there are validation errors', () => {
            it('should return error for pass a invalid id', () => {
                pilot.id = '123'
                return service.update(pilot)
                    .catch(err => {
                        assert.propertyVal(err, 'message', 'Some ID provided does not have a valid format!')
                        assert.propertyVal(err, 'description', 'A 24-byte hex ID similar to this: 507f191e810c19729de860ea is ' +
                            'expected.')
                        pilot.id = DefaultEntityMock.PILOT_STUDY.id
                    })
            })
        })
    })

    describe('count()', () => {
        context('when want count pilot studies', () => {
            it('should return a number of pilot studies', () => {
                return service.count()
                    .then(res => {
                        assert.isNumber(res)
                        assert.equal(res, 1)
                    })
            })
        })
    })

    describe('associateHealthProfessional()', () => {
        context('when associate a health professional with a pilot study', () => {
            it('should return true', () => {
                return service.associateHealthProfessional(pilot.id!, health.id!)
                    .then(res => {
                        assert.isBoolean(res)
                        assert.isTrue(res)
                    })
            })
        })

        context('when there are validation errors', () => {
            it('should throw an error for invalid pilot id', () => {
                return service.associateHealthProfessional('123', health.id!)
                    .catch(err => {
                        assert.propertyVal(err, 'message', 'Some ID provided does not have a valid format!')
                        assert.propertyVal(err, 'description', 'A 24-byte hex ID similar to this: 507f191e810c19729de860ea is ' +
                            'expected.')
                    })
            })

            it('should throw an error for invalid health professional id', () => {
                return service.associateHealthProfessional(pilot.id!, '123')
                    .catch(err => {
                        assert.propertyVal(err, 'message', 'Some ID provided does not have a valid format!')
                        assert.propertyVal(err, 'description', 'A 24-byte hex ID similar to this: 507f191e810c19729de860ea is ' +
                            'expected.')
                    })
            })
        })

        context('when the pilot does not have a register', () => {
            it('should throw an error for pilot without register', () => {
                return service.associateHealthProfessional(`${new ObjectID()}`, health.id!)
                    .catch(err => {
                        assert.propertyVal(err, 'message', 'The association could not be performed because the pilot study ' +
                            'does not have a record.')
                    })
            })
        })

        context('when the health professional does not have a register', () => {
            it('should throw an error for health professional without register', () => {
                return service.associateHealthProfessional(pilot.id!, `${new ObjectID()}`)
                    .catch(err => {
                        assert.propertyVal(err, 'message', 'The association could not be performed because the health ' +
                            'professional does not have a record.')
                    })
            })
        })
    })

    describe('disassociateHealthProfessional()', () => {
        context('when associate a health professional with a pilot study', () => {
            it('should return true', () => {
                return service.disassociateHealthProfessional(pilot.id!, health.id!)
                    .then(res => {
                        assert.isBoolean(res)
                        assert.isTrue(res)
                    })
            })
        })

        context('when there are validation errors', () => {
            it('should throw an error for invalid pilot id', () => {
                return service.disassociateHealthProfessional('123', health.id!)
                    .catch(err => {
                        assert.propertyVal(err, 'message', 'Some ID provided does not have a valid format!')
                        assert.propertyVal(err, 'description', 'A 24-byte hex ID similar to this: 507f191e810c19729de860ea is ' +
                            'expected.')
                    })
            })

            it('should throw an error for invalid health professional id', () => {
                return service.disassociateHealthProfessional(pilot.id!, '123')
                    .catch(err => {
                        assert.propertyVal(err, 'message', 'Some ID provided does not have a valid format!')
                        assert.propertyVal(err, 'description', 'A 24-byte hex ID similar to this: 507f191e810c19729de860ea is ' +
                            'expected.')
                    })
            })
        })
    })

    describe('getAllHealthProfessionals()', () => {
        context('when get a collection of health professionals associated with a pilot', () => {
            it('should return a list of health professionals', () => {
                return service.getAllHealthProfessionals(pilot.id!, new Query())
                    .then(res => {
                        assert.isArray(res)
                        assert.lengthOf(res, 1)
                        assert.propertyVal(res[0], 'email', health.email)
                        assert.propertyVal(res[0], 'birth_date', health.birth_date)
                        assert.propertyVal(res[0], 'phone_number', health.phone_number)
                        assert.propertyVal(res[0], 'selected_pilot_study', health.selected_pilot_study)
                        assert.propertyVal(res[0], 'language', health.language)
                        assert.propertyVal(res[0], 'name', health.name)
                        assert.propertyVal(res[0], 'health_area', health.health_area)
                    })

            })
        })

        context('when there are validation errors', () => {
            it('should throw an error for invalid pilot id', () => {
                return service.getAllHealthProfessionals('123', new Query())
                    .catch(err => {
                        assert.propertyVal(err, 'message', 'Some ID provided does not have a valid format!')
                        assert.propertyVal(err, 'description', 'A 24-byte hex ID similar to this: 507f191e810c19729de860ea is ' +
                            'expected.')
                    })
            })
        })
    })

    describe('associateHealthProfessional()', () => {
        context('when associate a health professional with a pilot study', () => {
            it('should return true', () => {
                return service.associateHealthProfessional(pilot.id!, health.id!)
                    .then(res => {
                        assert.isBoolean(res)
                        assert.isTrue(res)
                    })
            })
        })

        context('when there are validation errors', () => {
            it('should throw an error for invalid pilot id', () => {
                return service.associateHealthProfessional('123', health.id!)
                    .catch(err => {
                        assert.propertyVal(err, 'message', 'Some ID provided does not have a valid format!')
                        assert.propertyVal(err, 'description', 'A 24-byte hex ID similar to this: 507f191e810c19729de860ea is ' +
                            'expected.')
                    })
            })

            it('should throw an error for invalid health professional id', () => {
                return service.associateHealthProfessional(pilot.id!, '123')
                    .catch(err => {
                        assert.propertyVal(err, 'message', 'Some ID provided does not have a valid format!')
                        assert.propertyVal(err, 'description', 'A 24-byte hex ID similar to this: 507f191e810c19729de860ea is ' +
                            'expected.')
                    })
            })
        })

        context('when the pilot does not have a register', () => {
            it('should throw an error for pilot without register', () => {
                return service.associateHealthProfessional(`${new ObjectID()}`, health.id!)
                    .catch(err => {
                        assert.propertyVal(err, 'message', 'The association could not be performed because the pilot study ' +
                            'does not have a record.')
                    })
            })
        })

        context('when the health professional does not have a register', () => {
            it('should throw an error for health professional without register', () => {
                return service.associateHealthProfessional(pilot.id!, `${new ObjectID()}`)
                    .catch(err => {
                        assert.propertyVal(err, 'message', 'The association could not be performed because the health ' +
                            'professional does not have a record.')
                    })
            })
        })
    })

    describe('disassociateHealthProfessional()', () => {
        context('when associate a health professional with a pilot study', () => {
            it('should return true', () => {
                return service.disassociateHealthProfessional(pilot.id!, health.id!)
                    .then(res => {
                        assert.isBoolean(res)
                        assert.isTrue(res)
                    })
            })
        })

        context('when there are validation errors', () => {
            it('should throw an error for invalid pilot id', () => {
                return service.disassociateHealthProfessional('123', health.id!)
                    .catch(err => {
                        assert.propertyVal(err, 'message', 'Some ID provided does not have a valid format!')
                        assert.propertyVal(err, 'description', 'A 24-byte hex ID similar to this: 507f191e810c19729de860ea is ' +
                            'expected.')
                    })
            })

            it('should throw an error for invalid health professional id', () => {
                return service.disassociateHealthProfessional(pilot.id!, '123')
                    .catch(err => {
                        assert.propertyVal(err, 'message', 'Some ID provided does not have a valid format!')
                        assert.propertyVal(err, 'description', 'A 24-byte hex ID similar to this: 507f191e810c19729de860ea is ' +
                            'expected.')
                    })
            })
        })
    })

    describe('getAllHealthProfessionals()', () => {
        context('when get a collection of health professionals associated with a pilot', () => {
            it('should return a list of health professionals', () => {
                return service.getAllHealthProfessionals(pilot.id!, new Query())
                    .then(res => {
                        assert.isArray(res)
                        assert.lengthOf(res, 1)
                        assert.propertyVal(res[0], 'email', health.email)
                        assert.propertyVal(res[0], 'birth_date', health.birth_date)
                        assert.propertyVal(res[0], 'phone_number', health.phone_number)
                        assert.propertyVal(res[0], 'selected_pilot_study', health.selected_pilot_study)
                        assert.propertyVal(res[0], 'language', health.language)
                        assert.propertyVal(res[0], 'name', health.name)
                        assert.propertyVal(res[0], 'health_area', health.health_area)
                    })

            })
        })

        context('when there are validation errors', () => {
            it('should throw an error for invalid pilot id', () => {
                return service.getAllHealthProfessionals('123', new Query())
                    .catch(err => {
                        assert.propertyVal(err, 'message', 'Some ID provided does not have a valid format!')
                        assert.propertyVal(err, 'description', 'A 24-byte hex ID similar to this: 507f191e810c19729de860ea is ' +
                            'expected.')
                    })
            })
        })
    })

    describe('associatePatient()', () => {
        context('when associate a patient with a pilot study', () => {
            it('should return true', () => {
                return service.associatePatient(pilot.id!, patient.id!)
                    .then(res => {
                        assert.isBoolean(res)
                        assert.isTrue(res)
                    })
            })
        })

        context('when there are validation errors', () => {
            it('should throw an error for invalid pilot id', () => {
                return service.associatePatient('123', patient.id!)
                    .catch(err => {
                        assert.propertyVal(err, 'message', 'Some ID provided does not have a valid format!')
                        assert.propertyVal(err, 'description', 'A 24-byte hex ID similar to this: 507f191e810c19729de860ea is ' +
                            'expected.')
                    })
            })

            it('should throw an error for invalid patient id', () => {
                return service.associatePatient(pilot.id!, '123')
                    .catch(err => {
                        assert.propertyVal(err, 'message', 'Some ID provided does not have a valid format!')
                        assert.propertyVal(err, 'description', 'A 24-byte hex ID similar to this: 507f191e810c19729de860ea is ' +
                            'expected.')
                    })
            })
        })

        context('when the pilot does not have a register', () => {
            it('should throw an error for pilot without register', () => {
                return service.associatePatient(`${new ObjectID()}`, patient.id!)
                    .catch(err => {
                        assert.propertyVal(err, 'message', 'The association could not be performed because the pilot study ' +
                            'does not have a record.')
                    })
            })
        })

        context('when the patient does not have a register', () => {
            it('should throw an error for patient without register', () => {
                return service.associatePatient(pilot.id!, `${new ObjectID()}`)
                    .catch(err => {
                        assert.propertyVal(err, 'message', 'The association could not be performed because the patient ' +
                            'does not have a record.')
                    })
            })
        })
    })

    describe('disassociatePatient()', () => {
        context('when associate a patient with a pilot study', () => {
            it('should return true', () => {
                return service.disassociatePatient(pilot.id!, patient.id!)
                    .then(res => {
                        assert.isBoolean(res)
                        assert.isTrue(res)
                    })
            })
        })

        context('when there are validation errors', () => {
            it('should throw an error for invalid pilot id', () => {
                return service.disassociatePatient('123', patient.id!)
                    .catch(err => {
                        assert.propertyVal(err, 'message', 'Some ID provided does not have a valid format!')
                        assert.propertyVal(err, 'description', 'A 24-byte hex ID similar to this: 507f191e810c19729de860ea is ' +
                            'expected.')
                    })
            })

            it('should throw an error for invalid patient id', () => {
                return service.disassociatePatient(pilot.id!, '123')
                    .catch(err => {
                        assert.propertyVal(err, 'message', 'Some ID provided does not have a valid format!')
                        assert.propertyVal(err, 'description', 'A 24-byte hex ID similar to this: 507f191e810c19729de860ea is ' +
                            'expected.')
                    })
            })
        })
    })

    describe('getAllPatients()', () => {
        context('when get a collection of patients associated with a pilot', () => {
            it('should return a list of patients', () => {
                return service.getAllPatients(pilot.id!, new Query())
                    .then(res => {
                        assert.isArray(res)
                        assert.lengthOf(res, 1)
                        assert.propertyVal(res[0], 'email', patient.email)
                        assert.propertyVal(res[0], 'birth_date', patient.birth_date)
                        assert.propertyVal(res[0], 'phone_number', patient.phone_number)
                        assert.propertyVal(res[0], 'selected_pilot_study', patient.selected_pilot_study)
                        assert.propertyVal(res[0], 'language', patient.language)
                        assert.propertyVal(res[0], 'name', patient.name)
                        assert.propertyVal(res[0], 'gender', patient.gender)
                    })

            })
        })

        context('when there are validation errors', () => {
            it('should throw an error for invalid pilot id', () => {
                return service.getAllPatients('123', new Query())
                    .catch(err => {
                        assert.propertyVal(err, 'message', 'Some ID provided does not have a valid format!')
                        assert.propertyVal(err, 'description', 'A 24-byte hex ID similar to this: 507f191e810c19729de860ea is ' +
                            'expected.')
                    })
            })
        })
    })

    describe('countPilotStudiesFromHealthProfessional', () => {
        context('when get the quantity of pilot studies from health professional', () => {
            it('should return a number', () => {
                return service.countPilotStudiesFromHealthProfessional(health.id!)
                    .then(res => {
                        assert.isNumber(res)
                        assert.equal(res, 1)
                    })
            })
        })
    })

    describe('countPilotStudiesFromPatient', () => {
        context('when get the quantity of pilot studies from patient', () => {
            it('should return a number', () => {
                return service.countPilotStudiesFromPatient(patient.id!)
                    .then(res => {
                        assert.isNumber(res)
                        assert.equal(res, 1)
                    })
            })
        })
    })
})
