import { PilotStudy } from '../model/pilot.study'
import { ValidationException } from '../exception/validation.exception'
import { ObjectIdValidator } from './object.id.validator'
import { DataTypesValidator } from './data.types.validator'

export class UpdatePilotStudyValidator {
    public static validate(item: PilotStudy): void | ValidationException {
        if (item.id !== undefined) ObjectIdValidator.validate(item.id)

        if (item.data_types !== undefined) DataTypesValidator.validate(item.data_types)
    }
}
