import { Strings } from '../../../utils/strings'
import { ValidationException } from '../exception/validation.exception'

export class IntegerPositiveValidator {
    public static validate(value: number, fieldName: string): void | ValidationException {
        const regZone = new RegExp(/^0*[1-9][0-9]*$/i) // 1-n
        if (!(regZone.test(String(value)))) {
            throw new ValidationException(
                Strings.ERROR_MESSAGE.INVALID_FIELDS,
                Strings.ERROR_MESSAGE.INTEGER_GREATER_ZERO.replace('{0}', fieldName)
            )
        }
    }
}
