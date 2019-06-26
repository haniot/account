import { PilotStudy } from '../model/pilot.study'
import { ValidationException } from '../exception/validation.exception'
import { ObjectIdValidator } from './object.id.validator'
import { Strings } from '../../../utils/strings'

export class UpdatePilotStudyValidator {
    public static validate(item: PilotStudy): void | ValidationException {
        if (item.id !== undefined) ObjectIdValidator.validate(item.id)
        if (item.health_professionals) {
            throw new ValidationException(Strings.ERROR_MESSAGE.PARAMETER_COULD_NOT_BE_UPDATED,
                'A specific route to manage health_professionals already exists.')
        }
        if (item.patients) {
            throw new ValidationException(Strings.ERROR_MESSAGE.PARAMETER_COULD_NOT_BE_UPDATED,
                'A specific route to manage health_professionals already exists.')
        }
    }
}
