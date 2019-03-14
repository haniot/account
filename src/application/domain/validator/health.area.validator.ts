import { ValidationException } from '../exception/validation.exception'
import { HealthAreaTypes } from '../utils/health.area.types'

export class HealthAreaValidator {
    public static validate(health_area: string): void | ValidationException {
        if (!Object.keys(HealthAreaTypes).includes(health_area)) {
            throw new ValidationException('Health Area not mapped!', 'The mapped areas are: '
                .concat(Object.keys(HealthAreaTypes).join(', ').concat('.')))
        }
    }
}
