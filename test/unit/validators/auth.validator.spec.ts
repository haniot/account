import { AuthValidator } from '../../../src/application/domain/validator/auth.validator'
import { assert } from 'chai'

describe('Validators: AuthValidator', () => {
    it('should return undefined when the validation was successful', () => {
        const result = AuthValidator.validate('user@mail.com', 'password')
        assert.equal(result, undefined)
    })

    context('when there are missing or invalid parameters', () => {
        it('should throw an error for does not pass email', () => {
            try {
                AuthValidator.validate('', 'password')
            } catch (err) {
                assert.propertyVal(err, 'message', 'Required fields were not provided...')
                assert.propertyVal(err, 'description', 'Authentication validation: email is required!')
            }
        })

        it('should throw an error for does pass invalid email', () => {
            try {
                AuthValidator.validate('invalid', 'password')
            } catch (err) {
                assert.propertyVal(err, 'message', 'Invalid email address!')
            }
        })

        it('should throw an error for does not pass password', () => {
            try {
                AuthValidator.validate('user@mail.com', '')
            } catch (err) {
                assert.propertyVal(err, 'message', 'Required fields were not provided...')
                assert.propertyVal(err, 'description', 'Authentication validation: password is required!')
            }
        })

        it('should throw an error for does not pass any of required parameters', () => {
            try {
                AuthValidator.validate('', '')
            } catch (err) {
                assert.propertyVal(err, 'message', 'Required fields were not provided...')
                assert.propertyVal(err, 'description', 'Authentication validation: email, password is required!')
            }
        })
    })
})
