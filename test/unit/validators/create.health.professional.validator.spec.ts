import { assert } from 'chai'
import { HealthProfessional } from '../../../src/application/domain/model/health.professional'
import { CreateHealthProfessionalValidator } from '../../../src/application/domain/validator/create.health.professional.validator'
import { DefaultEntityMock } from '../../mocks/default.entity.mock'

describe('Validators: CreateHealthProfessionalValidator', () => {
    const user: HealthProfessional = new HealthProfessional().fromJSON(DefaultEntityMock.HEALTH_PROFESSIONAL)

    it('should return undefined when the validation was successful', () => {
        const result = CreateHealthProfessionalValidator.validate(user)
        assert.equal(result, undefined)
    })

    context('when the user was incomplete or invalid', () => {
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
                user.password = DefaultEntityMock.HEALTH_PROFESSIONAL.password
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
                user.email = DefaultEntityMock.HEALTH_PROFESSIONAL.email
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
                user.email = DefaultEntityMock.HEALTH_PROFESSIONAL.email
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
                user.name = DefaultEntityMock.HEALTH_PROFESSIONAL.name
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
                user.health_area = DefaultEntityMock.HEALTH_PROFESSIONAL.health_area
            }
        })

        it('should throw an error for pass invalid health area', () => {
            user.health_area = 'oncologist'

            try {
                CreateHealthProfessionalValidator.validate(user)
            } catch (err) {
                assert.property(err, 'message')
                assert.property(err, 'description')
                assert.equal(err.message, 'Health Area not mapped!')
                assert.equal(err.description, 'The mapped areas are: nutrition, dentistry.')
            } finally {
                user.health_area = DefaultEntityMock.HEALTH_PROFESSIONAL.health_area
            }
        })

        it('should throw an error for does not pass any of required parameters', () => {
            try {
                CreateHealthProfessionalValidator.validate(new HealthProfessional())
            } catch (err) {
                assert.property(err, 'message')
                assert.property(err, 'description')
                assert.equal(err.message, 'Required fields were not provided...')
                assert.equal(err.description, 'User validation: password required!')
            }
        })
    })
})
