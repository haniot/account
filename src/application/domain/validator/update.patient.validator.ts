import { Patient } from '../model/patient'
import { ValidationException } from '../exception/validation.exception'
import { GenderTypesValidator } from './gender.types.validator'
import { UpdateUserValidator } from './update.user.validator'
import { NumberValidator } from './number.validator'

export class UpdatePatientValidator {
    public static validate(item: Patient): void | ValidationException {
        UpdateUserValidator.validate(item)
        if (item.gender) GenderTypesValidator.validate(item.gender)
        if (item.goals) {
            if (item.goals.steps !== undefined) NumberValidator.validate(item.goals.steps, 'steps')
            if (item.goals.calories !== undefined) NumberValidator.validate(item.goals.calories, 'calories')
            if (item.goals.distance !== undefined) NumberValidator.validate(item.goals.distance, 'distance')
            if (item.goals.active_minutes !== undefined) NumberValidator.validate(item.goals.active_minutes, 'active_minutes')
            if (item.goals.sleep !== undefined) NumberValidator.validate(item.goals.sleep, 'sleep')
        }
    }
}
