import { assert } from 'chai'
import { AuthService } from '../../../src/application/service/auth.service'
import { AuthRepositoryMock } from '../../mocks/repositories/auth.repository.mock'
import { Admin } from '../../../src/application/domain/model/admin'
import { DefaultEntityMock } from '../../mocks/models/default.entity.mock'

describe('Services: AuthService', () => {
    const service = new AuthService(new AuthRepositoryMock())
    const user: Admin = new Admin().fromJSON(DefaultEntityMock.ADMIN)

    describe('authenticate()', () => {
        context('when want authenticate user', () => {
            it('should return the authenticate token', () => {
                return service.authenticate(user.email!, user.password!)
                    .then(result => {
                        assert.property(result, 'token')
                        assert.propertyVal(result, 'token', 'token')
                    })
            })
        })
    })
})
