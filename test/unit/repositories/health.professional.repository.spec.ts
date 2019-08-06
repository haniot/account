import { assert } from 'chai'
import sinon from 'sinon'
import { UserRepoModel } from '../../../src/infrastructure/database/schema/user.schema'
import { EntityMapperMock } from '../../mocks/models/entity.mapper.mock'
import { CustomLoggerMock } from '../../mocks/custom.logger.mock'
import { DefaultEntityMock } from '../../mocks/models/default.entity.mock'
import { HealthProfessionalRepository } from '../../../src/infrastructure/repository/health.professional.repository'
import { HealthProfessional } from '../../../src/application/domain/model/health.professional'
import { UserType } from '../../../src/application/domain/utils/user.type'
import { UserRepositoryMock } from '../../mocks/repositories/user.repository.mock'

require('sinon-mongoose')

describe('Repositories: HealthProfessionalRepository', () => {
    const modelFake: any = UserRepoModel
    const repo =
        new HealthProfessionalRepository(modelFake, new EntityMapperMock(), new UserRepositoryMock(), new CustomLoggerMock())
    const user: HealthProfessional = new HealthProfessional().fromJSON(DefaultEntityMock.HEALTH_PROFESSIONAL)
    user.id = DefaultEntityMock.HEALTH_PROFESSIONAL.id

    afterEach(() => {
        sinon.restore()
    })

    describe('create()', () => {
        context('when save a new health professional', () => {
            it('should return a saved user', () => {
                sinon
                    .mock(modelFake)
                    .expects('create')
                    .withArgs(user)
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
                        assert.propertyVal(res, 'health_area', user.health_area)
                    })
            })
        })

        context('when the password is not passed', () => {
            it('should reject an error', () => {
                user.password = undefined
                sinon
                    .mock(modelFake)
                    .expects('create')
                    .withArgs(user)
                    .rejects({
                        message: 'An internal error has occurred in the database!',
                        description: 'Please try again later...'
                    })
                return repo.create(user)
                    .catch(err => {
                        assert.propertyVal(err, 'message', 'An internal error has occurred in the database!')
                        assert.propertyVal(err, 'description', 'Please try again later...')
                    })
            })
        })
    })

    describe('count()', () => {
        context('when want count users', () => {
            it('should return a number of users', () => {
                sinon
                    .mock(modelFake)
                    .expects('countDocuments')
                    .withArgs({ type: UserType.HEALTH_PROFESSIONAL })
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

    describe('checkExists()', () => {
        context('when the parameter is a health professional', () => {
            context('when check if a unique health professional exists', () => {
                it('should return true if exists', () => {
                    sinon
                        .mock(modelFake)
                        .expects('findOne')
                        .withArgs({ _id: user.id, type: 'health_professional' })
                        .chain('select')
                        .chain('exec')
                        .resolves(user)

                    return repo.checkExists(user)
                        .then(res => {
                            assert.isBoolean(res)
                            assert.isTrue(res)
                        })
                })
            })

            context('when the health professional does not exists', () => {
                it('should return false', () => {
                    sinon
                        .mock(modelFake)
                        .expects('findOne')
                        .withArgs({ _id: user.id, type: 'health_professional' })
                        .chain('select')
                        .chain('exec')
                        .resolves(undefined)

                    return repo.checkExists(user)
                        .then(res => {
                            assert.isBoolean(res)
                            assert.isFalse(res)
                        })
                })
            })

            context('when the health professional does not have id', () => {
                it('should reject an error', () => {
                    sinon
                        .mock(modelFake)
                        .expects('findOne')
                        .withArgs({ _id: undefined, type: 'health_professional' })
                        .chain('select')
                        .chain('exec')
                        .resolves(undefined)

                    user.id = undefined
                    return repo.checkExists(user)
                        .catch(err => {
                            assert.propertyVal(err, 'message', 'An internal error has occurred in the database!')
                            assert.propertyVal(err, 'description', 'Please try again later...')
                            user.id = DefaultEntityMock.HEALTH_PROFESSIONAL.id
                        })
                })
            })

            context('when there are a database error', () => {
                it('should reject an error', () => {
                    sinon
                        .mock(modelFake)
                        .expects('findOne')
                        .withArgs({ _id: user.id, type: 'health_professional' })
                        .chain('select')
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

        context('when the parameter is a array of health professional', () => {
            context('when the health professionals exists', () => {
                it('should return true', () => {
                    sinon
                        .mock(modelFake)
                        .expects('findOne')
                        .withArgs({ _id: user.id, type: 'health_professional' })
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

            context('when the health professionals list is empty', () => {
                it('should return false', () => {
                    return repo.checkExists([])
                        .then(res => {
                            assert.isBoolean(res)
                            assert.isFalse(res)
                        })
                })
            })

            context('when the health professional does not exists', () => {
                it('should return false', () => {
                    sinon
                        .mock(modelFake)
                        .expects('findOne')
                        .withArgs({ _id: user.id, type: 'health_professional' })
                        .chain('select')
                        .chain('exec')
                        .resolves(undefined)

                    return repo.checkExists([user])
                        .then(res => {
                            assert.propertyVal(res, 'message', user.id)
                        })
                })
            })

            context('when the health professional does not have id', () => {
                it('should reject an error', () => {
                    sinon
                        .mock(modelFake)
                        .expects('findOne')
                        .withArgs({ _id: undefined, type: 'health_professional' })
                        .chain('select')
                        .chain('exec')
                        .resolves(undefined)

                    user.id = undefined
                    return repo.checkExists([user])
                        .catch(err => {
                            assert.propertyVal(err, 'message', 'An internal error has occurred in the database!')
                            assert.propertyVal(err, 'description', 'Please try again later...')
                            user.id = DefaultEntityMock.HEALTH_PROFESSIONAL.id
                        })
                })
            })

            context('when there are a database error', () => {
                it('should reject an error', () => {
                    sinon
                        .mock(modelFake)
                        .expects('findOne')
                        .withArgs({ _id: user.id, type: 'health_professional' })
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
