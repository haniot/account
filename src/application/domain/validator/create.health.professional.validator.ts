import { HealthProfessional } from '../model/health.professional'
import { ValidationException } from '../exception/validation.exception'
import { CreateUserValidator } from './create.user.validator'
import { HealthAreaValidator } from './health.area.validator'

export class CreateHealthProfessionalValidator {
    public static validate(user: HealthProfessional): void | ValidationException {
        const fields: Array<string> = []

        CreateUserValidator.validate(user)
        if (!user.email) fields.push('email')
        if (!user.name) fields.push('name')
        if (!user.health_area) fields.push('health_area')
        else HealthAreaValidator.validate(user)

        if (fields.length > 0) {
            throw new ValidationException('Required fields were not provided...',
                'User validation failed: '.concat(fields.join(', ')).concat(' required!'))
        }
    }
}
