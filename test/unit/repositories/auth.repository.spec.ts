import sinon from 'sinon'
import { assert } from 'chai'
import { UserRepoModel } from '../../../src/infrastructure/database/schema/user.schema'
import { AuthRepository } from '../../../src/infrastructure/repository/auth.repository'
import { EntityMapperMock } from '../../mocks/entity.mapper.mock'
import { UserRepositoryMock } from '../../mocks/user.repository.mock'
import { CustomLoggerMock } from '../../mocks/custom.logger.mock'
import { Admin } from '../../../src/application/domain/model/admin'
import { DefaultEntityMock } from '../../mocks/default.entity.mock'

require('sinon-mongoose')

describe('Repositories: AuthRepository', () => {
    const modelFake: any = UserRepoModel
    const repo = new AuthRepository(modelFake, new EntityMapperMock(), new UserRepositoryMock(), new CustomLoggerMock())
    const user: Admin = new Admin().fromJSON(DefaultEntityMock.ADMIN)

    afterEach(() => {
        sinon.restore()
    })

    describe('authenticate()', () => {
        context('when the authentication was successful', () => {
            it('should return the auth token', () => {
                sinon
                    .mock(modelFake)
                    .expects('findOne')
                    .withArgs({ email: user.email })
                    .chain('exec')
                    .resolves(user)

                return repo.authenticate(user.email!, user.password!)
                    .then(result => {
                        assert.property(result, 'token')
                    })
            })
        })

        context('when the user is not found', () => {
            it('should return error for invalid credentials', () => {
                sinon
                    .mock(modelFake)
                    .expects('findOne')
                    .withArgs({ email: 'unknown@mail.com' })
                    .chain('exec')
                    .resolves(undefined)

                return repo.authenticate('unknown@mail.com', 'unknown')
                    .catch(err => {
                        assert.property(err, 'message')
                        assert.propertyVal(
                            err, 'message', 'Authentication failed due to invalid authentication credentials.')
                    })
            })
        })

        context('when the user does not have password', () => {
            it('should return error for invalid credentials', () => {
                const userWithoutPass: Admin = new Admin().fromJSON(
                    {
                        username: 'withoutpass',
                        email: 'withoutpass@mail.com'
                    })
                sinon
                    .mock(modelFake)
                    .expects('findOne')
                    .withArgs({ email: 'unknown@mail.com' })
                    .chain('exec')
                    .resolves(userWithoutPass)

                return repo.authenticate('unknown@mail.com', 'unknown')
                    .catch(err => {
                        assert.property(err, 'message')
                        assert.propertyVal(
                            err, 'message', 'Authentication failed due to invalid authentication credentials.')
                    })
            })
        })

        context('when the user needs to change password before auth', () => {
            it('should return error for change password necessary', () => {
                user.change_password = true
                sinon
                    .mock(modelFake)
                    .expects('findOne')
                    .withArgs({ email: user.email })
                    .chain('exec')
                    .resolves(user)

                return repo.authenticate(user.email!, user.password!)
                    .catch(err => {
                        assert.property(err, 'message')
                        assert.propertyVal(err, 'message', 'Change password is necessary.')
                        assert.property(err, 'description')
                        assert.propertyVal(err, 'description', `To ensure information security, the user must change ` +
                            `the access password. To change it, access PATCH /users/${user.id}/password.`)
                        assert.property(err, 'link')
                        assert.propertyVal(err, 'link', `/users/${user.id}/password`)
                    })
            })
        })

        context('when the password does not match', () => {
            it('should return undefined', () => {
                user.change_password = false
                sinon
                    .mock(modelFake)
                    .expects('findOne')
                    .withArgs({ email: user.email })
                    .chain('exec')
                    .resolves(user)

                return repo.authenticate(user.email!, 'anotherpassword')
                    .then(result => {
                        assert.equal(result, undefined)
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

                return repo.authenticate(undefined!, undefined!)
                    .catch(err => {
                        assert.property(err, 'name')
                        assert.propertyVal(err, 'name', 'ExpectationError')
                        assert.property(err, 'message')
                    })
            })
        })
    })
})
