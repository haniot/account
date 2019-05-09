import { ValidationException } from '../exception/validation.exception'
import { Strings } from '../../../utils/strings'

export class DateValidator {
    public static validate(value: string): void | ValidationException {
        if (!(/^([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))$/.test(value))) {
            throw new ValidationException(`Date: ${value} is not in valid ISO 8601 format.`,
                Strings.ERROR_MESSAGE.DATE_NOT_VALID_FORMAT_DESC)
        }
    }
}
