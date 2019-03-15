import { assert } from 'chai'
import { Admin } from '../../../src/application/domain/model/admin'
import { UpdateAdminValidator } from '../../../src/application/domain/validator/update.admin.validator'
import { DefaultUsersMock } from '../../mocks/default.users.mock'

describe('Validators: UpdateAdminValidator', () => {
    const user: Admin = new Admin().fromJSON(DefaultUsersMock.ADMIN)
    user.password = undefined

    it('should return undefined when the validation was successful', () => {
        const result = UpdateAdminValidator.validate(user)
        assert.equal(result, undefined)
    })

    context('when does not update email', () => {
        it('should return undefined when the validation was successful', () => {
            user.email = undefined
            const result = UpdateAdminValidator.validate(user)
            assert.equal(result, undefined)
        })
    })

    context('when the user parameters was invalid', () => {
        it('should throw an error for invalid email', () => {
            user.email = 'invalid'

            try {
                UpdateAdminValidator.validate(user)
            } catch (err) {
                assert.property(err, 'message')
                assert.equal(err.message, 'Invalid email address!')
            } finally {
                user.email = 'admin@mail.com'
            }
        })

        it('should throw an error for try update password', () => {
            user.password = 'admin123'

            try {
                UpdateAdminValidator.validate(user)
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
