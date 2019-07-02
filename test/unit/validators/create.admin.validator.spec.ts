import { assert } from 'chai'
import { Admin } from '../../../src/application/domain/model/admin'
import { CreateAdminValidator } from '../../../src/application/domain/validator/create.admin.validator'
import { DefaultEntityMock } from '../../mocks/models/default.entity.mock'

describe('Validators: CreateAdminValidator', () => {
    const user: Admin = new Admin().fromJSON(DefaultEntityMock.ADMIN)

    it('should return undefined when the validation was successful', () => {
        const result = CreateAdminValidator.validate(user)
        assert.equal(result, undefined)
    })

    context('when the user was incomplete or invalid', () => {
        it('should throw an error for does not pass email', () => {
            user.email = undefined
            try {
                CreateAdminValidator.validate(user)
            } catch (err) {
                assert.propertyVal(err, 'message', 'Required fields were not provided...')
                assert.propertyVal(err, 'description', 'User validation: email required!')
            }
        })

        it('should throw an error for invalid email', () => {
            user.email = 'invalid'

            try {
                CreateAdminValidator.validate(user)
            } catch (err) {
                assert.propertyVal(err, 'message', 'Invalid email address!')
            } finally {
                user.email = DefaultEntityMock.ADMIN.email
            }
        })

        it('should throw an error for does not pass password', () => {
            user.password = undefined

            try {
                CreateAdminValidator.validate(user)
            } catch (err) {
                assert.propertyVal(err, 'message', 'Required fields were not provided...')
                assert.propertyVal(err, 'description', 'User validation: password required!')
            } finally {
                user.password = DefaultEntityMock.ADMIN.password
            }
        })

        it('should throw an error for does not pass birth_date', () => {
            user.birth_date = undefined

            try {
                CreateAdminValidator.validate(user)
            } catch (err) {
                assert.propertyVal(err, 'message', 'Required fields were not provided...')
                assert.propertyVal(err, 'description', 'User validation: birth_date required!')
            }
        })

        it('should throw an error for invalid birth_date', () => {
            user.birth_date = 'invalid'

            try {
                CreateAdminValidator.validate(user)
            } catch (err) {
                assert.propertyVal(err, 'message', 'Date: invalid is not in valid ISO 8601 format.')
                assert.propertyVal(err, 'description', 'Date must be in the format: yyyy-MM-dd')
            } finally {
                user.birth_date = DefaultEntityMock.ADMIN.birth_date
            }
        })
        it('should throw an error for does not pass any of required parameters', () => {
            try {
                CreateAdminValidator.validate(new Admin())
            } catch (err) {
                assert.propertyVal(err, 'message', 'Required fields were not provided...')
                assert.propertyVal(err, 'description', 'User validation: email, password, birth_date required!')
            }
        })
    })
})
