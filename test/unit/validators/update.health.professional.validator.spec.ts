import { assert } from 'chai'
import { UpdateHealthProfessionalValidator } from '../../../src/application/domain/validator/update.health.professional.validator'
import { HealthProfessional } from '../../../src/application/domain/model/health.professional'
import { DefaultEntityMock } from '../../mocks/models/default.entity.mock'

describe('Validators: UpdateHealthProfessionalValidator', () => {
    const user: HealthProfessional = new HealthProfessional().fromJSON(DefaultEntityMock.HEALTH_PROFESSIONAL)
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
                user.email = DefaultEntityMock.HEALTH_PROFESSIONAL.email
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
                assert.equal(err.description, 'The mapped areas are: nutrition, dentistry, nursing, ' +
                    'endocrinology, other.')
            } finally {
                user.health_area = DefaultEntityMock.HEALTH_PROFESSIONAL.health_area
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
                    ` Access: PATCH /v1/auth/password to update your password.`)
            }
        })

        it('should throw an error for does pass invalid birth_date', () => {
            user.birth_date = '20-08-1987'
            try {
                UpdateHealthProfessionalValidator.validate(user)
            } catch (err) {
                assert.property(err, 'message')
                assert.property(err, 'description')
                assert.propertyVal(err, 'message', 'Date: 20-08-1987 is not in valid ISO 8601 format.')
                assert.propertyVal(err, 'description', 'Date must be in the format: yyyy-MM-dd')
            }
        })
    })
})
