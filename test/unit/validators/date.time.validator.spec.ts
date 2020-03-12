import { assert } from 'chai'
import { DatetimeValidator } from '../../../src/application/domain/validator/date.time.validator'
import { Strings } from '../../../src/utils/strings'

describe('Validators: DateTimeValidator', () => {
    it('should return undefined when the validation was successful', () => {
        const result = DatetimeValidator.validate('2018-01-02T00:04:03.000Z')
        assert.equal(result, undefined)
    })

    context('when there are validation errors', () => {
        it('should throw error when there are missing or invalid parameters', () => {
            try {
                DatetimeValidator.validate('02-08-2018')
            } catch (err) {
                assert.property(err, 'message')
                assert.property(err, 'description')
                assert.propertyVal(err, 'message', Strings.ERROR_MESSAGE.INVALID_DATETIME_FORMAT
                    .replace('{0}', '02-08-2018'))
                assert.propertyVal(err, 'description', Strings.ERROR_MESSAGE.INVALID_DATETIME_FORMAT_DESC)
            }
        })

        it('should throw error when day is invalid', () => {
            try {
                DatetimeValidator.validate('2020-04-32T10:00:00.000Z')
            } catch (err) {
                assert.property(err, 'message')
                assert.property(err, 'description')
                assert.propertyVal(err, 'message', Strings.ERROR_MESSAGE.INVALID_DATETIME_FORMAT
                    .replace('{0}', '2020-04-32T10:00:00.000Z'))
            }
        })

        it('should throw error when year is invalid', () => {
            try {
                DatetimeValidator.validate('2262-04-01T10:00:00.000Z')
            } catch (err) {
                assert.property(err, 'message')
                assert.property(err, 'description')
                assert.propertyVal(err, 'message', Strings.ERROR_MESSAGE.INVALID_DATETIME_FORMAT
                    .replace('{0}', '2262-04-01T10:00:00.000Z'))
            }
        })
    })
})
