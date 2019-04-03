import { assert } from 'chai'
import sinon from 'sinon'
import { UserRepoModel } from '../../../src/infrastructure/database/schema/user.schema'
import { EntityMapperMock } from '../../mocks/models/entity.mapper.mock'
import { CustomLoggerMock } from '../../mocks/custom.logger.mock'
import { DefaultEntityMock } from '../../mocks/models/default.entity.mock'
import { UserRepositoryMock } from '../../mocks/repositories/user.repository.mock'
import { HealthProfessionalRepository } from '../../../src/infrastructure/repository/health.professional.repository'
import { HealthProfessional } from '../../../src/application/domain/model/health.professional'

require('sinon-mongoose')

describe('Repositories: HealthProfessionalRepository', () => {
    const modelFake: any = UserRepoModel
    const repo =
        new HealthProfessionalRepository(modelFake, new EntityMapperMock(), new UserRepositoryMock(), new CustomLoggerMock())
    const user: HealthProfessional = new HealthProfessional().fromJSON(DefaultEntityMock.HEALTH_PROFESSIONAL)

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
                    .then(result => {
                        assert.property(result, 'id')
                        assert.propertyVal(result, 'id', user.id)
                        assert.property(result, 'password')
                        assert.propertyVal(result, 'password', user.password)
                        assert.property(result, 'email')
                        assert.propertyVal(result, 'email', user.email)
                        assert.property(result, 'name')
                        assert.propertyVal(result, 'name', user.name)
                        assert.property(result, 'health_area')
                        assert.propertyVal(result, 'health_area', user.health_area)
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
                        assert.property(err, 'message')
                        assert.propertyVal(err, 'message', 'An internal error has occurred in the database!')
                        assert.property(err, 'description')
                        assert.propertyVal(err, 'description', 'Please try again later...')
                    })
            })
        })
    })
})
