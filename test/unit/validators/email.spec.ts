import { assert } from 'chai'
import { EmailValidator } from '../../../src/application/domain/validator/email.validator'

describe('Validators: EmailValidator', () => {
    it('should return undefined when the validation was successful', () => {
        const result = EmailValidator.validate('me@mail.com')
        assert.equal(result, undefined)
    })

    context('when the email is invalid', () => {
        it('should throw an error for invalid email', () => {
            try {
                EmailValidator.validate('invalid')
            } catch (err) {
                assert.property(err, 'message')
                assert.equal(err.message, 'Invalid email address!')
            }
        })
    })
})
