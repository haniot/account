import { ValidationException } from '../exception/validation.exception'
import { HealthProfessional } from '../model/health.professional'
import { HealthAreaTypes } from '../utils/health.area.types'

export class HealthAreaValidator {
    public static validate(user: HealthProfessional): void | ValidationException {
        if (user.health_area && !Object.keys(HealthAreaTypes).includes(user.health_area)) {
            throw new ValidationException('Health Area not mapped!', 'The mapped areas are: '
                .concat(Object.keys(HealthAreaTypes).join(', ').concat('.')))
        }
    }
}
