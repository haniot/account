import { ValidationException } from '../exception/validation.exception'
import { HealthProfessional } from '../model/health.professional'
import { UpdateUserValidator } from './update.user.validator'
import { EmailValidator } from './email.validator'

export class UpdateHealthProfessionalValidator {
    public static validate(user: HealthProfessional): void | ValidationException {
        if (user.email) EmailValidator.validate(user.email)
        UpdateUserValidator.validate(user)
    }
}
