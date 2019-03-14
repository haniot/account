import { assert } from 'chai'
import { Admin } from '../../../src/application/domain/model/admin'
import { User } from '../../../src/application/domain/model/user'
import { CreateUserValidator } from '../../../src/application/domain/validator/create.user.validator'

describe('Validators: CreateUserValidator', () => {
    const user: User = new User()
    user.username = 'user'
    user.password = 'user123'

    it('should return undefined when the validation was successful', () => {

        const result = CreateUserValidator.validate(user)
        assert.equal(result, undefined)
    })

    context('when the user was incomplete or invalid', () => {
        it('should throw an error for does not pass username', () => {
            user.username = undefined

            try {
                CreateUserValidator.validate(user)
            } catch (err) {
                assert.property(err, 'message')
                assert.property(err, 'description')
                assert.equal(err.message, 'Required fields were not provided...')
                assert.equal(err.description, 'User validation: username required!')
            } finally {
                user.username = 'user'
            }
        })

        it('should throw an error for does not pass password', () => {
            user.password = undefined

            try {
                CreateUserValidator.validate(user)
            } catch (err) {
                assert.property(err, 'message')
                assert.property(err, 'description')
                assert.equal(err.message, 'Required fields were not provided...')
                assert.equal(err.description, 'User validation: password required!')
            } finally {
                user.password = 'user123'
            }
        })

        it('should throw an error for does not pass any of required parameters', () => {
            try {
                CreateUserValidator.validate(new Admin())
            } catch (err) {
                assert.property(err, 'message')
                assert.property(err, 'description')
                assert.equal(err.message, 'Required fields were not provided...')
                assert.equal(err.description, 'User validation: username, password required!')
            }
        })
    })
})
