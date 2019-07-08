import { assert } from 'chai'
import sinon from 'sinon'
import { UserRepository } from '../../../src/infrastructure/repository/user.repository'
import { EntityMapperMock } from '../../mocks/models/entity.mapper.mock'
import { CustomLoggerMock } from '../../mocks/custom.logger.mock'
import { Admin } from '../../../src/application/domain/model/admin'
import { DefaultEntityMock } from '../../mocks/models/default.entity.mock'
import { UserRepoModel } from '../../../src/infrastructure/database/schema/user.schema'
import { UserType } from '../../../src/application/domain/utils/user.type'

require('sinon-mongoose')

describe('Repositories: User', () => {

    const modelFake: any = UserRepoModel
    const repo = new UserRepository(modelFake, new EntityMapperMock(), new CustomLoggerMock())
    const user: Admin = new Admin().fromJSON(DefaultEntityMock.ADMIN)

    afterEach(() => {
        sinon.restore()
    })

    describe('checkExists()', () => {
        context('when the search done by email is successful', () => {
            it('should return true', () => {
                sinon
                    .mock(modelFake)
                    .expects('findOne')
                    .withArgs({ email: user.email })
                    .chain('exec')
                    .resolves(user)

                return repo.checkExist(user.email)
                    .then(result => {
                        assert.isBoolean(result)
                        assert.isTrue(result)
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

                return repo.checkExist('unknown@mail.com')
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

                return repo.checkExist(undefined)
                    .catch(err => {
                        assert.equal(err.message, 'An internal error has occurred in the database!')
                        assert.equal(err.description, 'Please try again later...')
                    })
            })
        })
    })

    describe('updateLastLogin()', () => {
        context('when update a last login from user', () => {
            it('should return true', () => {
                sinon
                    .mock(modelFake)
                    .expects('findOneAndUpdate')
                    .withArgs({ email: user.email }, { last_login: new Date().toISOString() })
                    .resolves(user)

                return repo.updateLastLogin(user.email!)
                    .then(res => {
                        assert.isTrue(res)
                    })
            })
        })

        context('when there are a database error', () => {
            it('should reject a error', () => {
                sinon
                    .mock(modelFake)
                    .expects('findOneAndUpdate')
                    .withArgs({ email: user.email }, { last_login: new Date().toISOString() })
                    .rejects({ message: 'An internal error has occurred in the database!' })

                return repo.updateLastLogin(user.email!)
                    .catch(err => {
                        assert.propertyVal(err, 'message', 'An internal error has occurred in the database!')
                    })

            })
        })
    })

    describe('countAdmins()', () => {
        context('when count all admins in platform', () => {
            it('should return a number', () => {
                sinon
                    .mock(modelFake)
                    .expects('countDocuments')
                    .withArgs({ type: UserType.ADMIN })
                    .chain('exec')
                    .resolves(1)

                return repo.countAdmins()
                    .then(res => {
                        assert.isNumber(res)
                        assert.equal(res, 1)
                    })
            })
        })
    })

    describe('countHealthProfessionals()', () => {
        context('when count all health professionals in platform', () => {
            it('should return a number', () => {
                sinon
                    .mock(modelFake)
                    .expects('countDocuments')
                    .withArgs({ type: UserType.HEALTH_PROFESSIONAL })
                    .chain('exec')
                    .resolves(1)

                return repo.countHealthProfessionals()
                    .then(res => {
                        assert.isNumber(res)
                        assert.equal(res, 1)
                    })
            })
        })
    })

    describe('countPatients()', () => {
        context('when count all patients in platform', () => {
            it('should return a number', () => {
                sinon
                    .mock(modelFake)
                    .expects('countDocuments')
                    .withArgs({ type: UserType.PATIENT })
                    .chain('exec')
                    .resolves(1)

                return repo.countPatients()
                    .then(res => {
                        assert.isNumber(res)
                        assert.equal(res, 1)
                    })
            })
        })
    })

    describe('changePassword()', () => {
        context('when a database error occurs', () => {
            it('should reject an error', () => {
                sinon
                    .mock(modelFake)
                    .expects('findOne')
                    .withArgs({ email: user.email })
                    .chain('exec')
                    .rejects({ message: 'An internal error has occurred in the database!' })

                return repo.changePassword(user.email!, user.password!, user.password!)
                    .catch(err => {
                        assert.propertyVal(err, 'message', 'An internal error has occurred in the database!')
                    })
            })
        })
    })
})
