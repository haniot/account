import { assert } from 'chai'
import { LanguageValidator } from '../../../src/application/domain/validator/language.validator'

describe('Validators: LanguageValidator', () => {
    it('should return undefined when the validation was successful', () => {
        const result = LanguageValidator.validate('pt-BR')
        assert.equal(result, undefined)
    })

    context('when there are missing or invalid parameters', () => {
        it('should throw error for does pass invalid language', () => {
            try {
                LanguageValidator.validate('invalid')
            } catch (err) {
                assert.propertyVal(err, 'message', 'The name of language provided invalid is not ' +
                    'supported...')
                assert.propertyVal(err, 'description', 'The names of the allowed language are: pt-BR,' +
                    ' en-US.')
            }
        })
    })
})
