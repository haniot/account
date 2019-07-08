import { assert } from 'chai'
import { UserRepoModel } from '../../../src/infrastructure/database/schema/user.schema'
import { EntityMapperMock } from '../../mocks/models/entity.mapper.mock'
import { CustomLoggerMock } from '../../mocks/custom.logger.mock'
import { Admin } from '../../../src/application/domain/model/admin'
import { DefaultEntityMock } from '../../mocks/models/default.entity.mock'
import { AdminRepository } from '../../../src/infrastructure/repository/admin.repository'
import { UserType } from '../../../src/application/domain/utils/user.type'
import { UserRepositoryMock } from '../../mocks/repositories/user.repository.mock'
import sinon from 'sinon'

require('sinon-mongoose')

describe('Repositories: AdminRepository', () => {
    const modelFake: any = UserRepoModel
    const repo = new AdminRepository(modelFake, new EntityMapperMock(), new UserRepositoryMock(), new CustomLoggerMock())
    const user: Admin = new Admin().fromJSON(DefaultEntityMock.ADMIN)
    user.id = DefaultEntityMock.ADMIN.id

    afterEach(() => {
        sinon.restore()
    })

    describe('create()', () => {
        context('when save a new admin', () => {
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
                    })
            })
        })

        context('when the password is not passed', () => {
            it('should return something', () => {
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
                    .withArgs({ type: UserType.ADMIN })
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
})
