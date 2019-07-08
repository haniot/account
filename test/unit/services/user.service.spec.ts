import { IUserService } from '../../../src/application/port/user.service.interface'
import { UserService } from '../../../src/application/service/user.service'
import { UserRepositoryMock } from '../../mocks/repositories/user.repository.mock'
import { assert } from 'chai'
import { User } from '../../../src/application/domain/model/user'
import { DefaultEntityMock } from '../../mocks/models/default.entity.mock'
import { Query } from '../../../src/infrastructure/repository/query/query'
import { PilotStudyRepositoryMock } from '../../mocks/repositories/pilot.study.repository.mock'

describe('Services: UserService', () => {
    const service: IUserService = new UserService(new UserRepositoryMock(), new PilotStudyRepositoryMock())
    const user: User = new User().fromJSON(DefaultEntityMock.USER)

    describe('remove()', () => {
        context('when delete a user', () => {
            it('should return true for common user', () => {
                return service
                    .remove(user.id!)
                    .then(result => {
                        assert.isBoolean(result)
                        assert.isTrue(result)
                    })
            })
        })

        context('when there are validation error', () => {
            it('should reject a validation error', () => {
                return service
                    .remove('123')
                    .catch(err => {
                        assert.propertyVal(err, 'message', 'Some ID provided does not have a valid format!')
                        assert.propertyVal(err, 'description', 'A 24-byte hex ID similar to this: 507f191e810c19729de860ea' +
                            ' is expected.')
                    })
            })
        })
    })

    describe('add()', () => {
        it('should throw an error for does not implemented', () => {
            try {
                return service
                    .add(user)
            } catch (err) {
                assert.property(err, 'message')
                assert.propertyVal(err, 'message', 'Not implemented!')
            }
        })
    })

    describe('getAll()', () => {
        it('should throw an error for does not implemented', () => {
            try {
                return service.getAll(new Query())
            } catch (err) {
                assert.property(err, 'message')
                assert.propertyVal(err, 'message', 'Not implemented!')
            }
        })
    })

    describe('getById()', () => {
        it('should throw an error for does not implemented', () => {
            try {
                return service.getById(user.id!, new Query())
            } catch (err) {
                assert.property(err, 'message')
                assert.propertyVal(err, 'message', 'Not implemented!')
            }
        })
    })

    describe('update()', () => {
        it('should throw an error for does not implemented', () => {
            try {
                return service.update(user)
            } catch (err) {
                assert.property(err, 'message')
                assert.propertyVal(err, 'message', 'Not implemented!')
            }
        })
    })

    describe('changePassword()', () => {
        context('when change the password', () => {
            it('should return true', () => {
                return service
                    .changePassword(user.email!, user.password!, user.password!)
                    .then(result => {
                        assert.isBoolean(result)
                        assert.isTrue(result)
                    })
            })
        })

        context('when there are validation errors', () => {
            it('should reject a validation error', () => {
                return service
                    .changePassword('invalid', user.password!, user.password!)
                    .catch(err => {
                        assert.propertyVal(err, 'message', 'Invalid email address!')
                    })
            })
        })
    })

})
