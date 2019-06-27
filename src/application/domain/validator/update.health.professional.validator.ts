import { ValidationException } from '../exception/validation.exception'
import { HealthProfessional } from '../model/health.professional'
import { UpdateUserValidator } from './update.user.validator'
import { HealthAreaValidator } from './health.area.validator'

export class UpdateHealthProfessionalValidator {
    public static validate(user: HealthProfessional): void | ValidationException {
        UpdateUserValidator.validate(user)
        if (user.health_area) HealthAreaValidator.validate(user.health_area)
    }
}
