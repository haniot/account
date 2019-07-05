import sinon from 'sinon'
import { assert } from 'chai'
import { EntityMapperMock } from '../../mocks/models/entity.mapper.mock'
import { CustomLoggerMock } from '../../mocks/custom.logger.mock'
import { UserRepoModel } from '../../../src/infrastructure/database/schema/user.schema'
import { Entity } from '../../../src/application/domain/model/entity'
import { BaseRepository } from '../../../src/infrastructure/repository/base/base.repository'
import { IEntityMapper } from '../../../src/infrastructure/port/entity.mapper.interface'
import { ILogger } from '../../../src/utils/custom.logger'
import { User } from '../../../src/application/domain/model/user'
import { DefaultEntityMock } from '../../mocks/models/default.entity.mock'
import { Query } from '../../../src/infrastructure/repository/query/query'

require('sinon-mongoose')

class UserRepository<T extends Entity, TModel> extends BaseRepository<any, any> {
    constructor(
        readonly userModel: any,
        readonly userMapper: IEntityMapper<T, TModel>,
        readonly logger: ILogger
    ) {
        super(userModel, userMapper, logger)
    }
}

describe('Repositories: BaseRepository', () => {
    const modelFake: any = UserRepoModel
    const repo = new UserRepository(modelFake, new EntityMapperMock(), new CustomLoggerMock())
    const user: User = new User().fromJSON(DefaultEntityMock.USER)

    afterEach(() => {
        sinon.restore()
    })

    describe('create()', () => {
        context('when save a new user', () => {
            it('should return the saved user', () => {
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
                    })
            })
        })

        context('when the user is not saved', () => {
            it('should return undefined', () => {
                sinon
                    .mock(modelFake)
                    .expects('create')
                    .withArgs(user)
                    .chain('exec')
                    .resolves(undefined)

                return repo.create(user)
                    .then(res => {
                        assert.isUndefined(res)
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

    describe('find()', () => {
        context('when get all users', () => {
            it('should return a list of users', () => {
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
                    .resolves([user])

                return repo.find(new Query())
                    .then(res => {
                        assert.isArray(res)
                        assert.lengthOf(res, 1)
                        assert.propertyVal(res[0], 'id', user.id)
                        assert.propertyVal(res[0], 'email', user.email)
                        assert.propertyVal(res[0], 'birth_date', user.birth_date)
                        assert.propertyVal(res[0], 'phone_number', user.phone_number)
                        assert.propertyVal(res[0], 'selected_pilot_study', user.selected_pilot_study)
                        assert.propertyVal(res[0], 'language', user.language)
                    })
            })
        })

        context('when there are no users', () => {
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
                    .then(res => {
                        assert.isArray(res)
                        assert.lengthOf(res, 0)
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
                        assert.propertyVal(err, 'message', 'An internal error has occurred in the database!')
                    })
            })
        })
    })

    describe('findOne()', () => {
        context('when get a unique user', () => {
            it('should return a unique user', () => {

                const query = new Query()
                query.addFilter({ _id: user.id })

                sinon
                    .mock(modelFake)
                    .expects('findOne')
                    .withArgs({ _id: user.id })
                    .chain('select')
                    .chain('exec')
                    .resolves(user)

                return repo.findOne(query)
                    .then(res => {
                        assert.propertyVal(res, 'id', user.id)
                        assert.propertyVal(res, 'email', user.email)
                        assert.propertyVal(res, 'birth_date', user.birth_date)
                        assert.propertyVal(res, 'phone_number', user.phone_number)
                        assert.propertyVal(res, 'selected_pilot_study', user.selected_pilot_study)
                        assert.propertyVal(res, 'language', user.language)
                    })
            })
        })

        context('when the user is not found', () => {
            it('should return undefined', () => {
                const query = new Query()
                query.addFilter({ _id: user.id })

                sinon
                    .mock(modelFake)
                    .expects('findOne')
                    .withArgs({ _id: user.id })
                    .chain('select')
                    .chain('exec')
                    .resolves(undefined)

                return repo.findOne(query)
                    .then(res => {
                        assert.isUndefined(res)
                    })
            })
        })

        context('when a database error occurs', () => {
            it('should reject a error', () => {
                const query = new Query()
                query.addFilter({ _id: user.id })

                sinon
                    .mock(modelFake)
                    .expects('findOne')
                    .withArgs({ _id: user.id })
                    .chain('select')
                    .chain('exec')
                    .rejects({ message: 'An internal error has occurred in the database!' })

                return repo.findOne(query)
                    .catch(err => {
                        assert.propertyVal(err, 'message', 'An internal error has occurred in the database!')
                    })
            })
        })
    })

    describe('update()', () => {
        context('when update a user', () => {
            it('should return the updated user', () => {
                sinon
                    .mock(modelFake)
                    .expects('findOneAndUpdate')
                    .withArgs({ _id: user.id }, user, { new: true })
                    .chain('exec')
                    .resolves(user)

                return repo.update(user)
                    .then(res => {
                        assert.propertyVal(res, 'id', user.id)
                        assert.propertyVal(res, 'email', user.email)
                        assert.propertyVal(res, 'birth_date', user.birth_date)
                        assert.propertyVal(res, 'phone_number', user.phone_number)
                        assert.propertyVal(res, 'selected_pilot_study', user.selected_pilot_study)
                        assert.propertyVal(res, 'language', user.language)
                    })
            })
        })
        context('when the user is not found', () => {
            it('should return undefined', () => {
                sinon
                    .mock(modelFake)
                    .expects('findOneAndUpdate')
                    .withArgs({ _id: user.id }, user, { new: true })
                    .chain('exec')
                    .resolves(undefined)

                return repo.update(user)
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
                    .withArgs({ _id: user.id }, user, { new: true })
                    .chain('exec')
                    .rejects({ message: 'An internal error has occurred in the database!' })

                return repo.update(user)
                    .catch(err => {
                        assert.propertyVal(err, 'message', 'An internal error has occurred in the database!')
                    })
            })
        })
    })

    describe('delete()', () => {
        context('when want delete user', () => {
            it('should return true', () => {
                sinon
                    .mock(modelFake)
                    .expects('findOneAndDelete')
                    .withArgs({ _id: user.id })
                    .chain('exec')
                    .resolves(true)

                return repo.delete(user.id!)
                    .then(res => {
                        assert.isBoolean(res)
                        assert.isTrue(res)
                    })
            })
        })

        context('when the user is not found', () => {
            it('should return false', () => {
                sinon
                    .mock(modelFake)
                    .expects('findOneAndDelete')
                    .withArgs({ _id: user.id })
                    .chain('exec')
                    .resolves(false)

                return repo.delete(user.id!)
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
                    .expects('findOneAndDelete')
                    .withArgs({ _id: user.id })
                    .chain('exec')
                    .rejects({ message: 'An internal error has occurred in the database!' })

                return repo.delete(user.id!)
                    .catch(err => {
                        assert.propertyVal(err, 'name', 'Error')
                        assert.propertyVal(err, 'message', 'An internal error has occurred in the database!')
                    })
            })
        })
    })

    describe('count()', () => {
        context('when count all users by a filter', () => {
            it('should return the number of users', () => {
                sinon
                    .mock(modelFake)
                    .expects('countDocuments')
                    .withArgs({})
                    .chain('exec')
                    .resolves(1)

                return repo.count(new Query())
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
                    .withArgs({})
                    .chain('exec')
                    .rejects({ message: 'An internal error has occurred in the database!' })

                return repo.count(new Query())
                    .catch(err => {
                        assert.propertyVal(err, 'name', 'Error')
                        assert.propertyVal(err, 'message', 'An internal error has occurred in the database!')
                    })
            })
        })
    })

    describe('mongoDBErrorListener()', () => {
        context('when the database throw exceptions', () => {
            it('should throw error for ValidationError', () => {
                sinon
                    .mock(modelFake)
                    .expects('create')
                    .withArgs(user)
                    .chain('exec')
                    .rejects({ name: 'ValidationError' })

                return repo.create(user)
                    .catch(err => {
                        assert.propertyVal(err, 'message', 'Required fields were not provided!')
                    })
            })
            it('should throw error for CastError', () => {
                sinon
                    .mock(modelFake)
                    .expects('create')
                    .withArgs(user)
                    .chain('exec')
                    .rejects({ name: 'CastError' })

                return repo.create(user)
                    .catch(err => {
                        assert.propertyVal(err, 'message', 'The given ID is in invalid format.')
                        assert.propertyVal(err, 'description', 'A 12 bytes hexadecimal ID similar to this')
                    })
            })
            it('should throw error for MongoError', () => {
                sinon
                    .mock(modelFake)
                    .expects('create')
                    .withArgs(user)
                    .chain('exec')
                    .rejects({ name: 'MongoError', code: 11000 })

                return repo.create(user)
                    .catch(err => {
                        assert.propertyVal(err, 'message', 'A registration with the same unique data already exists!')
                    })
            })
            it('should throw error for ObjectParameterError', () => {
                const query = new Query()
                query.addFilter({ _id: user.id })

                sinon
                    .mock(modelFake)
                    .expects('findOne')
                    .withArgs({ _id: user.id })
                    .chain('select')
                    .chain('exec')
                    .rejects({ name: 'ObjectParameterError' })

                return repo.findOne(query)
                    .catch(err => {
                        assert.propertyVal(err, 'message', 'Invalid query parameters!')
                    })
            })
        })
    })
})
