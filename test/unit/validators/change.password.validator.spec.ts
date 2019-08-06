import { assert } from 'chai'
import { ChangePasswordValidator } from '../../../src/application/domain/validator/change.password.validator'

describe('Validators: ChangePasswordValidator', () => {
    it('should return undefined when the validation was successful', () => {
        const result = ChangePasswordValidator.validate('user@mail.com', 'oldpass', 'newpass')
        assert.equal(result, undefined)
    })

    context('when there are missing or invalid parameters', () => {
        it('should throw an error for does not pass email', () => {
            try {
                ChangePasswordValidator.validate('', 'oldpass', 'newpass')
            } catch (err) {
                assert.property(err, 'message')
                assert.property(err, 'description')
                assert.propertyVal(err, 'message', 'Required fields were not provided...')
                assert.propertyVal(err, 'description', 'Change password validation: email required!')
            }
        })

        it('should throw an error for does pass invalid email', () => {
            try {
                ChangePasswordValidator.validate('invalid', 'oldpass', 'newpass')
            } catch (err) {
                assert.propertyVal(err, 'message', 'Invalid email address!')
            }
        })
        it('should throw an error for does not pass old password', () => {
            try {
                ChangePasswordValidator.validate('user@mail.com', '', 'newpass')
            } catch (err) {
                assert.propertyVal(err, 'message', 'Required fields were not provided...')
                assert.propertyVal(err, 'description', 'Change password validation: old_password required!')
            }
        })

        it('should throw an error for does not pass new password', () => {
            try {
                ChangePasswordValidator.validate('user@mail.com', 'oldpass', '')
            } catch (err) {
                assert.propertyVal(err, 'message', 'Required fields were not provided...')
                assert.propertyVal(err, 'description', 'Change password validation: new_password required!')
            }
        })

        it('should throw an error for does not pass any of required parameters', () => {
            try {
                ChangePasswordValidator.validate('', '', '')
            } catch (err) {
                assert.propertyVal(err, 'message', 'Required fields were not provided...')
                assert.propertyVal(err, 'description', 'Change password validation: email, old_password, new_password required!')
            }
        })
    })
})
