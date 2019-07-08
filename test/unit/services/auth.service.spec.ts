import { assert } from 'chai'
import { AuthService } from '../../../src/application/service/auth.service'
import { AuthRepositoryMock } from '../../mocks/repositories/auth.repository.mock'
import { DefaultEntityMock } from '../../mocks/models/default.entity.mock'
import { UserRepositoryMock } from '../../mocks/repositories/user.repository.mock'
import { User } from '../../../src/application/domain/model/user'

describe('Services: AuthService', () => {
    const service = new AuthService(new AuthRepositoryMock(), new UserRepositoryMock())
    const user: User = new User().fromJSON(DefaultEntityMock.USER)

    describe('authenticate()', () => {
        context('when authenticate a user', () => {
            it('should return a authentication token', () => {
                return service.authenticate(user.email!, user.password!)
                    .then(res => {
                        assert.propertyVal(res, 'access_token', 'token')
                    })

            })
        })

        context('when the authentication is not successful', () => {
            it('should not update the last login', () => {
                return service.authenticate('any@mail.com', '123')
                    .then(res => {
                        assert.isUndefined(res)
                    })
            })
        })
    })
})
