import { ValidationException } from '../exception/validation.exception'
import { HealthProfessional } from '../model/health.professional'
import { UpdateUserValidator } from './update.user.validator'
import { EmailValidator } from './email.validator'
import { HealthAreaValidator } from './health.area.validator'

export class UpdateHealthProfessionalValidator {
    public static validate(user: HealthProfessional): void | ValidationException {
        if (user.email) EmailValidator.validate(user.email)
        HealthAreaValidator.validate(user)
        UpdateUserValidator.validate(user)
    }
}
