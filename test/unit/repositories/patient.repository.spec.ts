import sinon from 'sinon'
import { assert } from 'chai'
import { EntityMapperMock } from '../../mocks/models/entity.mapper.mock'
import { CustomLoggerMock } from '../../mocks/custom.logger.mock'
import { DefaultEntityMock } from '../../mocks/models/default.entity.mock'
import { Query } from '../../../src/infrastructure/repository/query/query'
import { Patient } from '../../../src/application/domain/model/patient'
import { PatientRepository } from '../../../src/infrastructure/repository/patient.repository'
import { UserRepoModel } from '../../../src/infrastructure/database/schema/user.schema'
import { UserRepositoryMock } from '../../mocks/repositories/user.repository.mock'

require('sinon-mongoose')

describe('Repositories: PatientRepository', () => {
    const modelFake: any = UserRepoModel
    const repo =
        new PatientRepository(modelFake, new EntityMapperMock(), new UserRepositoryMock(), new CustomLoggerMock())
    const patient: Patient = new Patient().fromJSON(DefaultEntityMock.PATIENT)

    afterEach(() => {
        sinon.restore()
    })

    describe('create()', () => {
        context('when save a new patient', () => {
            it('should return the saved patient', () => {
                sinon
                    .mock(modelFake)
                    .expects('create')
                    .withArgs(patient)
                    .chain('exec')
                    .resolves(patient)

                return repo.create(patient)
                    .then(result => {
                        assert.property(result, 'id')
                        assert.propertyVal(result, 'id', patient.id)
                        assert.property(result, 'pilotstudy_id')
                        assert.propertyVal(result, 'pilotstudy_id', patient.pilotstudy_id)
                        assert.property(result, 'name')
                        assert.propertyVal(result, 'name', patient.name)
                        assert.property(result, 'email')
                        assert.propertyVal(result, 'email', patient.email)
                        assert.property(result, 'gender')
                        assert.propertyVal(result, 'gender', patient.gender)
                        assert.property(result, 'birth_date')
                        assert.propertyVal(result, 'birth_date', patient.birth_date)
                    })
            })
        })

        context('when the patient is not saved', () => {
            it('should return undefined', () => {
                sinon
                    .mock(modelFake)
                    .expects('create')
                    .withArgs(patient)
                    .chain('exec')
                    .resolves(undefined)

                return repo.create(patient)
                    .then(result => {
                        assert.equal(result, undefined)
                    })
            })
        })

        context('when a database error occurs', () => {
            it('should reject a error', () => {
                sinon
                    .mock(modelFake)
                    .expects('create')
                    .withArgs(patient)
                    .chain('exec')
                    .rejects({ message: 'An internal error has occurred in the database!' })

                return repo.create(patient)
                    .catch(err => {
                        assert.property(err, 'name')
                        assert.propertyVal(err, 'name', 'Error')
                        assert.property(err, 'message')
                        assert.propertyVal(err, 'message', 'An internal error has occurred in the database!')
                    })
            })
        })
    })

    describe('find()', () => {
        context('when get all patients', () => {
            it('should return a list of patients', () => {
                sinon
                    .mock(modelFake)
                    .expects('find')
                    .chain('select')
                    .chain('sort')
                    .withArgs({ created_at: 'desc' })
                    .chain('skip')
                    .withArgs(0)
                    .chain('limit')
                    .withArgs(100)
                    .chain('exec')
                    .resolves([patient])

                return repo.find(new Query())
                    .then(result => {
                        assert.isArray(result)
                        assert.lengthOf(result, 1)
                        assert.property(result[0], 'id')
                        assert.propertyVal(result[0], 'id', patient.id)
                        assert.property(result[0], 'pilotstudy_id')
                        assert.propertyVal(result[0], 'pilotstudy_id', patient.pilotstudy_id)
                        assert.property(result[0], 'name')
                        assert.propertyVal(result[0], 'name', patient.name)
                        assert.property(result[0], 'email')
                        assert.propertyVal(result[0], 'email', patient.email)
                        assert.property(result[0], 'gender')
                        assert.propertyVal(result[0], 'gender', patient.gender)
                        assert.property(result[0], 'birth_date')
                        assert.propertyVal(result[0], 'birth_date', patient.birth_date)
                    })
            })
        })

        context('when there are no patients', () => {
            it('should return empty array', () => {
                sinon
                    .mock(modelFake)
                    .expects('find')
                    .chain('select')
                    .chain('sort')
                    .withArgs({ created_at: 'desc' })
                    .chain('skip')
                    .withArgs(0)
                    .chain('limit')
                    .withArgs(100)
                    .chain('exec')
                    .resolves([])

                return repo.find(new Query())
                    .then(result => {
                        assert.isArray(result)
                        assert.lengthOf(result, 0)
                    })
            })
        })

        context('when a database error occurs', () => {
            it('should reject a error', () => {
                sinon
                    .mock(modelFake)
                    .expects('find')
                    .chain('select')
                    .chain('sort')
                    .withArgs({ created_at: 'desc' })
                    .chain('skip')
                    .withArgs(0)
                    .chain('limit')
                    .withArgs(100)
                    .chain('exec')
                    .rejects({ message: 'An internal error has occurred in the database!' })

                return repo.find(new Query())
                    .catch(err => {
                        assert.property(err, 'name')
                        assert.propertyVal(err, 'name', 'Error')
                        assert.property(err, 'message')
                        assert.propertyVal(err, 'message', 'An internal error has occurred in the database!')
                    })
            })
        })
    })

    describe('findOne()', () => {
        context('when get a unique patient', () => {
            it('should return a unique patient', () => {

                const query = new Query()
                query.addFilter({ _id: patient.id })

                sinon
                    .mock(modelFake)
                    .expects('findOne')
                    .withArgs({ _id: patient.id })
                    .chain('select')
                    .chain('exec')
                    .resolves(patient)

                return repo.findOne(query)
                    .then(result => {
                        assert.property(result, 'id')
                        assert.propertyVal(result, 'id', patient.id)
                        assert.property(result, 'pilotstudy_id')
                        assert.propertyVal(result, 'pilotstudy_id', patient.pilotstudy_id)
                        assert.property(result, 'name')
                        assert.propertyVal(result, 'name', patient.name)
                        assert.property(result, 'email')
                        assert.propertyVal(result, 'email', patient.email)
                        assert.property(result, 'gender')
                        assert.propertyVal(result, 'gender', patient.gender)
                        assert.property(result, 'birth_date')
                        assert.propertyVal(result, 'birth_date', patient.birth_date)
                    })
            })
        })

        context('when the patient is not found', () => {
            it('should return undefined', () => {
                const query = new Query()
                query.addFilter({ _id: patient.id })

                sinon
                    .mock(modelFake)
                    .expects('findOne')
                    .withArgs({ _id: patient.id })
                    .chain('select')
                    .chain('exec')
                    .resolves(undefined)

                return repo.findOne(query)
                    .then(result => {
                        assert.equal(result, undefined)
                    })
            })
        })

        context('when a database error occurs', () => {
            it('should reject a error', () => {
                const query = new Query()
                query.addFilter({ _id: patient.id })

                sinon
                    .mock(modelFake)
                    .expects('findOne')
                    .withArgs({ _id: patient.id })
                    .chain('select')
                    .chain('exec')
                    .rejects({ message: 'An internal error has occurred in the database!' })

                return repo.findOne(query)
                    .catch(err => {
                        assert.property(err, 'name')
                        assert.propertyVal(err, 'name', 'Error')
                        assert.property(err, 'message')
                        assert.propertyVal(err, 'message', 'An internal error has occurred in the database!')
                    })
            })
        })
    })

    describe('update()', () => {
        context('when update a patient', () => {
            it('should return the updated patient', () => {
                sinon
                    .mock(modelFake)
                    .expects('findOneAndUpdate')
                    .withArgs({ _id: patient.id }, patient, { new: true })
                    .chain('exec')
                    .resolves(patient)

                return repo.update(patient)
                    .then(result => {
                        assert.property(result, 'id')
                        assert.propertyVal(result, 'id', patient.id)
                        assert.property(result, 'pilotstudy_id')
                        assert.propertyVal(result, 'pilotstudy_id', patient.pilotstudy_id)
                        assert.property(result, 'name')
                        assert.propertyVal(result, 'name', patient.name)
                        assert.property(result, 'email')
                        assert.propertyVal(result, 'email', patient.email)
                        assert.property(result, 'gender')
                        assert.propertyVal(result, 'gender', patient.gender)
                        assert.property(result, 'birth_date')
                        assert.propertyVal(result, 'birth_date', patient.birth_date)
                    })
            })
        })
        context('when the patient is not found', () => {
            it('should return undefined', () => {
                sinon
                    .mock(modelFake)
                    .expects('findOneAndUpdate')
                    .withArgs({ _id: patient.id }, patient, { new: true })
                    .chain('exec')
                    .resolves(undefined)

                return repo.update(patient)
                    .then(result => {
                        assert.equal(result, undefined)
                    })
            })
        })

        context('when a database error occurs', () => {
            it('should reject a error', () => {
                sinon
                    .mock(modelFake)
                    .expects('findOneAndUpdate')
                    .withArgs({ _id: patient.id }, patient, { new: true })
                    .chain('exec')
                    .rejects({ message: 'An internal error has occurred in the database!' })

                return repo.update(patient)
                    .catch(err => {
                        assert.property(err, 'name')
                        assert.propertyVal(err, 'name', 'Error')
                        assert.property(err, 'message')
                        assert.propertyVal(err, 'message', 'An internal error has occurred in the database!')
                    })
            })
        })
    })

    describe('delete()', () => {
        context('when want delete patient', () => {
            it('should return true', () => {
                sinon
                    .mock(modelFake)
                    .expects('findOneAndDelete')
                    .withArgs({ _id: patient.id })
                    .chain('exec')
                    .resolves(true)

                return repo.delete(patient.id!)
                    .then(result => {
                        assert.isBoolean(result)
                        assert.isTrue(result)
                    })
            })
        })

        context('when the patient is not found', () => {
            it('should return false', () => {
                sinon
                    .mock(modelFake)
                    .expects('findOneAndDelete')
                    .withArgs({ _id: patient.id })
                    .chain('exec')
                    .resolves(false)

                return repo.delete(patient.id!)
                    .then(result => {
                        assert.isBoolean(result)
                        assert.isFalse(result)
                    })
            })
        })

        context('when a database error occurs', () => {
            it('should reject a error', () => {
                sinon
                    .mock(modelFake)
                    .expects('findOneAndDelete')
                    .withArgs({ _id: patient.id })
                    .chain('exec')
                    .rejects({ message: 'An internal error has occurred in the database!' })

                return repo.delete(patient.id!)
                    .catch(err => {
                        assert.property(err, 'name')
                        assert.propertyVal(err, 'name', 'Error')
                        assert.property(err, 'message')
                        assert.propertyVal(err, 'message', 'An internal error has occurred in the database!')
                    })
            })
        })
    })

    describe('count()', () => {
        context('when count all patients by a filter', () => {
            it('should return the number of patients', () => {
                sinon
                    .mock(modelFake)
                    .expects('countDocuments')
                    .withArgs({})
                    .chain('exec')
                    .resolves(1)

                return repo.count(new Query())
                    .then(result => {
                        assert.isNumber(result)
                        assert.equal(result, 1)
                    })
            })
        })

        context('when a database error occurs', () => {
            it('should reject a error', () => {
                sinon
                    .mock(modelFake)
                    .expects('countDocuments')
                    .withArgs({})
                    .chain('exec')
                    .rejects({ message: 'An internal error has occurred in the database!' })

                return repo.count(new Query())
                    .catch(err => {
                        assert.property(err, 'name')
                        assert.propertyVal(err, 'name', 'Error')
                        assert.property(err, 'message')
                        assert.propertyVal(err, 'message', 'An internal error has occurred in the database!')
                    })
            })
        })
    })
})
