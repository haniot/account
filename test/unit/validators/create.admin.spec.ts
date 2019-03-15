import { assert } from 'chai'
import { Admin } from '../../../src/application/domain/model/admin'
import { CreateAdminValidator } from '../../../src/application/domain/validator/create.admin.validator'
import { DefaultUsersMock } from '../../mocks/default.users.mock'

describe('Validators: CreateAdminValidator', () => {
    const user: Admin = new Admin().fromJSON(DefaultUsersMock.ADMIN)

    it('should return undefined when the validation was successful', () => {
        const result = CreateAdminValidator.validate(user)
        assert.equal(result, undefined)
    })

    context('when the user was incomplete or invalid', () => {
        it('should throw an error for does not pass username', () => {
            user.username = undefined

            try {
                CreateAdminValidator.validate(user)
            } catch (err) {
                assert.property(err, 'message')
                assert.property(err, 'description')
                assert.equal(err.message, 'Required fields were not provided...')
                assert.equal(err.description, 'User validation: username required!')
            } finally {
                user.username = 'admin'
            }
        })

        it('should throw an error for does not pass password', () => {
            user.password = undefined

            try {
                CreateAdminValidator.validate(user)
            } catch (err) {
                assert.property(err, 'message')
                assert.property(err, 'description')
                assert.equal(err.message, 'Required fields were not provided...')
                assert.equal(err.description, 'User validation: password required!')
            } finally {
                user.password = 'admin123'
            }
        })

        it('should throw an error for does not pass email', () => {
            user.email = undefined

            try {
                CreateAdminValidator.validate(user)
            } catch (err) {
                assert.property(err, 'message')
                assert.property(err, 'description')
                assert.equal(err.message, 'Required fields were not provided...')
                assert.equal(err.description, 'User validation: email required!')
            } finally {
                user.email = 'admin@mail.com'
            }
        })

        it('should throw an error for invalid email', () => {
            user.email = 'invalid'

            try {
                CreateAdminValidator.validate(user)
            } catch (err) {
                assert.property(err, 'message')
                assert.equal(err.message, 'Invalid email address!')
            } finally {
                user.email = 'admin@mail.com'
            }
        })

        it('should throw an error for does not pass any of required parameters', () => {
            try {
                CreateAdminValidator.validate(new Admin())
            } catch (err) {
                assert.property(err, 'message')
                assert.property(err, 'description')
                assert.equal(err.message, 'Required fields were not provided...')
                assert.equal(err.description, 'User validation: username, password required!')
            }
        })
    })
})