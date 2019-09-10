import { ValidationException } from '../exception/validation.exception'
import { LanguageTypes } from '../utils/language.types'

export class LanguageValidator {
    public static validate(lang: LanguageTypes): void | ValidationException {
        const languageTypes = Object.values(LanguageTypes)

        if (!languageTypes.includes(lang)) {
            throw new ValidationException(`The name of language provided ${lang} is not supported...`,
                `The names of the allowed language are: ${languageTypes.join(', ')}.`)
        }
    }
}
