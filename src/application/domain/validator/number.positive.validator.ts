import { Strings } from '../../../utils/strings'
import { ValidationException } from '../exception/validation.exception'

export class NumberPositiveValidator {
    public static validate(value: number, fieldName: string): void | ValidationException {
        if (!(/^((0*[1-9][0-9]*(\.[0-9]+)?)|(0+\.[0-9]*[1-9][0-9]*))$/i).test(String(value))) {
            throw new ValidationException(
                Strings.ERROR_MESSAGE.INVALID_FIELDS,
                Strings.ERROR_MESSAGE.NUMBER_GREATER_ZERO.replace('{0}', fieldName))
        }
    }
}
