import { assert } from 'chai'
import { ChangePasswordValidator } from '../../../src/application/domain/validator/change.password.validator'

describe('Validators: ChangePasswordValidator', () => {
    it('should return undefined when the validation was successful', () => {
        const result = ChangePasswordValidator.validate('oldpass', 'newpass')
        assert.equal(result, undefined)
    })

    context('when does not pass old password or new password', () => {
        it('should throw an error for does not pass old password', () => {
            try {
                ChangePasswordValidator.validate('', 'newpass')
            } catch (err) {
                assert.property(err, 'message')
                assert.property(err, 'description')
                assert.equal(err.message, 'Required fields were not provided...')
                assert.equal(err.description, 'Change password validation: old_password required!')
            }
        })

        it('should throw an error for does not pass new password', () => {
            try {
                ChangePasswordValidator.validate('oldpass', '')
            } catch (err) {
                assert.property(err, 'message')
                assert.property(err, 'description')
                assert.equal(err.message, 'Required fields were not provided...')
                assert.equal(err.description, 'Change password validation: new_password required!')
            }
        })

        it('should throw an error for does not pass any of required parameters', () => {
            try {
                ChangePasswordValidator.validate('', '')
            } catch (err) {
                assert.property(err, 'message')
                assert.property(err, 'description')
                assert.equal(err.message, 'Required fields were not provided...')
                assert.equal(err.description, 'Change password validation: old_password, ' +
                    'new_password required!')
            }
        })
    })
})
