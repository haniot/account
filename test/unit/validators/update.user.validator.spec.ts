import { assert } from 'chai'
import { User } from '../../../src/application/domain/model/user'
import { UpdateUserValidator } from '../../../src/application/domain/validator/update.user.validator'
import { DefaultEntityMock } from '../../mocks/models/default.entity.mock'

describe('Validators: UpdateUserValidator', () => {
    const user: User = new User().fromJSON(DefaultEntityMock.USER)
    user.password = undefined
    user.birth_date = undefined
    user.selected_pilot_study = undefined

    it('should return undefined when the validation was successful', () => {
        const result = UpdateUserValidator.validate(user)
        assert.equal(result, undefined)
    })

    context('when the user does not have id', () => {
        it('should return undefined when the validation was successful', () => {
            user.id = undefined
            const result = UpdateUserValidator.validate(user)
            assert.equal(result, undefined)
        })
    })

    context('when the user parameters was invalid', () => {
        it('should throw an error for pass invalid id', () => {
            user.id = '1a2b3c'
            try {
                UpdateUserValidator.validate(user)
            } catch (err) {
                assert.propertyVal(err, 'message', 'Some ID provided does not have a valid format!')
                assert.propertyVal(err, 'description', 'A 24-byte hex ID similar to this: 507f191e810c19729de860ea is expected.')
            } finally {
                user.id = DefaultEntityMock.USER.id
            }
        })
        it('should throw an error for pass invalid email', () => {
            user.email = 'invalid'
            try {
                UpdateUserValidator.validate(user)
            } catch (err) {
                assert.propertyVal(err, 'message', 'Invalid email address!')
            } finally {
                user.email = DefaultEntityMock.USER.email
            }
        })
        it('should throw an error for pass invalid birth_date', () => {
            user.birth_date = 'invalid'
            try {
                UpdateUserValidator.validate(user)
            } catch (err) {
                assert.propertyVal(err, 'message', 'Date: invalid is not in valid ISO 8601 format.')
                assert.propertyVal(err, 'description', 'Date must be in the format: yyyy-MM-dd')
            } finally {
                user.birth_date = DefaultEntityMock.USER.birth_date
            }
        })
        it('should throw an error for pass invalid selected_pilot_study', () => {
            user.selected_pilot_study = '1a2b3c'
            try {
                UpdateUserValidator.validate(user)
            } catch (err) {
                assert.propertyVal(err, 'message', 'Some ID provided does not have a valid format!')
                assert.propertyVal(err, 'description', 'A 24-byte hex ID similar to this: 507f191e810c19729de860ea is expected.')
            } finally {
                user.selected_pilot_study = DefaultEntityMock.USER.selected_pilot_study
            }
        })
        it('should throw an error for try update password', () => {
            user.password = 'user'
            try {
                UpdateUserValidator.validate(user)
            } catch (err) {
                assert.propertyVal(err, 'message', 'This parameter could not be updated.')
                assert.propertyVal(err, 'description', 'A specific route to update user password already exists.' +
                    ` Access: PATCH /v1/auth/password to update your password.`)
            }
        })
    })
})
