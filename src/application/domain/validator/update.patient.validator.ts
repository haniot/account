import { Patient } from '../model/patient'
import { ValidationException } from '../exception/validation.exception'
import { GenderTypesValidator } from './gender.types.validator'
import { UpdateUserValidator } from './update.user.validator'

export class UpdatePatientValidator {
    public static validate(item: Patient): void | ValidationException {
        UpdateUserValidator.validate(item)
        if (item.gender) GenderTypesValidator.validate(item.gender)
    }
}
