import { assert } from 'chai'
import { ResetPasswordValidator } from '../../../src/application/domain/validator/reset.password.validator'

describe('Validators: ResetPasswordValidator', () => {
    it('should return undefined when the validation was successful', () => {
        const result = ResetPasswordValidator.validate('me@mail.com', 'password')
        assert.equal(result, undefined)
    })

    context('when there are invalid or missing parameters', () => {
        it('should throw an error for missing email', () => {
            try {
                ResetPasswordValidator.validate(undefined!, 'password')
            } catch (err) {
                assert.propertyVal(err, 'message', 'Required fields were not provided...')
                assert.propertyVal(err, 'description', 'Reset password validation: email required!')
            }
        })

        it('should throw an error for invalid email', () => {
            try {
                ResetPasswordValidator.validate('invalid', 'password')
            } catch (err) {
                assert.propertyVal(err, 'message', 'Invalid email address!')
            }
        })

        it('should throw an error for missing password', () => {
            try {
                ResetPasswordValidator.validate('me@mail.com', undefined!)
            } catch (err) {
                assert.propertyVal(err, 'message', 'Required fields were not provided...')
                assert.propertyVal(err, 'description', 'Reset password validation: new_password required!')
            }
        })

    })
})
