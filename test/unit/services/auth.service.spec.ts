import { assert } from 'chai'
import { AuthService } from '../../../src/application/service/auth.service'
import { AuthRepositoryMock } from '../../mocks/repositories/auth.repository.mock'
import { Admin } from '../../../src/application/domain/model/admin'
import { DefaultEntityMock } from '../../mocks/models/default.entity.mock'

describe('Services: AuthService', () => {
    const service = new AuthService(new AuthRepositoryMock())
    const user: Admin = new Admin().fromJSON(DefaultEntityMock.ADMIN)

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

    describe('authenticate()', () => {
        context('when authenticate a user', () => {
            it('should return a authentication token', () => {
                return service.authenticate(user.email!, user.password!)
                    .then(res => {
                        assert.propertyVal(res, 'token', 'token')
                    })

            })
        })
    })
})
