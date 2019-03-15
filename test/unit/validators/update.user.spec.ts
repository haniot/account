import { assert } from 'chai'
import { User } from '../../../src/application/domain/model/user'
import { UpdateUserValidator } from '../../../src/application/domain/validator/update.user.validator'
import { DefaultUsersMock } from '../../mocks/default.users.mock'

describe('Validators: UpdateUserValidator', () => {
    const user: User = new User().fromJSON(DefaultUsersMock.USER)
    user.password = undefined

    it('should return undefined when the validation was successful', () => {
        const result = UpdateUserValidator.validate(user)
        assert.equal(result, undefined)
    })

    context('when the user parameters was invalid', () => {
        it('should throw an error for try update password', () => {
            user.password = 'user'

            try {
                UpdateUserValidator.validate(user)
            } catch (err) {
                assert.property(err, 'message')
                assert.property(err, 'description')
                assert.equal(err.message, 'This parameter could not be updated.')
                assert.equal(err.description, 'A specific route to update user password already exists.' +
                    ` Access: PATCH /users/${user.id}/password to update your password.`)
            }
        })
    })
})
