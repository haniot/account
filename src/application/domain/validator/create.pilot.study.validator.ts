import { PilotStudy } from '../model/pilot.study'
import { ValidationException } from '../exception/validation.exception'
import { DataTypesValidator } from './data.types.validator'

export class CreatePilotStudyValidator {
    public static validate(item: PilotStudy) {
        const fields: Array<string> = []

        if (!item.name) fields.push('name')
        if (item.is_active === undefined) fields.push('is_active')
        if (!item.start) fields.push('start')
        if (!item.end) fields.push('end')
        if (!item.data_types) fields.push('data_types')
        else DataTypesValidator.validate(item.data_types)

        if (fields.length > 0) {
            throw new ValidationException('Required fields were not provided...',
                'Pilot Study validation: '.concat(fields.join(', ')).concat(' required!'))
        }
    }
}
