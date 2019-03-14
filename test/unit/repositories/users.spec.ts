import sinon from 'sinon'
import {assert} from 'chai'
import {UserRepository} from '../../../src/infrastructure/repository/user.repository'
import {UserEntityMapperMock} from '../../mocks/user.entity.mapper.mock'
import {CustomLoggerMock} from '../../mocks/custom.logger.mock'
import {IUserRepository} from '../../../src/application/port/user.repository.interface'
import {UserRepoModel} from '../../../src/infrastructure/database/schema/user.schema'
import {User} from '../../../src/application/domain/model/user'
import {ObjectID} from 'bson'
// import { ILogger } from '../../../src/utils/custom.logger'
// import { DI } from '../../../src/di/di'
// import { Identifier } from '../../../src/di/identifiers'

require('sinon-mongoose')

describe('Repositories: Users', () => {

    const defaultUser: User = new User()
    defaultUser.setId('5b13826de00324086854584a')
    defaultUser.setName('Lorem Ipsum')
    defaultUser.setEmail('loremipsum@mail.com')
    defaultUser.setPassword('lorem123')
    defaultUser.setCreatedAt(new Date('2018-11-21 21:25:05'))
    defaultUser.setChangePassword(true)

    const modelFake: any = UserRepoModel

    const queryMock: any = {
        serialize: () => {
            return {
                fields: {},
                ordination: {},
                pagination: {page: 1, limit: 100},
                filters: {}
            }
        }
    }

    // const logger: ILogger = DI.getInstance().getContainer().get<ILogger>(Identifier.LOGGER)

    const repo: IUserRepository = new UserRepository(modelFake,
        new UserEntityMapperMock(), new CustomLoggerMock())

    afterEach(() => {
        sinon.restore()
    })

    describe('getAll()', () => {
        it('should return a list of users', () => {

            const resultExpected: any = new Array(defaultUser)

            sinon
                .mock(modelFake)
                .expects('find')
                .chain('select')
                .withArgs({})
                .chain('sort')
                .withArgs()
                .chain('skip')
                .withArgs(0)
                .chain('limit')
                .withArgs(100)
                .chain('exec')
                .resolves(resultExpected)

            return repo.find(queryMock)
                .then((users: Array<User>) => {
                    assert.isNotNull(users)
                    assert.equal(users.length, resultExpected.length)
                    assert.property(users[0], 'name')
                    assert.propertyVal(users[0], 'name', defaultUser.getName())
                    assert.property(users[0], 'email')
                    assert.propertyVal(users[0], 'email', defaultUser.getEmail())
                    assert.property(users[0], 'password')
                    assert.propertyVal(users[0], 'password', defaultUser.getPassword())
                    assert.property(users[0], 'type')
                    assert.propertyVal(users[0], 'type', defaultUser.getType())
                    assert.property(users[0], 'created_at')

                })
        })

        context('when there are no users in database', () => {
            it('should return info message from users not found', () => {

                sinon
                    .mock(modelFake)
                    .expects('find')
                    .chain('select')
                    .withArgs({})
                    .chain('sort')
                    .withArgs()
                    .chain('skip')
                    .withArgs(0)
                    .chain('limit')
                    .withArgs(100)
                    .chain('exec')
                    .resolves([])

                return repo.find(queryMock)
                    .then((users: Array<User>) => {
                        assert.isNotNull(users)
                        assert.equal(users.length, 0)
                    })
            })
        })
    })

    describe('getById()', () => {
        it('should return a unique user', () => {

            const customQueryMock: any = {
                serialize: () => {
                    return {
                        fields: {},
                        ordination: {},
                        pagination: {page: 1, limit: 100},
                        filters: {id: defaultUser.getId()}
                    }
                }
            }

            sinon
                .mock(modelFake)
                .expects('findOne')
                .withArgs({id: defaultUser.getId()})
                .chain('select')
                .withArgs({})
                .chain('exec')
                .resolves(defaultUser)

            return repo.findOne(customQueryMock)
                .then((user: User) => {
                    assert.isNotNull(user)
                    assert.property(user, 'name')
                    assert.propertyVal(user, 'name', defaultUser.getName())
                    assert.property(user, 'email')
                    assert.propertyVal(user, 'email', defaultUser.getEmail())
                    assert.property(user, 'password')
                    assert.propertyVal(user, 'password', defaultUser.getPassword())
                    assert.property(user, 'type')
                    assert.propertyVal(user, 'type', defaultUser.getType())
                    assert.property(user, 'created_at')
                })
        })

        context('when the user is not found', () => {
            it('should return info message from user not found', () => {

                const randomId: any = new ObjectID()

                const customQueryMock: any = {
                    serialize: () => {
                        return {
                            fields: {},
                            ordination: {},
                            pagination: {page: 1, limit: 100},
                            filters: {id: randomId}
                        }
                    }
                }

                sinon
                    .mock(modelFake)
                    .expects('findOne')
                    .withArgs({id: randomId})
                    .chain('select')
                    .withArgs({})
                    .chain('exec')
                    .resolves(undefined)

                return repo.findOne(customQueryMock)
                    .then((result: any) => {
                        assert.isNotNull(result)
                        assert.isUndefined(result)
                        assert.isNotObject(result)
                    })
            })
        })

        context('when the user id is invalid', () => {
            it('should return info message about invalid parameter', () => {

                const invalidId: string = '1a2b3c'

                const customQueryMock: any = {
                    serialize: () => {
                        return {
                            fields: {},
                            ordination: {},
                            pagination: {page: 1, limit: 100},
                            filters: {id: invalidId}
                        }
                    }
                }

                sinon
                    .mock(modelFake)
                    .expects('findOne')
                    .withArgs({id: invalidId})
                    .chain('select')
                    .withArgs({})
                    .chain('exec')
                    .rejects({name: 'CastError'})

                return repo.findOne(customQueryMock)
                    .catch((err: any) => {
                        assert.isNotNull(err)
                        assert.equal(err.message, 'The given ID is not in valid format.')
                    })

            })
        })
    })

    describe('save()', () => {
        it('should return the saved user', () => {

            sinon
                .mock(modelFake)
                .expects('create')
                .withArgs(defaultUser)
                .resolves(defaultUser)

            return repo.create(defaultUser)
                .then((user: User) => {
                    assert.isNotNull(user)
                    assert.property(user, 'name')
                    assert.propertyVal(user, 'name', defaultUser.getName())
                    assert.property(user, 'email')
                    assert.propertyVal(user, 'email', defaultUser.getEmail())
                    assert.property(user, 'password')
                    assert.propertyVal(user, 'password', defaultUser.getPassword())
                    assert.property(user, 'type')
                    assert.propertyVal(user, 'type', defaultUser.getType())
                    assert.property(user, 'created_at')
                })
        })

        context('when there are validation errors', () => {
            it('should return info message from missing required fields', () => {

                const incompleteUser: User = new User()
                incompleteUser.setEmail('incomplete@mail.com')
                incompleteUser.setPassword('anything')

                sinon
                    .mock(modelFake)
                    .expects('create')
                    .withArgs(incompleteUser)
                    .rejects({name: 'ValidationError'})

                return repo.create(incompleteUser)
                    .catch((err: any) => {
                        assert.isNotNull(err)
                        assert.equal(err.message, 'Required fields were not provided!')
                    })
            })
        })

        context('when data already exists', () => {
            it('should return info message from duplicated data', () => {

                sinon
                    .mock(modelFake)
                    .expects('create')
                    .withArgs(defaultUser)
                    .rejects({name: 'MongoError', code: 11000})

                return repo.create(defaultUser)
                    .catch((err: any) => {
                        assert.isNotNull(err)
                        assert.equal(err.message, 'A registration with the same unique data already exists!')
                    })
            })
        })
    })

    describe('update()', () => {
        it('should return the updated user', () => {

            sinon
                .mock(modelFake)
                .expects('findOneAndUpdate')
                .withArgs({_id: defaultUser.getId()}, defaultUser, {new: true})
                .chain('exec')
                .resolves(defaultUser)

            return repo.update(defaultUser)
                .then((user: User) => {
                    assert.isNotNull(user)
                    assert.property(user, 'name')
                    assert.propertyVal(user, 'name', defaultUser.getName())
                    assert.property(user, 'email')
                    assert.propertyVal(user, 'email', defaultUser.getEmail())
                    assert.property(user, 'password')
                    assert.propertyVal(user, 'password', defaultUser.getPassword())
                    assert.property(user, 'type')
                    assert.propertyVal(user, 'type', defaultUser.getType())
                    assert.property(user, 'created_at')
                })
        })

        context('when data already exists', () => {
            it('should return info message from duplicated data', () => {
                sinon
                    .mock(modelFake)
                    .expects('findOneAndUpdate')
                    .withArgs({_id: defaultUser.getId()}, defaultUser, {new: true})
                    .chain('exec')
                    .rejects({name: 'MongoError', code: 11000})

                return repo.update(defaultUser)
                    .catch((err: any) => {
                        assert.isNotNull(err)
                        assert.equal(err.message, 'A registration with the same unique data already exists!')
                    })
            })
        })

        context('when the user is not found', () => {
            it('should return info message from user not found', () => {

                sinon
                    .mock(modelFake)
                    .expects('findOneAndUpdate')
                    .withArgs({_id: defaultUser.getId()}, defaultUser, {new: true})
                    .chain('exec')
                    .resolves(undefined)

                return repo.update(defaultUser)
                    .then((result: any) => {
                        assert.isNotNull(result)
                        assert.isUndefined(result)
                        assert.isNotObject(result)
                    })
            })
        })

        context('when the user id is invalid', () => {
            it('should return info message about invalid parameter', () => {

                const invalidUser: User = new User()
                invalidUser.setId('1a2b3c')
                invalidUser.setEmail('invaliduserid@mail.com')
                invalidUser.setPassword('invalid123')
                invalidUser.setCreatedAt(new Date())

                sinon
                    .mock(modelFake)
                    .expects('findOneAndUpdate')
                    .withArgs({_id: invalidUser.getId()}, invalidUser, {new: true})
                    .chain('exec')
                    .rejects({name: 'CastError'})

                return repo.update(invalidUser)
                    .catch((err: any) => {
                        assert.isNotNull(err)
                        assert.equal(err.message, 'The given ID is not in valid format.')
                    })
            })

        })
    })

    describe('delete()', () => {
        it('should return true for confirm delete', () => {

            const userId: string = '5b13826de00324086854584a' // The defaultUser id, but only the string

            sinon
                .mock(modelFake)
                .expects('findOneAndDelete')
                .withArgs({_id: userId})
                .chain('exec')
                .resolves(true)

            return repo.delete(userId)
                .then((isDeleted: Boolean) => {
                    assert.isBoolean(isDeleted)
                    assert.isTrue(isDeleted)
                })
        })

        context('when the user is not found', () => {
            it('should return false for confirm that user is not founded', () => {

                const randomId: any = new ObjectID()

                sinon
                    .mock(modelFake)
                    .expects('findOneAndDelete')
                    .withArgs({_id: randomId})
                    .chain('exec')
                    .resolves(false)

                return repo.delete(randomId)
                    .then((isDeleted: Boolean) => {
                        assert.isBoolean(isDeleted)
                        assert.isFalse(isDeleted)
                    })
            })
        })

        context('when the user id is invalid', () => {
            it('should return info message about invalid parameter', () => {

                const invalidId: string = '1a2b3c'

                sinon
                    .mock(modelFake)
                    .expects('findOneAndDelete')
                    .withArgs({_id: invalidId})
                    .chain('exec')
                    .rejects({name: 'CastError'})

                return repo.delete(invalidId)
                    .catch((err: any) => {
                        assert.isNotNull(err)
                        assert.equal(err.message, 'The given ID is not in valid format.')
                    })
            })
        })
    })

    describe('count()', () => {
        it('should return how many users there are in the database for a query', () => {

            const customQueryMock: any = {
                serialize: () => {
                    return {
                        fields: {},
                        ordination: {},
                        pagination: {page: 1, limit: 100},
                        filters: {type: 1}
                    }
                }
            }

            sinon
                .mock(modelFake)
                .expects('estimatedDocumentCount')
                .withArgs(customQueryMock.serialize().filters)
                .chain('exec')
                .resolves(1)

            return repo.count(customQueryMock)
                .then((countUsers: number) => {
                    assert.isNumber(countUsers)
                    assert.equal(countUsers, 1)
                })
        })

        context('when there no are users in database for a query', () => {
            it('should return 0', () => {

                const customQueryMock: any = {
                    serialize: () => {
                        return {
                            fields: {},
                            ordination: {},
                            pagination: {page: 1, limit: 100},
                            filters: {type: 3}
                        }
                    }
                }

                sinon
                    .mock(modelFake)
                    .expects('estimatedDocumentCount')
                    .withArgs(customQueryMock.serialize().filters)
                    .chain('exec')
                    .resolves(0)


                return repo.count(customQueryMock)
                    .then((countUsers: number) => {
                        assert.isNumber(countUsers)
                        assert.equal(countUsers, 0)
                    })
            })
        })
    })

    describe('findByEmail()', () => {
        it('should return a unique user', () => {

            const email: string = 'loremipsum@mail.com'
            const customQueryMock: any = {
                serialize: () => {
                    return {
                        fields: {},
                        ordination: {},
                        pagination: {page: 1, limit: 100},
                        filters: {email: email}
                    }
                }
            }

            sinon
                .mock(modelFake)
                .expects('findOne')
                .withArgs({email: email})
                .chain('select')
                .withArgs({})
                .chain('exec')
                .resolves(defaultUser)

            return repo.getByEmail(email, customQueryMock)
                .then((user: User) => {
                    assert.isNotNull(user)
                    assert.property(user, 'name')
                    assert.propertyVal(user, 'name', defaultUser.getName())
                    assert.property(user, 'email')
                    assert.propertyVal(user, 'email', defaultUser.getEmail())
                    assert.property(user, 'password')
                    assert.propertyVal(user, 'password', defaultUser.getPassword())
                    assert.property(user, 'type')
                    assert.propertyVal(user, 'type', defaultUser.getType())
                    assert.property(user, 'created_at')
                })
        })

        context('when the user is not found', () => {
            it('should return info message from user not found', () => {

                const email: string = 'loremipsum@mail.com'
                const customQueryMock: any = {
                    serialize: () => {
                        return {
                            fields: {},
                            ordination: {},
                            pagination: {page: 1, limit: 100},
                            filters: {email: email}
                        }
                    }
                }

                sinon
                    .mock(modelFake)
                    .expects('findOne')
                    .withArgs({email: email})
                    .chain('select')
                    .withArgs({})
                    .chain('exec')
                    .resolves(undefined)

                return repo.getByEmail(email, customQueryMock)
                    .then((result: any) => {
                        assert.isNotNull(result)
                        assert.isUndefined(result)
                        assert.isNotObject(result)
                    })
            })
        })
        context('when the user email is invalid', () => {
            it('should return info message about invalid parameters', () => {

                const invalidEmail: string = 'inv#lid$mail'
                const customQueryMock: any = {
                    serialize: () => {
                        return {
                            fields: {},
                            ordination: {},
                            pagination: {page: 1, limit: 100},
                            filters: {email: invalidEmail}
                        }
                    }
                }

                sinon
                    .mock(modelFake)
                    .expects('findOne')
                    .withArgs({email: invalidEmail})
                    .chain('select')
                    .withArgs({})
                    .chain('exec')
                    .rejects({name: 'ObjectParameterError'})

                return repo.findOne(customQueryMock)
                    .catch((err: any) => {
                        assert.isNotNull(err)
                        assert.equal(err.message, 'Invalid query parameters!')
                    })

            })
        })
    })

    describe('checkIfExists()', () => {
        it('should return true if user exists', () => {

            sinon
                .mock(modelFake)
                .expects('findOne')
                .withArgs({email: defaultUser.getEmail()})
                .chain('select')
                .withArgs({})
                .chain('exec')
                .resolves(defaultUser)


            return repo.checkExistByUsername(defaultUser)
                .then((exists: Boolean) => {
                    assert.isBoolean(exists)
                    assert.isTrue(exists)
                })
        })

        context('when user is not found', () => {
            it('should return info message from user not found', () => {

                sinon
                    .mock(modelFake)
                    .expects('findOne')
                    .withArgs({email: defaultUser.getEmail()})
                    .chain('select')
                    .withArgs({})
                    .chain('exec')
                    .resolves(undefined)

                return repo.checkExistByUsername(defaultUser)
                    .then((exists: Boolean) => {
                        assert.isBoolean(exists)
                        assert.isFalse(exists)
                    })
            })
        })

        context('when the user email is invalid', () => {
            it('should return info message about invalid parameter', () => {

                const invalidEmail: string = 'inv#lid$mail'
                const userWithInvalidMail: User = new User()
                userWithInvalidMail.setEmail('inv#lid$mail')

                sinon
                    .mock(modelFake)
                    .expects('findOne')
                    .withArgs({email: invalidEmail})
                    .chain('select')
                    .withArgs({})
                    .chain('exec')
                    .rejects({name: 'ObjectParameterError'})

                return repo.checkExistByUsername(userWithInvalidMail)
                    .catch((err: any) => {
                        assert.isNotNull(err)
                        assert.equal(err.message, 'An internal error has occurred in the database!')
                    })
            })
        })
    })
})
