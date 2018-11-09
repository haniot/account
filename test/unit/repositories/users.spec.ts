import sinon from 'sinon'
import { assert } from 'chai'
import { UserRepository } from '../../../src/infrastructure/repository/user.repository'
import { UserEntityMapperMock } from '../../mocks/user.entity.mapper.mock'
import { CustomLoggerMock } from '../../mocks/custom.logger.mock'
import { IUserRepository } from '../../../src/application/port/user.repository.interface'
import { UserRepoModel } from '../../../src/infrastructure/database/schema/user.schema'
import { User } from '../../../src/application/domain/model/user'

require('sinon-mongoose')

describe('Repositories: Users', () => {

    const defaultUser: User = new User()
    defaultUser.setId('5b13826de00324086854584a')
    defaultUser.setEmail('loremipsum@mail.com')
    defaultUser.setPassword('lorem123')
    defaultUser.setCreatedAt(new Date())

    const modelFake: any = UserRepoModel

    const queryMock: any = {
        serialize: () => {
            return {
                fields: {},
                ordination: {},
                pagination: { page: 1, limit: 100 },
                filters: {}
            }
        }
    }

    afterEach(() => {
        sinon.restore()
    })

    describe('getAll()', () => {
        it('should return a list of users', () => {
            const resultExpected: Array<User> = new Array(defaultUser)
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

            const repo: IUserRepository = new UserRepository(modelFake,
                new UserEntityMapperMock(), new CustomLoggerMock())

            return repo.find(queryMock)
                .then((users: Array<User>) => {
                    assert.isNotNull(users)
                    assert.equal(users.length, resultExpected.length)
                    assert.equal(users[0], resultExpected[0])
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

                const repo: IUserRepository = new UserRepository(modelFake,
                    new UserEntityMapperMock(), new CustomLoggerMock())

                return repo.find(queryMock)
                    .then((users: Array<User>) => {
                        assert.isNotNull(users)
                        assert.equal(users.length, 0)
                    })
            })
        })
    })

    describe('getById()', () => {

        const customQueryMock: any = {
            serialize: () => {
                return {
                    fields: {},
                    ordination: {},
                    pagination: { page: 1, limit: 100 },
                    filters: {id: defaultUser.getId()}
                }
            }
        }

        it('should return a unique user', () => {

            sinon
                .mock(modelFake)
                .expects('findOne')
                .withArgs({id: defaultUser.getId()})
                .chain('select')
                .withArgs({})
                .chain('exec')
                .resolves(defaultUser)

            const repo: IUserRepository = new UserRepository(modelFake,
                new UserEntityMapperMock(), new CustomLoggerMock())

            return repo.findOne(customQueryMock)
                .then((user: User) => {
                    assert.isNotNull(user)
                    assert.equal(user.getId(), defaultUser.getId())
                    assert.equal(user.getEmail(), defaultUser.getEmail())
                    assert.equal(user.getPassword(), defaultUser.getPassword())
                    assert.equal(user.getType(), defaultUser.getType())
                    assert.equal(user.getCreatedAt(), defaultUser.getCreatedAt())
                })
        })

        context('when the user is not found', () => {})
        context('when the user id is invalid', () => {})
    })

    describe('save', () => {
        it('should return the saved user', () => {})
        context('when there are validation errors', () => {
            it('should return info message from missing required fields', () => {})
        })
    })
})