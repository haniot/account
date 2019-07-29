import sinon from 'sinon'
import { assert } from 'chai'
import { EntityMapperMock } from '../../mocks/models/entity.mapper.mock'
import { CustomLoggerMock } from '../../mocks/custom.logger.mock'
import { DefaultEntityMock } from '../../mocks/models/default.entity.mock'
import { Patient } from '../../../src/application/domain/model/patient'
import { PatientRepository } from '../../../src/infrastructure/repository/patient.repository'
import { UserRepoModel } from '../../../src/infrastructure/database/schema/user.schema'
import { UserType } from '../../../src/application/domain/utils/user.type'
import { UserRepositoryMock } from '../../mocks/repositories/user.repository.mock'

require('sinon-mongoose')

describe('Repositories: PatientRepository', () => {
    const modelFake: any = UserRepoModel
    const repo = new PatientRepository(modelFake, new EntityMapperMock(), new UserRepositoryMock(), new CustomLoggerMock())
    const user: Patient = new Patient().fromJSON(DefaultEntityMock.PATIENT)

    afterEach(() => {
        sinon.restore()
    })

    describe('create()', () => {
        context('when save a new patient', () => {
            it('should return the saved patient', () => {
                sinon
                    .mock(modelFake)
                    .expects('create')
                    .withArgs(user)
                    .chain('exec')
                    .resolves(user)

                return repo.create(user)
                    .then(res => {
                        assert.propertyVal(res, 'id', user.id)
                        assert.propertyVal(res, 'email', user.email)
                        assert.propertyVal(res, 'birth_date', user.birth_date)
                        assert.propertyVal(res, 'phone_number', user.phone_number)
                        assert.propertyVal(res, 'selected_pilot_study', user.selected_pilot_study)
                        assert.propertyVal(res, 'language', user.language)
                        assert.propertyVal(res, 'name', user.name)
                        assert.propertyVal(res, 'gender', user.gender)
                    })
            })
        })

        context('when the does not have a password', () => {
            it('should return error for does not pass password', () => {
                user.password = undefined
                sinon
                    .mock(modelFake)
                    .expects('create')
                    .withArgs(user)
                    .chain('exec')
                    .rejects({ name: 'ValidationError' })

                return repo.create(user)
                    .catch(err => {
                        assert.propertyVal(err, 'message', 'Required fields were not provided!')
                        user.password = DefaultEntityMock.USER.password
                    })
            })
        })

        context('when a database error occurs', () => {
            it('should reject a error', () => {
                sinon
                    .mock(modelFake)
                    .expects('create')
                    .withArgs(user)
                    .chain('exec')
                    .rejects({ message: 'An internal error has occurred in the database!' })
                return repo.create(user)
                    .catch(err => {
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
                    .withArgs({ type: UserType.PATIENT })
                    .chain('exec')
                    .resolves(1)

                return repo.count()
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
                    .expects('countDocuments')
                    .withArgs({ type: UserType.PATIENT })
                    .chain('exec')
                    .rejects({ message: 'An internal error has occurred in the database!' })

                return repo.count()
                    .catch(err => {
                        assert.propertyVal(err, 'message', 'An internal error has occurred in the database!')
                    })
            })
        })
    })

    describe('checkExists()', () => {
        context('when the parameter is a patient', () => {
            context('when check if a unique patient exists', () => {
                it('should return true if exists', () => {
                    sinon
                        .mock(modelFake)
                        .expects('findOne')
                        .withArgs({ _id: user.id, type: 'patient', name: user.name, birth_date: user.birth_date })
                        .chain('exec')
                        .resolves(user)

                    return repo.checkExists(user)
                        .then(res => {
                            assert.isBoolean(res)
                            assert.isTrue(res)
                        })
                })
            })

            context('when the patient does not exists', () => {
                it('should return false', () => {
                    sinon
                        .mock(modelFake)
                        .expects('findOne')
                        .withArgs({ _id: user.id, type: 'patient', name: user.name, birth_date: user.birth_date })
                        .chain('exec')
                        .resolves(undefined)

                    return repo.checkExists(user)
                        .then(res => {
                            assert.isBoolean(res)
                            assert.isFalse(res)
                        })
                })
            })

            context('when the patient does not have id', () => {
                it('should reject an error', () => {
                    sinon
                        .mock(modelFake)
                        .expects('findOne')
                        .withArgs({ _id: undefined, type: 'patient' })
                        .chain('exec')
                        .resolves(undefined)

                    return repo.checkExists(new Patient())
                        .catch(err => {
                            assert.propertyVal(err, 'message', 'An internal error has occurred in the database!')
                            assert.propertyVal(err, 'description', 'Please try again later...')
                        })
                })
            })

            context('when there are a database error', () => {
                it('should reject an error', () => {
                    sinon
                        .mock(modelFake)
                        .expects('findOne')
                        .withArgs({ _id: user.id, type: 'patient' })
                        .chain('exec')
                        .rejects({ message: 'An internal error has occurred in the database!' })

                    return repo.checkExists(user)
                        .catch(err => {
                            assert.propertyVal(err, 'message', 'An internal error has occurred in the database!')
                            assert.propertyVal(err, 'description', 'Please try again later...')
                        })
                })
            })
        })

        context('when the parameter is a array of patient', () => {
            context('when the patients exists', () => {
                it('should return true', () => {
                    sinon
                        .mock(modelFake)
                        .expects('findOne')
                        .withArgs({ _id: user.id, type: 'patient' })
                        .chain('select')
                        .chain('exec')
                        .resolves(user)

                    return repo.checkExists([user])
                        .then(res => {
                            assert.isBoolean(res)
                            assert.isTrue(res)
                        })
                })
            })

            context('when the patients list is empty', () => {
                it('should return false', () => {
                    return repo.checkExists([])
                        .then(res => {
                            assert.isBoolean(res)
                            assert.isFalse(res)
                        })
                })
            })

            context('when the patient does not exists', () => {
                it('should return false', () => {
                    sinon
                        .mock(modelFake)
                        .expects('findOne')
                        .withArgs({ _id: user.id, type: 'patient' })
                        .chain('select')
                        .chain('exec')
                        .resolves(undefined)

                    return repo.checkExists([user])
                        .then(res => {
                            assert.propertyVal(res, 'message', user.id)
                        })
                })
            })

            context('when the patient does not have id', () => {
                it('should reject an error', () => {
                    sinon
                        .mock(modelFake)
                        .expects('findOne')
                        .withArgs({ _id: undefined, type: 'patient' })
                        .chain('select')
                        .chain('exec')
                        .resolves(undefined)

                    user.id = undefined
                    return repo.checkExists([user])
                        .catch(err => {
                            assert.propertyVal(err, 'message', 'An internal error has occurred in the database!')
                            assert.propertyVal(err, 'description', 'Please try again later...')
                            user.id = DefaultEntityMock.PATIENT.id
                        })
                })
            })

            context('when there are a database error', () => {
                it('should reject an error', () => {
                    sinon
                        .mock(modelFake)
                        .expects('findOne')
                        .withArgs({ _id: user.id, type: 'patient' })
                        .chain('select')
                        .chain('exec')
                        .rejects({ message: 'An internal error has occurred in the database!' })

                    return repo.checkExists([user])
                        .catch(err => {
                            assert.propertyVal(err, 'message', 'An internal error has occurred in the database!')
                            assert.propertyVal(err, 'description', 'Please try again later...')
                        })
                })
            })
        })
    })

})
