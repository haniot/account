import { assert } from 'chai'
import sinon from 'sinon'
import { UserRepository } from '../../../src/infrastructure/repository/user.repository'
import { EntityMapperMock } from '../../mocks/entity.mapper.mock'
import { CustomLoggerMock } from '../../mocks/custom.logger.mock'
import { Admin } from '../../../src/application/domain/model/admin'
import { DefaultUsersMock } from '../../mocks/default.users.mock'
import { UserRepoModel } from '../../../src/infrastructure/database/schema/user.schema'

require('sinon-mongoose')

describe('Repositories: User', () => {

    const modelFake: any = UserRepoModel
    const repo = new UserRepository(modelFake, new EntityMapperMock(), new CustomLoggerMock())
    const user: Admin = new Admin().fromJSON(DefaultUsersMock.ADMIN)

    afterEach(() => {
        sinon.restore()
    })

    describe('checkExists()', () => {
        context('when the search done by username is successful', () => {
            it('should return true', () => {
                sinon
                    .mock(modelFake)
                    .expects('findOne')
                    .withArgs({ username: user.username })
                    .chain('exec')
                    .resolves(user)

                return repo.checkExist(user.username)
                    .then(result => {
                        assert.isBoolean(result)
                        assert.isTrue(result)
                    })
            })
        })

        context('when the search done by email is successful', () => {
            it('should return true', () => {
                sinon
                    .mock(modelFake)
                    .expects('findOne')
                    .withArgs({ email: user.email })
                    .chain('exec')
                    .resolves(user)

                return repo.checkExist(undefined, user.email)
                    .then(result => {
                        assert.isBoolean(result)
                        assert.isTrue(result)
                    })
            })
        })

        context('when user is not founded by username', () => {
            it('should return false', () => {
                sinon
                    .mock(modelFake)
                    .expects('findOne')
                    .withArgs({ username: 'unknown' })
                    .chain('exec')
                    .resolves(undefined)

                return repo.checkExist('unknown')
                    .then(result => {
                        assert.isBoolean(result)
                        assert.isFalse(result)
                    })
            })
        })

        context('when user is not founded by email', () => {
            it('should return false', () => {
                sinon
                    .mock(modelFake)
                    .expects('findOne')
                    .withArgs({ email: 'unknown@mail.com' })
                    .chain('exec')
                    .resolves(undefined)

                return repo.checkExist(undefined, 'unknown@mail.com')
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
                    .expects('findOne')
                    .withArgs(undefined)
                    .chain('exec')
                    .rejects({ message: 'An internal error has occurred in the database!' })

                return repo.checkExist(undefined, undefined)
                    .catch(err => {
                        assert.equal(err.message, 'An internal error has occurred in the database!')
                        assert.equal(err.description, 'Please try again later...')
                    })
            })
        })
    })
})