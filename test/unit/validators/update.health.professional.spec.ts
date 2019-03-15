import { assert } from 'chai'
import { UpdateHealthProfessionalValidator } from '../../../src/application/domain/validator/update.health.professional.validator'
import { HealthProfessional } from '../../../src/application/domain/model/health.professional'
import { HealthAreaTypes } from '../../../src/application/domain/utils/health.area.types'
import { DefaultUsersMock } from '../../mocks/default.users.mock'

describe('Validators: UpdateHealthProfessionalValidator', () => {
    const user: HealthProfessional = new HealthProfessional().fromJSON(DefaultUsersMock.HEALTH_PROFESSIONAL)
    user.password = undefined

    it('should return undefined when the validation was successful', () => {
        const result = UpdateHealthProfessionalValidator.validate(user)
        assert.equal(result, undefined)
    })

    context('when does not update email', () => {
        it('should return undefined when the validation was successful', () => {
            user.email = undefined
            const result = UpdateHealthProfessionalValidator.validate(user)
            assert.equal(result, undefined)
        })
    })

    context('when does not update health_area', () => {
        it('should return undefined when the validation was successful', () => {
            user.health_area = undefined
            const result = UpdateHealthProfessionalValidator.validate(user)
            assert.equal(result, undefined)
        })
    })

    context('when the user parameters was invalid', () => {
        it('should throw an error for invalid email', () => {
            user.email = 'invalid'

            try {
                UpdateHealthProfessionalValidator.validate(user)
            } catch (err) {
                assert.property(err, 'message')
                assert.equal(err.message, 'Invalid email address!')
            } finally {
                user.email = 'health@mail.com'
            }
        })

        it('should throw an error for pass invalid health area', () => {
            user.health_area = 'ONCOLOGIST'

            try {
                UpdateHealthProfessionalValidator.validate(user)
            } catch (err) {
                assert.property(err, 'message')
                assert.property(err, 'description')
                assert.equal(err.message, 'Health Area not mapped!')
                assert.equal(err.description, 'The mapped areas are: NUTRITION, DENTISTRY.')
            } finally {
                user.health_area = HealthAreaTypes.NUTRITION
            }
        })

        it('should throw an error for try update password', () => {
            user.password = 'health123'

            try {
                UpdateHealthProfessionalValidator.validate(user)
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
