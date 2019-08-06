import { HealthProfessional } from '../model/health.professional'
import { ValidationException } from '../exception/validation.exception'
import { HealthAreaValidator } from './health.area.validator'
import { EmailValidator } from './email.validator'
import { DateValidator } from './date.validator'

export class CreateHealthProfessionalValidator {
    public static validate(user: HealthProfessional): void | ValidationException {
        const fields: Array<string> = []

        if (!user.email) fields.push('email')
        else EmailValidator.validate(user.email)
        if (!user.password) fields.push('password')
        if (!user.name) fields.push('name')
        if (!user.health_area) fields.push('health_area')
        else HealthAreaValidator.validate(user.health_area)
        if (!user.birth_date) fields.push('birth_date')
        else DateValidator.validate(user.birth_date)

        if (fields.length > 0) {
            throw new ValidationException('Required fields were not provided...',
                'User validation: '.concat(fields.join(', ')).concat(' required!'))
        }
    }
}
