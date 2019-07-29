import { Patient } from '../model/patient'
import { ValidationException } from '../exception/validation.exception'
import { DateValidator } from './date.validator'
import { GenderTypesValidator } from './gender.types.validator'
import { EmailValidator } from './email.validator'

export class CreatePatientValidator {
    public static validate(user: Patient): void | ValidationException {
        const fields: Array<string> = []
        if (!user.name) fields.push('name')
        if (user.email) EmailValidator.validate(user.email)
        if (!user.gender) fields.push('gender')
        else GenderTypesValidator.validate(user.gender)
        if (!user.birth_date) fields.push('birth_date')
        else DateValidator.validate(user.birth_date)

        if (fields.length > 0) {
            throw new ValidationException('Required fields were not provided...',
                'Patient validation: '.concat(fields.join(', ')).concat(' is required!'))
        }
    }
}
