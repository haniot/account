import { assert } from 'chai'
import { HealthProfessional } from '../../../src/application/domain/model/health.professional'
import { CreateHealthProfessionalValidator } from '../../../src/application/domain/validator/create.health.professional.validator'
import { DefaultEntityMock } from '../../mocks/models/default.entity.mock'
import { Strings } from '../../../src/utils/strings'

describe('Validators: CreateHealthProfessionalValidator', () => {
    const user: HealthProfessional = new HealthProfessional().fromJSON(DefaultEntityMock.HEALTH_PROFESSIONAL)

    it('should return undefined when the validation was successful', () => {
        const result = CreateHealthProfessionalValidator.validate(user)
        assert.equal(result, undefined)
    })

    context('when the user was incomplete or invalid', () => {
        it('should throw an error for does not pass email', () => {
            user.email = undefined

            try {
                CreateHealthProfessionalValidator.validate(user)
            } catch (err) {
                assert.propertyVal(err, 'message', 'Required fields were not provided...')
                assert.propertyVal(err, 'description', 'Health Professional validation: email required!')
            }
        })

        it('should throw an error for invalid email', () => {
            user.email = 'invalid'

            try {
                CreateHealthProfessionalValidator.validate(user)
            } catch (err) {
                assert.propertyVal(err, 'message', 'Invalid email address!')
            } finally {
                user.email = DefaultEntityMock.HEALTH_PROFESSIONAL.email
            }
        })

        it('should throw an error for does not pass password', () => {
            user.password = undefined

            try {
                CreateHealthProfessionalValidator.validate(user)
            } catch (err) {
                assert.propertyVal(err, 'message', 'Required fields were not provided...')
                assert.propertyVal(err, 'description', 'Health Professional validation: password required!')
            } finally {
                user.password = DefaultEntityMock.HEALTH_PROFESSIONAL.password
            }
        })

        it('should throw an error for does not pass name', () => {
            user.name = undefined

            try {
                CreateHealthProfessionalValidator.validate(user)
            } catch (err) {
                assert.propertyVal(err, 'message', 'Required fields were not provided...')
                assert.propertyVal(err, 'description', 'Health Professional validation: name required!')
            } finally {
                user.name = DefaultEntityMock.HEALTH_PROFESSIONAL.name
            }
        })

        it('should throw an error for does not pass health area', () => {
            user.health_area = undefined

            try {
                CreateHealthProfessionalValidator.validate(user)
            } catch (err) {
                assert.propertyVal(err, 'message', 'Required fields were not provided...')
                assert.propertyVal(err, 'description', 'Health Professional validation: health_area required!')
            }
        })

        it('should throw an error for pass invalid health area', () => {
            user.health_area = 'oncologist'

            try {
                CreateHealthProfessionalValidator.validate(user)
            } catch (err) {
                assert.propertyVal(err, 'message', 'Health Area not mapped!')
                assert.propertyVal(err, 'description', 'The mapped areas are: nutrition, dentistry, ' +
                    'nursing, endocrinology, other.')
            } finally {
                user.health_area = DefaultEntityMock.HEALTH_PROFESSIONAL.health_area
            }
        })

        it('should throw an error for does not pass birth date', () => {
            user.birth_date = undefined

            try {
                CreateHealthProfessionalValidator.validate(user)
            } catch (err) {
                assert.propertyVal(err, 'message', 'Required fields were not provided...')
                assert.propertyVal(err, 'description', 'Health Professional validation: birth_date required!')
            }
        })

        it('should throw an error for pass invalid birth date', () => {
            user.birth_date = 'invalid'

            try {
                CreateHealthProfessionalValidator.validate(user)
            } catch (err) {
                assert.propertyVal(err, 'message', Strings.ERROR_MESSAGE.INVALID_DATE_FORMAT
                    .replace('{0}', 'invalid'))
                assert.propertyVal(err, 'description', Strings.ERROR_MESSAGE.INVALID_DATE_FORMAT_DESC)
            } finally {
                user.birth_date = DefaultEntityMock.HEALTH_PROFESSIONAL.birth_date
            }
        })

        it('should throw an error for does not pass any of required parameters', () => {
            try {
                CreateHealthProfessionalValidator.validate(new HealthProfessional())
            } catch (err) {
                assert.propertyVal(err, 'message', 'Required fields were not provided...')
                assert.propertyVal(err, 'description', 'Health Professional validation: email, password,' +
                    ' name, health_area, birth_date required!')
            }
        })
    })
})
