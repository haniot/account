import { ValidationException } from '../exception/validation.exception'
import { GenderTypes } from '../utils/gender.types'
import { Strings } from '../../../utils/strings'

export class GenderTypesValidator {
    public static validate(value: string): void | ValidationException {
        const genderTypes: Array<string> = Object.values(GenderTypes)

        if (!genderTypes.includes(value)) {
            throw new ValidationException(
                Strings.ENUM_VALIDATOR.NOT_MAPPED.concat(`gender: ${value}`),
                Strings.ENUM_VALIDATOR.NOT_MAPPED_DESC
                    .concat(Object.values(GenderTypes).join(', ').concat('.')))
        }
    }
}
