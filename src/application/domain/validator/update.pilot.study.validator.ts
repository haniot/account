import { PilotStudy } from '../model/pilot.study'
import { ValidationException } from '../exception/validation.exception'
import { ObjectIdValidator } from './object.id.validator'

export class UpdatePilotStudyValidator {
    public static validate(item: PilotStudy): void | ValidationException {
        if (item.id !== undefined) ObjectIdValidator.validate(item.id)
        if (item.health_professionals_id) {
            throw new ValidationException('This parameter could not be updated.',
                'A specific route to manage health_professionals_id already exists.')
        }
    }
}
