import { Patient } from '../model/patient'
import { ValidationException } from '../exception/validation.exception'
import { Strings } from '../../../utils/strings'
import { DateValidator } from './date.validator'
import { GenderTypesValidator } from './gender.types.validator'
import { ObjectIdValidator } from './object.id.validator'
import { UpdateUserValidator } from './update.user.validator'

export class UpdatePatientValidator {
    public static validate(item: Patient): void | ValidationException {
        UpdateUserValidator.validate(item)
        if (item.id) ObjectIdValidator.validate(item.id)
        if (item.pilot_studies) {
            throw new ValidationException('pilot_studies: '.concat(Strings.PARAMETERS.COULD_NOT_BE_UPDATED))
        }
        if (item.gender) GenderTypesValidator.validate(item.gender)
        if (item.birth_date) DateValidator.validate(item.birth_date)
    }
}
