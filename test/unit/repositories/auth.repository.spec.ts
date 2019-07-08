import { AuthRepository } from '../../../src/infrastructure/repository/auth.repository'
import { UserRepoModel } from '../../../src/infrastructure/database/schema/user.schema'
import { EntityMapperMock } from '../../mocks/models/entity.mapper.mock'
import { UserRepositoryMock } from '../../mocks/repositories/user.repository.mock'
import { CustomLoggerMock } from '../../mocks/custom.logger.mock'
import { Admin } from '../../../src/application/domain/model/admin'
import { DefaultEntityMock } from '../../mocks/models/default.entity.mock'
import { assert } from 'chai'
import sinon from 'sinon'

require('sinon-mongoose')

describe('Repositories: AuthRepository', () => {

    const modelFake = UserRepoModel
    const repo = new AuthRepository(modelFake, new EntityMapperMock(), new UserRepositoryMock(), new CustomLoggerMock())
    const user: Admin = new Admin().fromJSON(DefaultEntityMock.ADMIN)
    user.id = DefaultEntityMock.ADMIN.id

    afterEach(() => {
        sinon.restore()
    })

    describe('authenticate()', () => {
        context('when the authenticate is successful', () => {
            it('should return a token', () => {
                sinon
                    .mock(modelFake)
                    .expects('findOne')
                    .withArgs({ email: user.email })
                    .chain('exec')
                    .resolves(user)

                return repo.authenticate(user.email!, user.password!)
                    .then(res => {
                        assert.property(res, 'access_token')
                    })
            })
        })
    })
})
