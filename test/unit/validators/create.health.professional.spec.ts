import { assert } from 'chai'
import { HealthProfessional } from '../../../src/application/domain/model/health.professional'
import { CreateHealthProfessionalValidator } from '../../../src/application/domain/validator/create.health.professional.validator'
import { HealthAreaTypes } from '../../../src/application/domain/utils/health.area.types'
import { DefaultEntityMock } from '../../mocks/default.entity.mock'

describe('Validators: CreateHealthProfessionalValidator', () => {
    const user: HealthProfessional = new HealthProfessional().fromJSON(DefaultEntityMock.HEALTH_PROFESSIONAL)

    it('should return undefined when the validation was successful', () => {
        const result = CreateHealthProfessionalValidator.validate(user)
        assert.equal(result, undefined)
    })

    context('when the user was incomplete or invalid', () => {
        it('should throw an error for does not pass username', () => {
            user.username = undefined

            try {
                CreateHealthProfessionalValidator.validate(user)
            } catch (err) {
                assert.property(err, 'message')
                assert.property(err, 'description')
                assert.equal(err.message, 'Required fields were not provided...')
                assert.equal(err.description, 'User validation: username required!')
            } finally {
                user.username = 'health'
            }
        })

        it('should throw an error for does not pass password', () => {
            user.password = undefined

            try {
                CreateHealthProfessionalValidator.validate(user)
            } catch (err) {
                assert.property(err, 'message')
                assert.property(err, 'description')
                assert.equal(err.message, 'Required fields were not provided...')
                assert.equal(err.description, 'User validation: password required!')
            } finally {
                user.password = 'health123'
            }
        })

        it('should throw an error for does not pass email', () => {
            user.email = undefined

            try {
                CreateHealthProfessionalValidator.validate(user)
            } catch (err) {
                assert.property(err, 'message')
                assert.property(err, 'description')
                assert.equal(err.message, 'Required fields were not provided...')
                assert.equal(err.description, 'User validation: email required!')
            } finally {
                user.email = 'health@mail.com'
            }
        })

        it('should throw an error for invalid email', () => {
            user.email = 'invalid'

            try {
                CreateHealthProfessionalValidator.validate(user)
            } catch (err) {
                assert.property(err, 'message')
                assert.equal(err.message, 'Invalid email address!')
            } finally {
                user.email = 'health@mail.com'
            }
        })

        it('should throw an error for does not pass name', () => {
            user.name = undefined

            try {
                CreateHealthProfessionalValidator.validate(user)
            } catch (err) {
                assert.property(err, 'message')
                assert.property(err, 'description')
                assert.equal(err.message, 'Required fields were not provided...')
                assert.equal(err.description, 'User validation: name required!')
            } finally {
                user.name = 'health@mail.com'
            }
        })

        it('should throw an error for does not pass health area', () => {
            user.health_area = undefined

            try {
                CreateHealthProfessionalValidator.validate(user)
            } catch (err) {
                assert.property(err, 'message')
                assert.property(err, 'description')
                assert.equal(err.message, 'Required fields were not provided...')
                assert.equal(err.description, 'User validation: health_area required!')
            } finally {
                user.health_area = HealthAreaTypes.NUTRITION
            }
        })

        it('should throw an error for pass invalid health area', () => {
            user.health_area = 'ONCOLOGIST'

            try {
                CreateHealthProfessionalValidator.validate(user)
            } catch (err) {
                assert.property(err, 'message')
                assert.property(err, 'description')
                assert.equal(err.message, 'Health Area not mapped!')
                assert.equal(err.description, 'The mapped areas are: NUTRITION, DENTISTRY.')
            } finally {
                user.health_area = HealthAreaTypes.NUTRITION
            }
        })

        it('should throw an error for does not pass any of required parameters', () => {
            try {
                CreateHealthProfessionalValidator.validate(new HealthProfessional())
            } catch (err) {
                assert.property(err, 'message')
                assert.property(err, 'description')
                assert.equal(err.message, 'Required fields were not provided...')
                assert.equal(err.description, 'User validation: username, password required!')
            }
        })
    })
})
